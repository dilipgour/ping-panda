import { currentUser } from "@clerk/nextjs/server"
import { j, publicProcedure } from "../jstack"
import { db } from "../db"




export const authRouter = j.router({

  getDatabaseSyncStatus :publicProcedure.get( async ({c,ctx})=>{
    const auth = await currentUser()

    if(!auth|| auth==undefined ){

                return c.json({isSynced:false})
    }

    const user = await db.user.findFirst({
        where:{
           externalId:auth.id 
        }
    })
    if(!user){
        await db.user.create({
            data:{
                externalId:auth.id,
                email:auth.emailAddresses[0]!.emailAddress,
                quotaLimit:100
            }
        })
        return c.json({isSynced:true})
    }
    
    return c.json({isSynced:true})

  })
})
