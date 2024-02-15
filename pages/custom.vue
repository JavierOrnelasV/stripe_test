<template>
  <form id="payment-form" ref="formRef">
    <div id="payment-element">
      <!-- Elements will create form elements here -->
    </div>
    <button id="submit">Submit</button>
    <div id="error-message">
      <!-- Display error message to your customers here -->
    </div>
  </form>
</template>

<script lang="ts" setup>
import { loadStripe } from "@stripe/stripe-js";

const stripeKey =
  "pk_test_51OdEZwCeP9a1yAhMMg3MfkRek08idsNdou7fCHn6BjyTESWRgpo4M0SWDZ6v6Q1Lxz2FAjm3bwIh9NAVeWMrialJ00A54P8zVz";

const stripe = await loadStripe(stripeKey);

const response: any = await useFetch("/api/checkout_old", {
  method: "POST",
  onRequestError: (error) => {
    console.error(error);
  },
});

const { clientSecret } = response.data.value.data ?? "";

const elements = stripe?.elements({
  clientSecret,
  appearance: {
    theme: "flat",
    // variables: {
    //   colorPrimary: "black",
    //   colorBackground: "red",
    //   colorText: "lime",
    //   colorDanger: "yellow",
    // },
  },
});

const formRef = ref<HTMLFormElement | undefined>();

onMounted(async () => {
  const paymentElement = elements?.create("payment");
  paymentElement?.mount("#payment-element");

  if (formRef.value) {
    formRef.value.addEventListener("submit", async (event) => {
      event.preventDefault();

      elements?.submit();

      const response = await stripe?.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        clientSecret,
        confirmParams: {
          return_url: "http://localhost:3000/success",
        },
      });

      if (response?.error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        const messageContainer = document.querySelector("#error-message");
        if (messageContainer) {
          messageContainer.textContent =
            response?.error.message != null ? response.error.message : "";
        }
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    });
  }
});
</script>

<style scoped>
#submit {
  margin-top: 0.5rem;
  background-color: "#f3f3f3";
  border-color: transparent;
  border-radius: 10px;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  font-size: 15px;
}
</style>
