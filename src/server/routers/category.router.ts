import { j, privateProcedure } from "../jstack";
import { db } from "../db";
import { startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { z } from "zod";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { parseColor } from "@/lib/utils";
import { HTTPException } from "hono/http-exception";
import { FREE_QUOTA, PRO_QUOTA } from "@/config";

const EVENT_CATEGORY_VALIDATOR = z.object({
  name: CATEGORY_NAME_VALIDATOR,
  color: z
    .string({
      required_error: "Color is required.",
    })
    .min(1, "Color is required.")
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format."),
  emoji: z.string().emoji("Invalid emoji").optional(),
});

export const categoryRouter = j.router({
  getEventCategories: privateProcedure.get(async ({ c, ctx }) => {
    const { user } = ctx;
    console.log("passed")

    const categories = await db.eventCategory.findMany({
      where: {  
        userId: user.id,
      },
      select: {
        id: true,
        name: true,
        emoji: true,
        color: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const now = new Date();
        const firstDayOfMonth = startOfMonth(now);

        const [uniqueFieldCount, eventsCount, lastPing] = await Promise.all([
          db.event
            .findMany({
              where: {
                eventCategoryId: category.id,
                createdAt: { gte: firstDayOfMonth },
              },
              select: { fields: true },
              distinct: ["fields"],
            })
            .then((events) => {
              const fieldNames = new Set<string>();

              events.forEach((event) => {
                Object.keys(event.fields as Object).forEach((fieldName) => {
                  fieldNames.add(fieldName);
                });
              });

              return fieldNames.size;
            }),

          db.event.count({
            where: {
              eventCategoryId: category.id,
              createdAt: { gte: firstDayOfMonth },
            },
          }),
          db.event.findFirst({
            where: { eventCategoryId: category.id },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);

        return {
          ...category,
          uniqueFieldCount,
          eventsCount,
          lastPing: lastPing?.createdAt || null,
        };
      })
    );

    return c.superjson({ categories: categoriesWithCount });
  }),

  deleteCategory: privateProcedure
    .input(z.object({ name: z.string() }))
    .post(async ({ c, ctx, input }) => {
      const { name } = input;

      await db.eventCategory.delete({
        where: {
          userId_name: { name, userId: ctx.user.id },
        },
      });

      return c.json({ success: true });
    }),

  createCategory: privateProcedure
    .input(EVENT_CATEGORY_VALIDATOR)
    .post(async ({ c, ctx, input }) => {
      const { user } = ctx;
      const { color, name, emoji } = input;

const categoriesCount = await db.eventCategory.count({
  where:{
    userId:ctx.user.id
  }
})

const limit = user.plan == "FREE" ? FREE_QUOTA.maxEventCategories : PRO_QUOTA.maxEventCategories

if(categoriesCount>=limit){
  throw new HTTPException(402,{message:"Please upgrade to pro for creating more categories."})
}
    
      const existingEventCategory = await db.eventCategory.findFirst({
        where: {
          userId: user.id,
          name,
        },
      });

      if (existingEventCategory) {
        throw new HTTPException(409, {
          message: "Event Category already exists",
        });
      }

      const eventCategory = await db.eventCategory.create({
        data: {
          name: name.toLocaleLowerCase(),
          color: parseColor(color),
          userId: user.id,
          emoji,
        },
      });
      return c.json(eventCategory);
    }),

  insertQuickstartCategories: privateProcedure.post(async ({ c, ctx }) => {
    const { user } = ctx;

    const categories = await db.eventCategory.createMany({
      data: [
        { name: "bug", emoji: "🔔", color: 0xff6b6b },
        { name: "sale", emoji: "💰", color: 0xffeb3b },
        { name: "question", emoji: "❓", color: 0x6c5ce7 },
      ].map((category) => ({
        ...category,
        userId: user.id,
      })),
    });
    return c.json({ success: true, categoriesCount: categories.count });
  }),

  pollingCategory: privateProcedure
    .input(z.object({ name: CATEGORY_NAME_VALIDATOR }))
    .get(async ({c,ctx,input}) => {
    const { name } = input

    const category = await db.eventCategory.findUnique({
      where:{
        userId_name:{
          userId:ctx.user.id,
          name
        }
      },
      include:{
        _count:{
          select:{
            events:true
          }
        }
      }
    })

    if(!category){
 throw new HTTPException(404,{message:`Category "${name}" not found `})
    }
    const hasEvents = category._count.events>0
    return c.json({hasEvents})
    }),

    getEventsByCategoryName :privateProcedure.input(z.object({
      categoryName:CATEGORY_NAME_VALIDATOR,
      page:z.number(),
      limit:z.number().max(50),
      timeRange:z.enum(["today","week","month"])
    })).get(async({c,ctx,input})=>{

      const { user } = ctx
      const {categoryName, limit, page, timeRange } = input
      
      const now = new Date()

      let startDate : Date;

      switch(timeRange){

        case "today":
          startDate = startOfDay(now)
          break;
        case "week":
          startDate = startOfWeek(now,{weekStartsOn:0})
          break;
        case "month":
          startDate = startOfMonth(now)
          break;
          
      }
  
      const [events,eventsCount, uniqueFieldsCount] = await Promise.all([
        db.event.findMany({
          where:{
            EventCategory:{
              name:categoryName,
              userId:user.id,
             
            },
            createdAt:{gte:startDate}
          },
          skip:(page-1)*limit,
          take:limit,
          orderBy:{createdAt:"desc"}
    }),

    db.event.count({
      where:{
        EventCategory:{
          name:categoryName,
          userId:user.id,
         
        },
        createdAt:{gte:startDate}
    }}),

    db.event.findMany({
      where:{
        EventCategory:{
          name:categoryName,
          userId:user.id,
         
        },
        createdAt:{gte:startDate}},
        
        select:{
          fields:true
        },
        distinct:["fields"]
    }).then((events)=>{
      const fieldNames = new Set<string>()
      
events.forEach((event)=>{
        Object.keys(event.fields as object).forEach((fieldName)=>{
          fieldNames.add(fieldName)
        })
      })

      return fieldNames.size
    })

      ])


return c.superjson({events,eventsCount ,uniqueFieldsCount})
    })
});
