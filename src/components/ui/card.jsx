import { cn } from "../../lib/utils"

export function Card({ className, children }) {
  return (
    <div className={cn("rounded-[var(--radius)] border border-border bg-card", className)}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn("p-6", className)}>{children}</div>
}

export function CardContent({ className, children }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>
}

export function CardFooter({ className, children }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>
}

