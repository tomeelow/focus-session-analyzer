import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({ children, className, variant = 'primary', ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

  const variants = {
    primary: "bg-accent text-accent-foreground hover:opacity-90 shadow-sm",
    secondary: "bg-surface-highlight text-text-primary hover:bg-border",
    outline: "border border-border bg-background hover:bg-surface text-text-primary shadow-sm",
    ghost: "hover:bg-surface-highlight text-text-primary",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
