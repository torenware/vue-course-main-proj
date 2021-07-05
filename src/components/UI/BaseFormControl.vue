<template>
  <div class="form-control"
       ref="formControl"
       :class="invalidClass"
       @invalid="handleInvalid"
  >
    <slot></slot>
    <div class="error invalid" v-if="getMessage">
      {{ getMessage }}
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  props: {
    msg: {
      type: String,
      required: false
    }
  },
  setup() {
    const formControl = ref(null);
    const controlValid = ref(true);

    const invalidClass = computed(() => {
      if (!controlValid.value) {
        return ['invalid'];
      }
      else {
        return [];
      }
    });

    function handleInvalid(evt: Event){
      console.log(evt.target);
      controlValid.value = false;
    }

    function handleChange() {
      if (!formControl.value) {
        return; // not up yet.
      }
      // @ts-ignore
      const control = formControl.value.querySelector('input:invalid,textarea:invalid');
      console.log('control', control);
      if (!control) {
        return;
      }
      let isValid = true;
      control.forEach((ctl: HTMLObjectElement) => {
        ctl;
        isValid = false;
      });
      if (isValid && !controlValid.value) {
        controlValid.value = true;
      }
    }

    function getMessage() {
      if (!formControl.value) {
        return "";
      }
      // @ts-ignore
      const control = formControl.value.querySelector('input,textarea');
      if (!control) {
        return "";
      }
      const msg = control.validationMessage;
      return msg;
    }

    function resetValid() {
      controlValid.value = true;
    }

    return {
      formControl,
      controlValid,
      handleChange,
      handleInvalid,
      invalidClass,
      resetValid,
      getMessage: computed(getMessage)
    };
  },
})
</script>

<style lang="scss" scoped>
  div.form-control.invalid {
    input, label, textarea, select {
      color: red;
      border-color: lightcoral;
    }
  }
</style>
