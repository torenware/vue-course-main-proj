<template>
  <h3>
    {{ coach ? `Contact Form for ${coach.firstName} ${coach.lastName}`: "Contact Form"}}
    </h3>
  <base-card>

  <form @submit.prevent="submitContact" @reset="resetListener" ref="form" v-if="coach">
    <base-form-control>
      <template #default>
        <input id="title"
          type="text"
          placeholder="Subject of Your Post"
          required
          v-model.trim="subject">
         </template>
    </base-form-control>

    <base-form-control custom-msg="Please enter a valid email">
      <template #default>
        <input id="email"
          type="email"
          placeholder="Contact Email"
          required
          v-model.trim="email">
         </template>
    </base-form-control>

    <base-form-control>
      <template #default>
      <textarea rows="5" cols="40"
          placeholder="Your message here"
          required
          v-model.trim="message"></textarea>
      </template>
    </base-form-control>

    <base-button mode="outline">Send</base-button>
    <base-button
      mode="outline"
      @click.prevent="clearContactForm"
      @hover="unselectFields"
      @mouseover="unselectFields"
    >
      Reset
    </base-button>
  </form>
  <div v-else>
    <p>Sorry! Contacting this coach is not available now for this coach</p>
  </div>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Coach } from '@/types';
import { useStore } from '@/store';
import useFormHooks from '@/hooks/UseFormHooks';

export default defineComponent({
  setup(props, context) {
    props; context;
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const subject = ref('');
    const email = ref('');
    const message = ref('');
    const form: Ref<HTMLFormElement|null> = ref(null);

    const { clearForm, resetListener, triggerClearForm, unselectFields } = useFormHooks();

    function clearContactFields() {
      subject.value = '';
      email.value = '';
      message.value = '';
    }

    function clearContactForm(evt: Event) {
      clearContactFields();
      triggerClearForm(evt);
    }

    const idParam = computed(() => {
      const {params} = route;
      return params.id;
    });

    const coach = computed(() => {
      const rslt: Coach | null = store.getters.coachById(idParam.value);
      return rslt;
    });


    function printEvent(evt: Event) {
      console.log(evt.type);
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
        clearForm(form.value!);
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
      resetListener,
      triggerClearForm,
      unselectFields,
      printEvent,
      clearContactForm
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
