<template>
  <base-card>
  <form @submit.prevent="submitAuth" ref="formRef">
    <h2>{{ isLoginForm ? "Please Sign In" : "Signing Up On Our Site"}}</h2>
    <base-form-control v-if="!isLoginForm">
      <template #default="slotProps">
        <input id="name"
          type="text"
          placeholder="Your Name"
          required
          @invalid="slotProps.notify('invalid')"
          @change="slotProps.notify('change')"
          @blur="slotProps.notify('blur')"
          v-model.trim="name">
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
        <input id="password"
          type="password"
          placeholder="Password"
          required
          @invalid="slotProps.notify('invalid')"
          @change="slotProps.notify('change')"
          @blur="slotProps.notify('blur')"
          v-model.trim="password">
         </template>
    </base-form-control>

    <base-button mode="outline">{{ isLoginForm ? "Login": "Sign Up"}}</base-button>
  </form>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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
      console.log('submitted');

      if (isLoginForm.value) {
        console.log('on login path');
        const payload = {
          email: email.value,
          password: password.value
        }

        try {
          store.dispatch('login', payload);
          router.push('/');
          store.dispatch('setFlash', 'Welcome back!!');
        }
        catch(err) {
          // no op; but do a flash here.
        }

      }
      else {
        console.log('on signup path');
        const payload: UserAttribs = {
          name: name.value,
          password: password.value,
          email: email.value
        };
        console.log('payload', payload);

        try {
          console.log('payload from form', payload);
          store.dispatch('signup', payload);
          router.push('/');
          store.dispatch('setFlash', 'Thank you for signing up!');
        }
        catch(err) {
          // no op; but do a flash here.
        }
      }
    }

    onMounted(() => {
      clearForm(formRef);
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
