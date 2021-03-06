<template>
  <base-card>
  <form @submit.prevent="submitAuth" ref="formRef">
    <h2>{{ isLoginForm ? "Please Sign In" : "Signing Up On Our Site"}}</h2>
    <base-form-control v-if="!isLoginForm">
      <template #default>
        <input id="name"
          type="text"
          placeholder="Your Name"
          required
          v-model.trim="name">
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
        <input id="password"
          type="password"
          placeholder="Password"
          required
          v-model.trim="password">
         </template>
    </base-form-control>

    <base-button mode="outline">{{ isLoginForm ? "Login": "Sign Up"}}</base-button>
  </form>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUpdated } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import useFormHooks from '../../../hooks/UseFormHooks';
import { useStore } from '@/store';

interface UserAttribs {
  name: string;
  email: string;
  password: string;
}

export default defineComponent({
  setup() {
    const formRef = ref(null);
    const name = ref('');
    const password = ref('');
    const email = ref('');

    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const isLoginForm = computed(() => {
      const name = route.name;
      return name === 'signin';
    });

    // @ts-ignore
    const { clearForm } = useFormHooks();

    function submitAuth() {

      if (isLoginForm.value) {
        const payload = {
          email: email.value,
          password: password.value
        }

        try {
          store.dispatch('login', payload);
        }
        catch(err) {
          // no op; but do a flash here.
          console.error('caught');
        }

      }
      else {
        const payload: UserAttribs = {
          name: name.value,
          password: password.value,
          email: email.value
        };

        try {
          store.dispatch('signup', payload);
          router.push('/');
          store.dispatch('setFlash', 'Thank you for signing up!');
        }
        catch(err) {
          // no op; but do a flash here.
        }
      }
    }


    // Called when switching between signup and login,
    // which share this component.
    onBeforeRouteUpdate(() => {
      // In 3.1.4 and VR 4.0.10, this is *never* called.
      console.log('route update called')
      clearForm(formRef.value!);
    });

    // temp: call onUpdated instead
    onUpdated(() => {
      clearForm(formRef.value!);
    });

    onMounted(() => {
      console.log('login/signup mounting');
      clearForm(formRef.value!);
    });

    return {
      formRef,
      name,
      email,
      password,
      submitAuth,
      isLoginForm
    }
  },
})
</script>

<style lang="scss" scoped>
  @import '@/scss/fc-forms.scss';
</style>
