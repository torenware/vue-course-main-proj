<template>
  <h3>
    {{ coach ? `Contact Form for ${coach.firstName} ${coach.lastName}`: "Contact Form"}}
    </h3>
  <base-card>

  <form @submit.prevent="submitContact" @reset="resetListener" ref="form" v-if="coach">
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
    <base-button mode="outline" type="reset">
      Reset
    </base-button>
  </form>
  <div v-else>
    <p>Sorry! Contacting this coach is not available now for this coach</p>
  </div>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Coach } from '@/types';
import { useStore } from '@/store';
import useFormHooks from '@/hooks/UseFormHooks';

export default defineComponent({
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const subject = ref('');
    const email = ref('');
    const message = ref('');
    const form = ref(null);

    const { clearForm } = useFormHooks();

    const idParam = computed(() => {
      const {params} = route;
      return params.id;
    });

    const coach = computed(() => {
      const rslt: Coach | null = store.getters.coachById(idParam.value);
      return rslt;
    });


    function resetListener() {
      if (form.value) {
        clearForm(form);
        console.log('cleared form widgets and models');
      }
    }

    const submitContact = async () => {
      const newRequest = {
        coachId: idParam.value,
        title: subject.value,
        email: email.value,
        message: message.value
      };
      try {
        await store.dispatch('requests/addRequest', newRequest);
        await store.dispatch('setFlash', `Your message was sent to Coach ${coach.value?.firstName}`);
        clearForm(form);
        router.push('/');

      }
      catch (err) {
        store.dispatch('setFlash', 'Sorry! We had a problem saving your message. Please try later.');
      }
      window.scrollTo(0, 0);
    }

    return {
      form,
      idParam,
      coach,
      subject,
      email,
      message,
      submitContact,
      resetListener
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
