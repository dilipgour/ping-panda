import { cn } from "@/lib/utils"
import {  HTMLAttributes, ReactNode } from "react"


interface HeadingProps extends HTMLAttributes<HTMLHeadingElement>{
    children:ReactNode
}

export const Heading = ({children,className,...props}:HeadingProps) => {
    
  return (
    <h1 className={cn("md:text-4xl text-5xl text-pretty font-serif font-semibold tracking-tight text-zinc-900",className)}>
{children}
    </h1>
  )
}
