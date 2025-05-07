import type { ReactNode, ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "outline" | "ghost" | "link"
  size?: "sm" | "md" | "lg" | "icon"
  className?: string
}

export default function Button({ children, variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2B9DDA] disabled:opacity-50"

  const variantStyles = {
    primary: "bg-[#2B9DDA] hover:bg-[#2589c2] text-white rounded-full",
    outline: "border border-[#3A4358] bg-transparent hover:bg-[#3A4358] text-white rounded-full",
    ghost: "bg-transparent hover:bg-[#3A4358] text-white rounded-md",
    link: "bg-transparent underline-offset-4 hover:underline text-[#2B9DDA] hover:text-[#2589c2]",
  }

  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6",
    icon: "h-9 w-9",
  }

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

