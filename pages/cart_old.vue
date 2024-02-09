<template>
  <form id="payment-form" @submit.prevent="handleSubmit">
    <div id="payment-element">
      <!--Stripe.js injects the Payment Element-->
    </div>
    <button id="submit">
      <div class="spinner hidden" id="spinner"></div>
      <span id="button-text">Pay now</span>
    </button>
    <div id="payment-message" class="hidden"></div>
  </form>
</template>

<script lang="ts" setup>
import { loadStripe } from "@stripe/stripe-js";

const stripeKey = process.env.STRIPE_API_KEY ?? "";

const stripe = await loadStripe(stripeKey);

const response: any = await useFetch("/checkout", {
  method: "POST",
});

let clientSecret: string | undefined;

if (response.data.value.data.clientSecret) {
  clientSecret = response.data.value.data.clientSecret;
}

const elements = stripe?.elements({ clientSecret });

const paymentElement = elements?.create("payment");
paymentElement?.mount("#payment-element");

async function handleSubmit() {
  setLoading(true);

  if (!response.data.value.data.clientSecret) {
    return;
  }

  const stripeResponse = await stripe?.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "/checkout",
    },
  });

  if (
    stripeResponse?.error.type === "card_error" ||
    stripeResponse?.error.type === "validation_error"
  ) {
    showMessage(stripeResponse.error.message ?? "");
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

function showMessage(messageText: string) {
  const messageContainer = document.getElementById("payment-message");

  if (!messageContainer) {
    return;
  }

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading: boolean) {
  const submitButton = document.getElementById("submit");
  const spinner = document.getElementById("spinner");
  const buttonText = document.getElementById("button-text");

  if (!submitButton || !spinner || !buttonText) {
    return;
  }

  if (isLoading) {
    submitButton.setAttribute("disabled", "true");
    spinner.classList.remove("hidden");
    buttonText.classList.add("hidden");
  } else {
    submitButton.removeAttribute("disabled");
    spinner.classList.add("hidden");
    buttonText.classList.remove("hidden");
  }
}
</script>
