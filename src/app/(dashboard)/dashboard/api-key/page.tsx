import { DashboardPage } from '@/app/components/dashboard-page'
import { db } from '@/server/db'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { ApiKeySettings } from './api-key-settings'

export default async function page() {
    const auth = await currentUser()

    if(!auth){
        return redirect("/sign-in")
    }
    const user = await db.user.findUnique({
        where:{
            externalId:auth.id
        }
    })

    if(!user){
        return redirect("/auth-callback")
    }

  return (
    <DashboardPage title='API Key'>
<ApiKeySettings apiKey={user.apiKey}/>
    </DashboardPage>
  )
}   
