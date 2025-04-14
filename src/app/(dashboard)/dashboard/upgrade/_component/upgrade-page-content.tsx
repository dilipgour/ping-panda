"use client";

import { Card } from "@/app/components/card";
import { client } from "@/lib/client";
import { useUser } from "@clerk/nextjs";
import { Plan } from "@prisma/client"
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { BarChart } from "lucide-react";
import { useRouter } from "next/navigation"

export const UpgradePageContent = ({plan}:{plan:Plan}) => {
    const router = useRouter()
    const {isLoaded,isSignedIn,user} = useUser()

    const {data:usage,isPending} = useQuery({
        queryKey:["usage"],
        queryFn:async()=>{
            const res = await client.project.getUsages.$get()
            return await res.json()

        }
    })

    const createCheckOutSession = ()=>{
      if(!isLoaded)  return
      if(!isSignedIn) {
        console.log("clerk madharchodh")
        return 
      }

      let checkoutUrl = `https://test.checkout.dodopayments.com/buy/${process.env.NEXT_PUBLIC_DODO_PAYMENTS_PRODUCT_ID}?quantity=1&redirect_url=${process.env.NEXT_PUBLIC_PAYMENT_SUCCESS_REDIRECT_URL}&metadata_userId=${user.id}`
        router.push(checkoutUrl)

    }
  return (
    <div className="max-w-3xl flex flex-col gap-8">
<div>
    <h1 className="mt-2 text-xl/8 font-medium tracking-tight text-gray-900">
    {plan==="PRO"?"Plan : Pro":"Plan : Free"}
  
    </h1>
    <p className="text-sm text-gray-600 max-w-prose">
        {plan==="PRO"? "Thank you for supporting PingPanda. Find your increased usage limits below.":"Get access to more events, categories and premium."}
   
    </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Card className="border-2 border-brand-700">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm/6 font-medium">Total Events</p>
                <BarChart className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usage?.eventsUsed||0} of {usage?.eventsLimit.toLocaleString()||0 }</p>
                <p className=" text-xs/5 text-muted-foreground">
                  Events this period 
                </p>
              </div>
            </Card>


            <Card className="border-2">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm/6 font-medium">Events categories</p>
                <BarChart className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usage?.categoriesUsed||0} of {usage?.categoriesLimits.toLocaleString()||0}</p>
                <p className=" text-xs/5 text-muted-foreground">
                Active categories 
                </p>
              </div>
            </Card>
</div>
<p className="text-sm text-gray-500">
  Usage will reset{usage?.resetDate ? (format(usage.resetDate,"MMM,d,yyyy")) :(<span className="animate-pulse w-8 h-4 bg-gray-200"></span>)}
 

  {plan!=="PRO"? <span onClick={createCheckOutSession} className="underline cursor-pointer text-brand-600 inline"> {" "}  or upgrade now to increase your limit &arr;</span>:null}
  </p>
    </div>
  )
}
