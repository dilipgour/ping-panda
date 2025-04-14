import { FREE_QUOTA, PRO_QUOTA } from "@/config";
import { DiscordClient } from "@/lib/discord-client";
import { CATEGORY_NAME_VALIDATOR } from "@/lib/validators/category-validator";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const REQUEST_VALIDATOR = z
  .object({
    category: CATEGORY_NAME_VALIDATOR,
    fields: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
    description: z.string().optional(),
  })
  .strict();

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Invalid auth header format. Expected: 'Bearer [API_KEY]'" },
      { status: 401 }
    );
  }

  const apiKey = authHeader.split(" ")[1];

  if (!apiKey || apiKey.trim() === "") {
    return NextResponse.json({ message: "Invalid API key " }, { status: 401 });
  }

  try {
    const user = await db.user.findFirst({
      where: {
        apiKey,
      },
      include: {
        EventCategories: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid API key " },
        { status: 401 }
      );
    }
    if (!user.discordId) {
      return NextResponse.json(
        {
          message: "Please enter your discord ID in your account settings page",
        },
        { status: 403 }
      );
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const quota = await db.quota.findUnique({
      where: {
        userId: user.id,
        month: currentMonth,
        year: currentYear,
      },
    });

    const quoataLimit =
      user.plan === "FREE"
        ? FREE_QUOTA.maxEventsPerMonts
        : PRO_QUOTA.maxEventsPerMonts;

    if (quota && quota.count >= quoataLimit) {
      return NextResponse.json(
        {
          message:
            "Monthly quota reached. Please upgrade your plan for more events.",
        },
        { status: 429 }
      );
    }
    const discord = new DiscordClient(process.env.DISCORD_BOT_TOKEN);

    const dmChnnel = await discord.createDM(user.discordId);

    let requestData: unknown;

    requestData = await req.json();

    try {
      const validatedData = REQUEST_VALIDATOR.parse(requestData);

      const category = user.EventCategories.find(
        (category) => category.name === validatedData.category
      );

      if (!category) {
        return NextResponse.json(
          {
            message: `you dont have the category named ${validatedData.category}`,
          },
          { status: 404 }
        );
      }

      const eventData = {
        title: `${category.emoji || "🔔"} ${
          category.name.charAt(0).toUpperCase() + category.name.slice(1)
        }`,
        description:
          validatedData.description || `A new ${category.name} event occured!`,
        color: category.color,
        timestamp: new Date().toISOString(),
        fields: Object.entries(validatedData.fields || {}).map(
          ([key, value]) => {
            return {
              name: key,
              value: String(value),
              inline: true,
            };
          }
        ),
      };

      const event = await db.event.create({
        data: {
          name: category.name,
          formattedMessage: `${eventData.title}\n\n${eventData.description}`,
          userId: user.id,
          fields: validatedData.fields || {},
          eventCategoryId: category.id,
        },
      });

      try {
        await discord.sendEmbed(dmChnnel.id, eventData);
        await db.event.update({
          where: { id: event.id },
          data: { deliveryStatus: "SUCCESS" },
        });

        await db.quota.upsert({
          where: {
            userId: user.id,
            month: currentMonth,
            year: currentYear,
          },
          update: { count: { increment: 1 } },
          create: {
            userId: user.id,
            month: currentMonth,
            year: currentYear,
            count: 1,
          },
        });
      } catch (error) {
        console.log(error);

        await db.event.update({
          where: { id: event.id },
          data: { deliveryStatus: "FAILED" },
        });

        return NextResponse.json(
          { message: "Error processing event", eventId: event.id },
          { status: 500 }
        );
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError) {
        return NextResponse.json(
          { message: "Invalid json request body " },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Successfully send " },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
