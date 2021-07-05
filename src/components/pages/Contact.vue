<template>
  <h3>Contact Form</h3>
  <base-card>
  <form @submit.prevent="">
    <base-form-control>
      <template #default="slotProps">
        <input id="title"
          type="text"
          placeholder="Subject of Your Post"
          required
          @invalid="slotProps.notify('invalid')"
          @change="slotProps.notify('change')"
          @blur="slotProps.notify('blur')"
          v-model.trim="subject">
         </template>
    </base-form-control>

    <base-form-control>
      <template #default="slotProps">
      <textarea rows="5" cols="40"
          placeholder="Your message here"
          required
          @invalid="slotProps.notify('invalid')"
          @change="slotProps.notify('change')"
          @blur="slotProps.notify('blur')"
          v-model.trim="message"></textarea>
      </template>
    </base-form-control>

    <base-button mode="outline">Send</base-button>
  </form>

  </base-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {

    const subject = ref('');
    const message = ref('');

    const idParam = computed(() => {
      const {params} = useRoute();
      return params.id;
    });

    const submitContact = () => {
      console.log('submit called');
    }

    return {
      idParam,
      subject,
      message,
      submitContact,
    }
  },
})
</script>

<style lang="scss" scoped>
 label {
   display: block;
 }
 .form-control {
   margin-bottom: 1rem;
   display: flex;
   align-items: flex-start;
 }

 input, label {
  height: 2.5rem;
}

input, textarea {
  flex: 1;
}

 form div.error.invalid {
   display: none;
 }
 .form-control.invalid {
    input, label, textarea {
      color: red;
      border-style: solid;
      border-color: red;
    }
 }


</style>
