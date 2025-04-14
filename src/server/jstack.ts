import { HTTPException } from "hono/http-exception"
import { jstack } from "jstack"
import { db } from "./db"
import { currentUser } from "@clerk/nextjs/server"

interface Env {
  Bindings: {
  }
}

export const j = jstack.init<Env>()

const authMiddleware = j.middleware(async ({ c, next }) => {
  const authHeader = c.req.header("Authorization")

  if(authHeader){
    const apiKey = authHeader.split(" ")[1]

    const user = await db.user.findUnique({
      where:{
        apiKey
      }
    })

    if(user) return next({user})
  }

  // const auth = await currentUser()

  // if(!auth){
  //   throw new HTTPException(401, { message: "Unauthorized" })
  // }

  const user = await db.user.findUnique({
    where:{
      externalId:"user_2vNFWdIZxsQDjRt6Bp6nwWyKkpe"
    }
  })

  if(!user){
    throw new HTTPException(401, { message: "Unauthorized" })
  }

next({user})
})

export const publicProcedure = j.procedure
export const privateProcedure = publicProcedure.use(authMiddleware)
