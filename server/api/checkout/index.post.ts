import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SERVER_API_KEY ?? "";

const stripe = new Stripe(stripeKey);

export default defineEventHandler(async (event) => {
  const YOUR_DOMAIN = "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    line_items: [
      // {
      //   price: "price_1OeIhyCeP9a1yAhMoXPHjERm",
      //   quantity: 1,
      // },
      {
        price_data: {
          currency: "mxn",
          product_data: {
            name: "Playera",
          },
          unit_amount: 100 * 250,
        },
        quantity: 2,
      },
    ],
    mode: "payment",
    return_url: `${YOUR_DOMAIN}/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`,
  });

  if (session.client_secret) {
    return {
      status: 200,
      code: "success",
      data: {
        clientSecret: session.client_secret,
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
