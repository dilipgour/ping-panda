import { DashboardPage } from "@/app/components/dashboard-page"
import { db } from "@/server/db"
import { currentUser } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import { DashboardEmptyState } from "../../_components/dashboard-empty-state"
import { CategoryPageContent } from "./_components/category-page-content"

interface pageProps{
    params:{
        name:string
    }
}

export default async function page({params}:pageProps) {
    const {name} = await params

    if(typeof name !== "string"){
        return notFound()
    }
    const auth = await currentUser()

    if(!auth){
        return redirect("/sign-in")
    }

    const user = await db.user.findFirst({
        where :{
            externalId:auth.id
        }
    })
    if(!user){
        return  redirect("/auth-callback")
    }

    const category = await db.eventCategory.findUnique({
        where:{ userId_name:{
            name,
            userId:user.id
        } },
        include:{
            _count:{
                select:{
                    events:true
                }
            }
        }
    })

    if(!category){
        return notFound()
    }

    const hasEvents = category._count.events>0
    
    


  return (
    <DashboardPage title={`${category.emoji} ${category.name}  Events`} >
       <CategoryPageContent hasEvents={hasEvents} category={category}/>
        </DashboardPage>
  )
}
