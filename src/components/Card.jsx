import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, ...props }) {
  return (
    <div className={twMerge("rounded-xl border border-border bg-surface text-text-primary shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}
