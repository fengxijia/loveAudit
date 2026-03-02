"use client";

import { useRef, useEffect } from "react";
import type { DimensionScore } from "@/types/assessment";

interface RadarChartProps {
  scores: DimensionScore[];
}

export function RadarChart({ scores }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 64;
    const n = scores.length;
    const angleStep = (Math.PI * 2) / n;
    const startAngle = -Math.PI / 2;

    // Get CSS colors
    const style = getComputedStyle(canvas);
    const textColor = style.color || "#334155";

    // Color palette
    const gridColor = "rgba(148,163,184,0.25)";
    const gridLabelColor = "rgba(100,116,139,0.6)";
    const accentColor = "rgba(99,102,241,1)";
    const accentFill = "rgba(99,102,241,0.15)";
    const dotColor = "rgba(99,102,241,1)";
    const glowColor = "rgba(99,102,241,0.3)";

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw grid rings
    const rings = [20, 40, 60, 80, 100];
    for (const ring of rings) {
      const r = (ring / 100) * radius;
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = startAngle + i * angleStep;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axis lines
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw ring labels (right side)
    ctx.font = "10px system-ui, sans-serif";
    ctx.fillStyle = gridLabelColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (const ring of [20, 40, 60, 80, 100]) {
      const r = (ring / 100) * radius;
      ctx.fillText(`${ring}`, cx + 4, cy - r - 2);
    }

    // Draw data polygon with glow
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      const val = Math.min(scores[i].score, 100);
      const r = (val / 100) * radius;
      points.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }

    // Glow effect
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = accentFill;
    ctx.fill();
    ctx.restore();

    // Data polygon stroke
    ctx.beginPath();
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.closePath();
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();
    ctx.fillStyle = accentFill;
    ctx.fill();

    // Data dots
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = dotColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Dimension labels with scores
    ctx.textBaseline = "middle";
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      const labelR = radius + 32;
      const lx = cx + labelR * Math.cos(angle);
      const ly = cy + labelR * Math.sin(angle);

      // Align text based on position
      const cos = Math.cos(angle);
      if (cos > 0.3) ctx.textAlign = "left";
      else if (cos < -0.3) ctx.textAlign = "right";
      else ctx.textAlign = "center";

      // Dimension name
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.fillStyle = textColor;
      ctx.fillText(scores[i].name, lx, ly - 8);

      // Score value
      ctx.font = "bold 14px system-ui, sans-serif";
      ctx.fillStyle = accentColor;
      ctx.fillText(`${Math.round(scores[i].score)}`, lx, ly + 10);
    }
  }, [scores]);

  return (
    <div className="w-full flex justify-center">
      <canvas
        ref={canvasRef}
        className="text-foreground"
        style={{ width: 440, height: 420 }}
      />
    </div>
  );
}
