import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, ...props }) {
  return (
    <div className={twMerge("rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}
