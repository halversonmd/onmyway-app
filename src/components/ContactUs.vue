<template>
  <div class="column fit justify-center flat no-border">
    <q-card-section style="width: 100%">
      <div class="text-h5">Contact Us</div>
    </q-card-section>
    <div class="q-px-md full-width">
      <q-form @submit="contactUsSubmit" greedy>
        <q-input
          v-model="formData.userName"
          label="Name *"
          class="full-width"
          :rules="[(val) => (val && val.length > 0) || 'Required']"
        />

        <q-input
          v-model="formData.email"
          type="email"
          label="Reply Email *"
          class="full-width"
          :rules="[emailIsValid || 'Enter a valid email address']"
        />
        <q-input
          v-model="formData.contactUsBody"
          class="full-width tall-boy"
          type="textarea"
          filled
          label="Body *"
          :rules="[(val) => (val && val.length > 0) || 'Required']"
        />
        <q-card-actions align="between" class="text-info">
          <q-btn size="lg" flat label="Cancel" @click="closePanel" />
          <q-btn size="lg" flat type="submit" label="Submit" />
        </q-card-actions>
      </q-form>
    </div>
    <q-dialog v-model="waitingForConfirmation" persistent>
      <div class="row justify-center no-shadow" style="width: 100vw">
        <q-spinner-gears
          v-if="isSaving"
          color="primary"
          style="width: 10rem; height: 10rem"
        />
        <q-icon v-if="saveDone" color="primary" name="done" size="10rem" />
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from "vue";
import { submitContactUsForm } from "src/composables/firebase";
import { bottomSheetStatus } from "src/composables/elements";

export default defineComponent({
  name: "ContactUs",
  setup() {
    const isSaving = ref(false);
    const saveDone = ref(false);
    const waitingForConfirmation = ref(false);
    const formData = reactive({
      userName: "",
      email: "",
      contactUsBody: null,
      timestamp: null,
    });

    const closePanel = () => {
      bottomSheetStatus.value = "closed";
      waitingForConfirmation.value = false;
      saveDone.value = false;
    };

    const emailIsValid = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    return {
      formData,
      isSaving,
      saveDone,
      waitingForConfirmation,
      emailIsValid,
      closePanel,
      contactUsSubmit: async () => {
        waitingForConfirmation.value = true;
        isSaving.value = true;
        formData.timestamp = new Date().getTime();
        await submitContactUsForm(formData);
        isSaving.value = false;
        saveDone.value = true;
        setTimeout(closePanel, 1000);
      },
    };
  },
  props: {
    data: {
      type: Object,
      required: false,
    },
  },
});
</script>
