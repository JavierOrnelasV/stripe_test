<template>
  <div>
    <section id="success" v-if="successSection">
      <p>
        We appreciate your business! A confirmation email will be sent to
        <span id="customer-email">{{ customerEmail }}</span
        >. If you have any questions, please email
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </p>
    </section>
  </div>
</template>

<script lang="ts" setup>
const successSection = ref(false);
const customerEmail = ref("");

const route = useRoute();

const sessionId = route.params.session_id as string;

// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);
// const sessionId = urlParams.get("session_id");
const response: any = await useFetch(`/api/checkout/session`, {
  method: "PUT",
  body: {
    sessionId,
  },
});

const session = response.data.value.data ?? {};

if (session.sessionStatus == "open") {
  navigateTo("/checkout/confirmation");
} else if (session.status == "complete") {
  successSection.value = true;
  customerEmail.value = session.customerEmail;
}
</script>
