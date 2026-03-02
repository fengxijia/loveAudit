"use client";

import { useEffect, useState } from "react";

interface ScoreDisplayProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function ScoreDisplay({
  score,
  label,
  size = "md",
  animated = true,
}: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      current = Math.min(score, increment * frame);
      setDisplayScore(current);

      if (frame >= steps) {
        clearInterval(timer);
        setDisplayScore(score);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  const sizeClasses = {
    sm: "w-24 h-24 text-2xl",
    md: "w-32 h-32 text-4xl",
    lg: "w-40 h-40 text-5xl",
  };

  const getScoreColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getGradient = (value: number) => {
    if (value >= 80) return "from-green-500 to-emerald-500";
    if (value >= 60) return "from-yellow-500 to-amber-500";
    return "from-orange-500 to-red-500";
  };

  // Calculate circumference and offset for circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                className={`${
                  displayScore >= 80
                    ? "stop-color-green-500"
                    : displayScore >= 60
                    ? "stop-color-yellow-500"
                    : "stop-color-orange-500"
                }`}
                style={{
                  stopColor:
                    displayScore >= 80
                      ? "#22c55e"
                      : displayScore >= 60
                      ? "#eab308"
                      : "#f97316",
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor:
                    displayScore >= 80
                      ? "#10b981"
                      : displayScore >= 60
                      ? "#f59e0b"
                      : "#ef4444",
                }}
              />
            </linearGradient>
          </defs>
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${getScoreColor(displayScore)}`}>
            {Math.round(displayScore)}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>

      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
