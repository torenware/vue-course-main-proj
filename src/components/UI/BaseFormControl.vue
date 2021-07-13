<template>
  <div class="control-wrapper"
    ref="formControl"
    :class="invalidClass"
    @invalid="handleInvalid"
  >
    <div class="form-control" :class="invalidClass">
      <slot :notify="notifyFC"></slot>
    </div>
      <div class="error" v-if="getMessage && !controlValid">
        {{ getMessage }}
      </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, Ref, computed,  onMounted } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  props: {
    customMsg: {
      type: String,
      required: false,
    },
    // form: {
    //   type: Object as () => HTMLFormElement,
    //   required: true
    // }
  },
  setup(props, context) {
    const formControl: Ref<Element | null> = ref(null);
    const controlValid = ref(true);

    const store = useStore();

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
        case 'blur':
          return handleChange();
        case 'change':
          return handleChange();
        default:
          return;
      }
    }

    function handleInvalid(){
      // hack: we need to avoid setting the
      // control as invalid if we are in a clearForm
      if (!store.state.formContext.clearingForm && !store.state.formContext.processingBlur) {
        controlValid.value = false;
        console.log('set in invalid handler');
      }
      else {
        console.log('skipping invalid set during clearForm');
      }
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
      control.forEach((ctl: Element) => {
        const HOEl = ctl as HTMLObjectElement;
        if (!HOEl.checkValidity()) {
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
      const control = formControl.value.querySelector('input,textarea') as HTMLObjectElement;
      if (!control) {
        return "";
      }
      const msg = control.validationMessage;
      return msg;
    }

    function resetValid() {
      controlValid.value = true;
    }

    function addResetListenerForForm(form: HTMLFormElement) {
      // eslint-disable no-unused-vars
      // @ts-ignore
      form.addEventListener('reset', (_el: HTMLFormElement, _evt: Event) => {
        _el; _evt;
        controlValid.value = true;
        console.log('fired for control');
      }, {
        capture: true,
        once: false,
      });
      // eslint-enable no-unused-vars
    }

    onMounted(() => {
      if (formControl.value) {
        // look for form widgets and find the owning form.
        const controls = formControl.value!.querySelectorAll('input,textarea,select');
        let form: HTMLFormElement | undefined;
        controls.forEach((ctl: Element) => {
          const fCtl = ctl as HTMLObjectElement;
          if (!form && fCtl.form) {
            form = fCtl.form;
            addResetListenerForForm(form);
          }
          // and listen to the widget's invalid messages.
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
  .control-wrapper {
    margin-bottom: 1rem;

    &.invalid {

      div.error {
        margin-top: .5rem;
        color: red;
        opacity: .6;
      }

    }


  }



  div.form-control {
    display: flex;
    flex-direction: row;

    input, textarea {
      flex: 1;
      margin: 0;
   }

   &.invalid {
    input, label, textarea, select, div.error {
      color: red;
      border-color: lightcoral;
    }
   }

}
</style>
