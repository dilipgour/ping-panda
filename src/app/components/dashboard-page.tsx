"use client";
import { ReactNode } from "react"
import { Button } from "./ui/button"
import { ArrowLeft } from "lucide-react"
import { Heading } from "./heading"
import { useRouter } from "next/navigation"

interface DashboardPageProps{
    title:string
    children?:ReactNode
    hideBackButton?:boolean
    cta?:ReactNode


}

export const DashboardPage = ({title,children,cta,hideBackButton}:DashboardPageProps) => {
  const router = useRouter()
  return (
    <section className="flex-1 h-full w-full flex-col">

        <div className="flex md:p-4 p-8  justify-between border-b border-gray-200">
<div className="flex  sm:flex-row sm:items-center gap-y-2 gap-x-8 justify-between  w-full ">
   <div className="space-x-3 flex">    
    {hideBackButton?null:
    <Button className="w-fil bg-white" variant="outline" onClick={()=> router.push("/dashboard")}>
        <ArrowLeft className="size-4"/>
        </Button>}
        <Heading className="">{title}</Heading>
        </div>

        {cta? <div className="mr-2">{cta}</div>:null}

    </div>
</div>

       <div className="flex-1 p-8 md:p-6 flex-col">
        {children}
       </div>

    </section>
  )
}
