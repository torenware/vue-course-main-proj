<template>
  <div class="form-control"
       ref="formControl"
       :class="invalidClass"
       @invalid="handleInvalid"
  >
    <slot :notify="notifyFC"></slot>
    <div class="error" v-if="getMessage && !controlValid">
      {{ getMessage }}
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, computed,  onMounted } from 'vue'

export default defineComponent({
  props: {
    customMsg: {
      type: String,
      required: false
    }
  },
  setup(props, context) {
    const formControl = ref(null);
    const controlValid = ref(true);
    // const listeningControls = ref([]);

    const invalidClass = computed(() => {
      if (!controlValid.value) {
        return ['invalid'];
      }
      else {
        return [];
      }
    });

    function notifyFC(evtType: string) {
      switch(evtType) {
        case 'invalid':
          return handleInvalid();
        case 'change':
        case 'blur':
          return handleChange();
        default:
          return;
      }
    }

    function handleInvalid(){
      controlValid.value = false;
    }

    function handleChange() {
      if (!formControl.value) {
        return; // not up yet.
      }
      // @ts-ignore
      const control = formControl.value.querySelectorAll('input,textarea');
      if (!control.length) {
        return;
      }
      let isValid = true;
      control.forEach((ctl: HTMLObjectElement) => {
        if (!ctl.checkValidity()) {
          isValid = false;
        }
      });
      if (isValid && !controlValid.value) {
        controlValid.value = true;
      }
    }

    function getMessage() {
      if (!formControl.value) {
        return "";
      }
      if (props.customMsg) {
        return props.customMsg;
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

    onMounted(() => {
      if (formControl.value) {
        // @ts-ignore
        const controls = formControl.value!.querySelectorAll('input,textarea,select');
        controls.forEach((ctl: Element) => {
          ctl.addEventListener('invalid', () => {
            context.emit('invalid');
          });
        });
      }
    })

    return {
      formControl,
      controlValid,
      handleChange,
      handleInvalid,
      invalidClass,
      resetValid,
      getMessage: computed(getMessage),
      notifyFC
    };
  },
})
</script>

<style lang="scss" scoped>
  div.form-control {
    display: flex;
    flex-direction: row;

    // &.control {
    //   display: flex;
    //   flex-direction: column;
    // }

    input, textarea {
      flex: 1;
      margin: 0;
    }

    &.invalid {
    input, label, textarea, select, div.error {
      color: red;
      border-color: lightcoral;
    }
    div.error {
      padding-left: 10px;
    }
   }
  }
</style>
