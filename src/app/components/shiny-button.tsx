import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { AnchorHTMLAttributes } from "react"

interface ShinyButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement>{}


export const ShinyButton = ({className,children,href,...props}:ShinyButtonProps) => {
  return (
    <Link href={href??"#"} className={cn("relative group transform flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md border border-white bg-brand-700 px-8 text-base/7 text-white font-medium transition-all duration-300 hover:ring-2 hover:ring-brand-200 focus:outline-none focus:ring-2 focus:ring-offset-2  ", className)}  {...props}>

<span className="relative flex items-center gap-2 z-10">
    {children}
    <ArrowRight className="size-4 transition-transform duration-300 ease-in-out shrink-0 group-hover:translate-x-[2px] text-white"/>
</span>
<div className="ease-[cubic-bezier(0.19,1,0.22,1)] absolute -left-[75px] -top-[50px] -z-10  h-[155px] w-8 rotate-[35deg] bg-white/20 transition-all duration-700 group-hover:left-[120%] "/>
    </Link>
  )
}
