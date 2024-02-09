import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SERVER_API_KEY ?? "";

const stripe = new Stripe(stripeKey);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const sessionId: string = query.session_id as string;
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.status) {
    return {
      status: 200,
      code: "success",
      data: {
        sessionStatus: session.status,
        customerEmail: session.customer_details?.email,
      },
    };
  } else {
    return {
      status: 500,
      code: "error",
      message: "Something went wrong",
    };
  }
});
