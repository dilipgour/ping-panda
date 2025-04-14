import { Webhook } from "standardwebhooks";
import { headers } from "next/headers";

import { Payment as BasePayment } from "dodopayments/resources/payments.mjs";
import { Subscription as BaseSubscription } from "dodopayments/resources/subscriptions.mjs";
import { db } from "@/server/db";
import { PRO_QUOTA } from "@/config";

export type Payment = BasePayment & { payload_type: string };
export type Subscription = BaseSubscription & { payload_type: string };

export type WebhookPayload = {
    type: string;
    data: Payment | Subscription
  };


const webhook = new Webhook(process.env.NEXT_PUBLIC_DODO_WEBHOOK_KEY!);

export async function POST(request: Request) {
  const headersList = await headers();

  try {
    const rawBody = await request.text();

    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };

    await webhook.verify(rawBody, webhookHeaders);

    const payload = JSON.parse(rawBody) as WebhookPayload;

    if (!payload.data?.customer?.email) {
      throw new Error("Missing customer email in payload");
    }

    const email = payload.data.customer.email;
  if (
      payload.data.payload_type === "Payment" &&
      payload.type === "payment.succeeded" &&
      !payload.data.subscription_id
    ) {
      const userId = payload.data.metadata.userId
      await db.user.update({
        where:{
          externalId:userId
        },
        data:{
          plan:"PRO",
          quotaLimit:PRO_QUOTA.maxEventsPerMonts
        }
      })
    }

    return Response.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}