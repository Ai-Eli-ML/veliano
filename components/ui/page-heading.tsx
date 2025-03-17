import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef } from "react"

interface PageHeadingProps extends ComponentPropsWithoutRef<"div"> {
  title: string
  description?: string
}

export function PageHeading({
  title,
  description,
  className,
  ...props
}: PageHeadingProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  )
} 