"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PersonaTagProps {
  tags: string[];
  verdict: string;
}

export default function PersonaTag({ tags, verdict }: PersonaTagProps) {
  const shareRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(async () => {
    if (!shareRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: "#0a0a0f",
        scale: 2,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;

        // Try native share first
        if (navigator.share && navigator.canShare?.({ files: [new File([], '')] })) {
          const file = new File([blob], "love-audit-result.png", { type: "image/png" });
          navigator.share({ files: [file], title: "LoveAudit 测评结果" }).catch(() => {
            downloadImage(blob);
          });
        } else {
          downloadImage(blob);
        }
      });
    } catch {
      // Fallback: just download
      alert("图片生成中，请稍后再试");
    }
  }, []);

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "love-audit-result.png";
    a.click();
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
          {/* Shareable card */}
          <div
            ref={shareRef}
            className="bg-gradient-to-br from-[#12121a] to-[#1a1025] rounded-xl p-6 border border-purple-500/20 space-y-4"
          >
            <div className="text-center">
              <p className="text-xs font-mono text-cyan-400/60 tracking-widest">LOVEAUDIT</p>
              <p className="text-lg font-bold text-glow-purple mt-1">{verdict}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-center text-muted-foreground/40 font-mono">
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
            >
              保存/分享图片
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
