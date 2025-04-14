import { j, privateProcedure } from "../jstack"




export const paymentRouter = j.router({
    getUserPlan: privateProcedure.get(async ({ c, ctx }) => {
        const { user } = ctx
        return c.json({ plan: user.plan })
      }),
  
})
