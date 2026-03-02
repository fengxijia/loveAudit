"use client";

import { useEffect, useState } from "react";

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  className?: string;
}

export function StreamingText({
  text,
  isStreaming,
  className = "",
}: StreamingTextProps) {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  // Update display text with streaming effect
  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  // Blinking cursor effect
  useEffect(() => {
    if (!isStreaming) {
      setCursorVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {displayText}
      {isStreaming && (
        <span
          className={`inline-block w-2 h-4 bg-primary ml-0.5 ${
            cursorVisible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}
