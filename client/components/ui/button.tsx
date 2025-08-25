import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  showSparkIcon?: boolean;
  sparkPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      showSparkIcon = true,
      sparkPosition = "left",
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          "button-glow-animation",
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* Pulsing glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-orange-300/20 to-yellow-300/20 opacity-0 animate-pulse-glow pointer-events-none rounded-md" />

        {/* Content wrapper */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {showSparkIcon && sparkPosition === "left" && (
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F8a4c4b7392a543f5ad3f29cca02f0637?format=webp&width=800"
              alt=""
              className="w-4 h-4 animate-spin-slow brightness-110"
            />
          )}

          <span className="flex items-center gap-2">{children}</span>

          {showSparkIcon && sparkPosition === "right" && (
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F79b7dfd5cb0f4ca0b96e836c27c6ef40%2F8a4c4b7392a543f5ad3f29cca02f0637?format=webp&width=800"
              alt=""
              className="w-4 h-4 animate-spin-slow brightness-110"
            />
          )}
        </div>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
