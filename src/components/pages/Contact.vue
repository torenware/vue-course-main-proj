<template>
  <h3>
    {{ coach ? `Contact Form for ${coach.firstName} ${coach.lastName}`: "Contact Form"}}
    </h3>
  <base-card>

  <form @submit.prevent="submitContact" v-if="coach">
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

    <base-form-control custom-msg="Please enter a valid email">
      <template #default="slotProps">
        <input id="email"
          type="email"
          placeholder="Contact Email"
          required
          @invalid="slotProps.notify('invalid')"
          @change="slotProps.notify('change')"
          @blur="slotProps.notify('blur')"
          v-model.trim="email">
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
  <div v-else>
    <p>Sorry! Contacting this coach is not available now for this coach</p>
  </div>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import type { Coach } from '@/types';
import { useStore } from '@/store';

export default defineComponent({
  setup() {
    const store = useStore();
    const subject = ref('');
    const email = ref('');
    const message = ref('');

    const initializeFlash = inject<Function>('initializeFlash');

    const idParam = computed(() => {
      const {params} = useRoute();
      return params.id;
    });

    const coach = computed(() => {
      const rslt: Coach | null = store.getters.coachById(idParam.value);
      return rslt;
    });

    const submitContact = () => {
      console.log('submit called');
      const newRequest = {
        coachId: idParam.value,
        title: subject.value,
        email: email.value,
        message: message.value
      };
      try {
        store.dispatch('requests/addRequest', newRequest);
        store.dispatch('setFlash', `Your message was sent to Coach ${coach.value?.firstName}`);
      }
      catch (err) {
        store.dispatch('setFlash', 'Sorry! We had a problem saving your message. Please try later.');
      }
      window.scrollTo(0, 0);
      initializeFlash!();
    }

    return {
      idParam,
      coach,
      subject,
      email,
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
