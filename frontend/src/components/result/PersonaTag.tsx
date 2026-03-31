"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PersonaTagProps {
  tags: string[];
  verdict: string;
}

export default function PersonaTag({ tags, verdict }: PersonaTagProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-display text-neon/80">
            你的关系情况
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            style={{
              fontSize: "1.125rem",
              fontWeight: "bold",
              fontFamily: "var(--font-noto-serif), var(--font-cormorant), serif",
              color: "#d4748a",
              textShadow: "0 0 10px #9b1c31, 0 0 20px rgba(155, 28, 49, 0.3)",
              textAlign: "center",
              marginBottom: "0.75rem",
            }}
          >
            {verdict}
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "center",
            }}
          >
            {tags.map((tag, i) => (
              <span
                key={i}
                style={{
                  fontSize: "0.75rem",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "9999px",
                  border: "1px solid rgba(155, 28, 49, 0.3)",
                  backgroundColor: "rgba(155, 28, 49, 0.1)",
                  color: "#e8a0b4",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
