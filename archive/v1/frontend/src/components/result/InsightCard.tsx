"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsightCardProps {
  title: string;
  items: string[];
  variant?: "positive" | "attention" | "neutral";
  icon?: React.ReactNode;
}

export function InsightCard({
  title,
  items,
  variant = "neutral",
  icon,
}: InsightCardProps) {
  const getBorderColor = () => {
    switch (variant) {
      case "positive":
        return "border-l-green-500";
      case "attention":
        return "border-l-yellow-500";
      default:
        return "border-l-primary";
    }
  };

  const getIconBg = () => {
    switch (variant) {
      case "positive":
        return "bg-green-100 text-green-600";
      case "attention":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className={`border-l-4 ${getBorderColor()}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon && (
            <span className={`p-1.5 rounded-full ${getIconBg()}`}>{icon}</span>
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-muted-foreground"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
