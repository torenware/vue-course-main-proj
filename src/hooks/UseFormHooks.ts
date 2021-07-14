import { Ref } from 'vue';
import store from '@/store';

const useFormHooks = () => {
  function hasInvalidControl(evt: Event): boolean {
    if (evt.type === 'submit') {
      // @ts-ignore
      const invalid = evt.target!.querySelector(':invalid');
      if (invalid) {
        return true;
      }
    }
    return false;
  }

  function clearForm(form: HTMLFormElement) {
    store.commit('setClearingForm', true);
    console.log('CF called', store.getters.inClearingForm);
    if (!form) {
      console.log('no form obj');
    }
    // Empty the fields:
    const controls = form.querySelectorAll('input,select,textarea');
    controls.forEach(item => {
      // tell the control to update its internal data.
      const customEvt = new CustomEvent('fc-reset');
      item.dispatchEvent(customEvt);
      // @ts-ignore
      if (item.tagName.toLowerCase() === 'input') {
        const input = item as HTMLInputElement;
        if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false;
        } else {
          input.value = '';
        }
      } else {
        // @ts-ignore
        item.value = '';
      }
    });

    // Remove the invalid class
    // const invalidElements = form.querySelectorAll('.invalid');
    // invalidElements.forEach(item => {
    //   item.classList.remove('invalid');
    // });
    console.log('unsetting setClearingForm');
    store.commit('setClearingForm', false);
  }

  // Used to make sure the clear/reset button can
  // get focus if a field is selected.
  function unselectFields(evt: Event) {
    const form = (evt.target as HTMLObjectElement).form;
    const controls = form!.querySelectorAll('input:focus, textarea:focus');
    store.commit('setProcessingBlur', true);
    controls!.forEach(ctl => {
      (ctl as HTMLObjectElement).blur();
    });
    store.commit('setProcessingBlur', false);
  }

  function triggerClearForm(evt: Event) {
    console.log('dispatch event');
    const form = (evt.target as HTMLObjectElement).form;
    const event = document.createEvent('Event');
    event.initEvent('reset');
    form?.dispatchEvent(event);
  }

  function resetListener(evt: Event) {
    const form = evt.target as HTMLFormElement;
    if (form) {
      clearForm(form);
      console.log('cleared form widgets and models');
    } else {
      console.log('form was NOT set');
    }
  }

  return {
    hasInvalidControl,
    clearForm,
    unselectFields,
    triggerClearForm,
    resetListener
  };
};

export default useFormHooks;
