import Link from "next/link"
import { MaxWidthWrapper } from "./max-width-wrapper"
import { Button, buttonVariants } from "./ui/button"
import { currentUser } from "@clerk/nextjs/server"
import { SignOutButton } from "@clerk/nextjs"
import { ArrowRight } from "lucide-react"

export const Navbar = async () => {
    const user= await currentUser()
  return (
   <nav className="sticky z-[100] h-16 inset-x-0 top-0 w-full border-b border-gray-200 backdrop-blur-lg bg-white transition-all">
<MaxWidthWrapper>
    <div className="flex h-full items-center justify-between ">
        <Link href={"/"} className="flex z-40 font-semibold">
        Ping<span className="text-brand-800">Panda</span>
        </Link>
        <div className="h-full flex items-center gap-x-4">
            {
                user?
                <>
                <SignOutButton>
                <Button variant="outline" size="sm" className="cursor-pointer"
                >Sign out</Button>
                </SignOutButton>
                <Link href={"/dashboard"} className={buttonVariants({
                    size:"sm",
                    className:"flex items-center gap-1"
                })}> Dashboard <ArrowRight className="size-4"/></Link>
                </>
                :
                <>
                <Link href={"/pricing"} className={buttonVariants({
                    size:"sm",
                    variant:"ghost"
                })}>Pricing</Link>
                <Link href={"/sign-in"} className={buttonVariants({
                    size:"sm",
                    variant:"ghost"
                })}>Sign in </Link>
                <Link href={"/sign-up"} className={buttonVariants({
                    size:"sm",
                    className:"flex items-center gap-x-1.5"
                })}>Sign up <ArrowRight className="size-4"/> </Link>
                </>
            }

        </div>
    </div>
</MaxWidthWrapper>
   </nav>
  )
}
