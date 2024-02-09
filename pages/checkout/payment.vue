<template>
  <div id="checkout" ref="checkoutDiv">
    <!-- Checkout will insert the payment form here -->
  </div>
</template>

<script lang="ts" setup>
import { loadStripe } from "@stripe/stripe-js";

const stripeKey =
  "pk_test_51OdEZwCeP9a1yAhMMg3MfkRek08idsNdou7fCHn6BjyTESWRgpo4M0SWDZ6v6Q1Lxz2FAjm3bwIh9NAVeWMrialJ00A54P8zVz";

const stripe = await loadStripe(stripeKey);

const response: any = await useFetch("/api/checkout", {
  method: "POST",
  onRequestError: (error) => {
    console.error(error);
  },
});

const { clientSecret } = response.data.value.data ?? "";

const checkout = await stripe?.initEmbeddedCheckout({
  clientSecret,
});

const checkoutDiv = ref<HTMLElement>();

if (checkoutDiv.value) {
  checkout?.mount(checkoutDiv.value);
}
</script>
