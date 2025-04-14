import { DashboardPage } from '@/app/components/dashboard-page'
import { db } from '@/server/db'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'
import { AccountSettings } from './settings-page-content'

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
    <DashboardPage title='Account Settings'>
<AccountSettings discordId={user.discordId??""}/>
    </DashboardPage>
  )
}   
