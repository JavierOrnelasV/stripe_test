import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SERVER_API_KEY ?? "";

const stripe = new Stripe(stripeKey);

export default defineEventHandler(async (event) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "mxn",
  });

  if (paymentIntent) {
    return {
      status: 200,
      code: "success",
      data: {
        clientSecret: paymentIntent.client_secret,
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
