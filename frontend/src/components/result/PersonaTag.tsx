"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PersonaTagProps {
  tags: string[];
  verdict: string;
}

// html2canvas 1.x cannot parse Tailwind CSS 4's lab()/oklch() color functions.
// All colors inside the shareable card MUST use inline hex styles.
const shareCardStyles = {
  container: {
    background: "linear-gradient(to bottom right, #12121a, #1a1025)",
    borderRadius: "0.75rem",
    padding: "1.5rem",
    border: "1px solid rgba(168, 85, 247, 0.2)",
  },
  header: {
    fontSize: "0.75rem",
    fontFamily: "monospace",
    color: "rgba(34, 211, 238, 0.6)",
    letterSpacing: "0.1em",
    textAlign: "center" as const,
  },
  verdict: {
    fontSize: "1.125rem",
    fontWeight: "bold",
    color: "#a855f7",
    textShadow: "0 0 10px #a855f7, 0 0 20px rgba(168, 85, 247, 0.3)",
    textAlign: "center" as const,
    marginTop: "0.25rem",
  },
  tagsWrapper: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
    justifyContent: "center",
    marginTop: "1rem",
  },
  tag: {
    fontSize: "0.75rem",
    padding: "0.375rem 0.75rem",
    borderRadius: "9999px",
    border: "1px solid rgba(168, 85, 247, 0.3)",
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    color: "#d8b4fe",
  },
  footer: {
    fontSize: "10px",
    textAlign: "center" as const,
    color: "rgba(148, 163, 184, 0.4)",
    fontFamily: "monospace",
    marginTop: "1rem",
  },
};

export default function PersonaTag({ tags, verdict }: PersonaTagProps) {
  const shareRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const handleShare = useCallback(async () => {
    if (!shareRef.current || saving) return;
    setSaving(true);

    try {
      const mod = await import("html2canvas");
      const html2canvas = (typeof mod.default === "function" ? mod.default : mod) as (
        el: HTMLElement,
        opts?: Record<string, unknown>
      ) => Promise<HTMLCanvasElement>;

      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: "#0a0a0f",
        scale: 2,
        useCORS: true,
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) {
        alert("图片生成失败，请重试");
        return;
      }

      // Try native share first (mobile)
      if (navigator.share && navigator.canShare?.({ files: [new File([], "")] })) {
        const file = new File([blob], "love-audit-result.png", { type: "image/png" });
        try {
          await navigator.share({ files: [file], title: "LoveAudit 测评结果" });
          return;
        } catch {
          // User cancelled or share failed — fall through to download
        }
      }

      downloadImage(blob);
    } catch (e) {
      console.error("html2canvas error:", e);
      alert("图片生成失败，请重试");
    } finally {
      setSaving(false);
    }
  }, [saving]);

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "love-audit-result.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-mono text-cyan-400/80">
            🏷️ 你的关系人设
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Shareable card — uses inline hex styles for html2canvas compatibility */}
          <div ref={shareRef} style={shareCardStyles.container}>
            <div>
              <p style={shareCardStyles.header}>LOVEAUDIT</p>
              <p style={shareCardStyles.verdict}>{verdict}</p>
            </div>
            <div style={shareCardStyles.tagsWrapper}>
              {tags.map((tag, i) => (
                <span key={i} style={shareCardStyles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
            <p style={shareCardStyles.footer}>
              loveaudit.app · AI亲密关系解码
            </p>
          </div>

          {/* Share button */}
          <div className="mt-4 flex gap-3">
            <Button
              variant="neon"
              size="sm"
              onClick={handleShare}
              className="flex-1"
              disabled={saving}
            >
              {saving ? "生成中..." : "保存/分享图片"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
