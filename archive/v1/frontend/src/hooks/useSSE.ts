import { useCallback, useRef, useState } from "react";

interface SSEOptions {
  onMessage?: (data: unknown) => void;
  onError?: (error: Error) => void;
  onComplete?: (result: unknown) => void;
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
      // Abort any existing connection
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsConnected(true);
      setError(null);

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
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Parse SSE events from buffer
          const lines = buffer.split("\n");
          buffer = lines.pop() || ""; // Keep incomplete line in buffer

          let currentEvent: Partial<SSEEvent> = {};

          for (const line of lines) {
            if (line.startsWith("event:")) {
              currentEvent.event = line.slice(6).trim();
            } else if (line.startsWith("data:")) {
              currentEvent.data = line.slice(5).trim();
            } else if (line === "" && currentEvent.data) {
              // End of event
              try {
                const parsedData = JSON.parse(currentEvent.data);

                if (currentEvent.event === "chunk" && options.onMessage) {
                  options.onMessage(parsedData);
                } else if (
                  currentEvent.event === "complete" &&
                  options.onComplete
                ) {
                  options.onComplete(parsedData);
                } else if (currentEvent.event === "error") {
                  const err = new Error(parsedData.error || "Unknown error");
                  setError(err);
                  options.onError?.(err);
                }
              } catch {
                // If parsing fails, pass raw data
                if (options.onMessage) {
                  options.onMessage({ content: currentEvent.data });
                }
              }
              currentEvent = {};
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err);
          options.onError?.(err);
        }
      } finally {
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

  return {
    connect,
    disconnect,
    isConnected,
    error,
  };
}
