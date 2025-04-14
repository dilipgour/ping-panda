import { DashboardPage } from '@/app/components/dashboard-page'
import { db } from '@/server/db'
import { RedirectToSignIn } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardPageContent } from './_components/dashboard-page-content'
import { Button } from '@/app/components/ui/button'
import { CreateEventCategoryModal } from '@/app/components/create-event-category-modal'
import { PlusIcon } from 'lucide-react'
import { PaymentSuccessModal } from '@/app/components/payment-success-modal'

interface PageProps {
    searchParams: {
      [key: string]: string | string[] | undefined
    }
  }

export default async function page({searchParams}:PageProps) {

    const auth = await currentUser()

    if(!auth){
        return <RedirectToSignIn/>
    }

    const user = await db.user.findFirst({
        where:{
            externalId:auth.id
        }
    })

    if(!user){
        return redirect("/auth-callback")
    }

    const success = searchParams?.status =="succeeded"


  return (
    <>
    {success ? <PaymentSuccessModal/>:null}
    <DashboardPage title='Dashboard' cta={ 
    <CreateEventCategoryModal>
        <Button className='cursor-pointer'>
            <PlusIcon className='size-4 mr-2'/>
            Add category
        </Button>
    </CreateEventCategoryModal>
    }>
<DashboardPageContent/>
    </DashboardPage>
    </>
  )
}
