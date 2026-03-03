import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Size variants
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg",
          // Style variants
          variant === "primary" && [
            "bg-gradient-to-r from-accent via-primary to-[hsl(320,80%,55%)] text-white",
            "hover:opacity-90 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.5)]",
            "active:scale-[0.98]",
          ],
          variant === "secondary" && [
            "glass",
            "hover:bg-card/60",
            "active:scale-[0.98]",
          ],
          variant === "ghost" && [
            "bg-transparent text-foreground",
            "hover:bg-muted/30",
            "active:scale-[0.98]",
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GlowButton.displayName = "GlowButton";

export default GlowButton;
