import { Card } from "@/app/components/card"
import { CreateEventCategoryModal } from "@/app/components/create-event-category-modal"
import { Button } from "@/app/components/ui/button"
import { client } from "@/lib/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const DashboardEmptyState = () => {
    const queryClient = useQueryClient()
    const {mutate:insertQuickstartCategories,isPending} = useMutation({
        mutationFn:async()=>{
           const res = await client.category.insertQuickstartCategories.$post()
           return await res.json()
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["user-event-categories"]})
        }
    })


  return (
    <Card className="flex flex-col justify-center items-center p-6 rounded-2xl flex-1 text-center">
<div className="flex justify-center w-full">
    <img 
    src="/brand-asset-wave.png"
    alt="No categories"
    className="size-48 mt-24"
    />
    
</div>
<h1 className="m-2 text-xl/8 font-medium tracking-tight text-gray-900">
    No Events Categories Yet
    </h1>
    <p className="text-sm/6 text-gray-600 max-w-prose mt-2 mb-8">
    Start tracking your events by creating your first category.
    </p>
    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-x-4 md:space-y-0">
        <Button 
        variant="outline"
         className="flex items-center md:w-auto w-full "
         onClick={()=>insertQuickstartCategories()}
         disabled={isPending}>
            <span className="size-4 mr-2">🚀</span>
            <span className="">{isPending?"Creating...":"Quickstart"}</span>
            </Button>

            <CreateEventCategoryModal>
            <Button 
         className="flex items-center md:w-auto w-full "
         disabled={isPending}>
            Add Category
            </Button>

            </CreateEventCategoryModal>
    </div>
    </Card>
  )
}
