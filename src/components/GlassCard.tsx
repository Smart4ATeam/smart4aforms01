import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  style?: CSSProperties;
}

export const GlassCard = ({
  children,
  className,
  glow = true,
  hover = true,
  style,
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300",
        hover && "glass-hover",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default GlassCard;
