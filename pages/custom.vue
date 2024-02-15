<template>
  <main>
    <div id="formDiv">
      <form id="payment-form" ref="formRef">
        <div id="payment-element">
          <!-- Elements will create form elements here -->
        </div>
        <button id="submit">Submit</button>
        <div id="error-message">
          <!-- Display error message to your customers here -->
        </div>
      </form>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { loadStripe } from "@stripe/stripe-js";

const stripeKey =
  "pk_test_51OdEZwCeP9a1yAhMMg3MfkRek08idsNdou7fCHn6BjyTESWRgpo4M0SWDZ6v6Q1Lxz2FAjm3bwIh9NAVeWMrialJ00A54P8zVz";

const stripe = await loadStripe(stripeKey, { locale: "es" });

const response: any = await useFetch("/api/checkout_old", {
  method: "POST",
  onRequestError: (error) => {
    console.error(error);
  },
});

const { clientSecret } = response.data.value.data ?? "";

const formRef = ref<HTMLFormElement | undefined>();

onMounted(async () => {
  if (!formRef.value) return;

  if (!stripe || clientSecret == "") {
    return;
  }

  const elements = stripe.elements({
    clientSecret,
    appearance: {
      // theme: "flat",
      // variables: {
      //   colorPrimary: "black",
      //   colorBackground: "red",
      //   colorText: "lime",
      //   colorDanger: "yellow",
      // },
    },
  });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");
  elements.submit();

  formRef.value.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: "http://localhost:3000/success",
      },
    });

    if (error) {
      const messageContainer = document.querySelector("#error-message");
      if (!messageContainer) return;
      messageContainer.textContent = response.error.message;
    }
  });
});
</script>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#formDiv {
  width: 50%;
}

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
