import { useCallback, useRef, useState } from "react";

interface SSEOptions {
  onMessage?: (data: unknown) => void;
  onError?: (error: Error) => void;
  onComplete?: (result: unknown) => void;
  timeoutMs?: number;
}

interface SSEEvent {
  event: string;
  data: string;
}

export function useSSE(url: string, options: SSEOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const connect = useCallback(
    async (body: unknown) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsConnected(true);
      setError(null);

      // Timeout: abort if no completion within timeoutMs
      const timeoutMs = options.timeoutMs ?? 90000;
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
        const err = new Error("Analysis timed out / 分析超时，请重试");
        setError(err);
        options.onError?.(err);
      }, timeoutMs);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify(body),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();
        let buffer = "";
        let currentEvent: Partial<SSEEvent> = {};

        const processEvent = () => {
          if (!currentEvent.data) return;
          try {
            const parsedData = JSON.parse(currentEvent.data);
            if (currentEvent.event === "chunk" && options.onMessage) {
              options.onMessage(parsedData);
            } else if (currentEvent.event === "complete" && options.onComplete) {
              clearTimeout(timeoutId);
              options.onComplete(parsedData);
            } else if (currentEvent.event === "error") {
              clearTimeout(timeoutId);
              const err = new Error(parsedData.error || "Unknown error");
              setError(err);
              options.onError?.(err);
            }
          } catch {
            if (options.onMessage) {
              options.onMessage({ content: currentEvent.data });
            }
          }
          currentEvent = {};
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("event:")) {
              currentEvent.event = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              currentEvent.data = line.slice(5).trim();
            } else if (line === "") {
              processEvent();
            }
          }
        }

        // Flush any remaining buffered event after stream ends
        if (buffer.trim()) {
          const lines = buffer.split("\n");
          for (const line of lines) {
            if (line.startsWith("event:")) {
              currentEvent.event = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              currentEvent.data = line.slice(5).trim();
            }
          }
        }
        processEvent();
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err);
          options.onError?.(err);
        }
      } finally {
        clearTimeout(timeoutId);
        setIsConnected(false);
      }
    },
    [url, options]
  );

  const disconnect = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsConnected(false);
  }, []);

  return { connect, disconnect, isConnected, error };
}
