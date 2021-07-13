import { Ref } from 'vue';

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

  function clearForm(formRef: Ref<HTMLFormElement | null>) {
    if (!formRef.value) {
      console.log('form ref not up');
      return;
    }
    console.log('form ref is set up.');
    // Empty the fields:
    const controls = formRef.value.querySelectorAll('input,select,textarea');
    controls.forEach(item => {
      // @ts-ignore
      if (item.tagName.toLowerCase() === 'input') {
        console.log('processing input widget');
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
    const invalidElements = formRef.value.querySelectorAll('.invalid');
    invalidElements.forEach(item => {
      item.classList.remove('invalid');
    });
  }

  return {
    hasInvalidControl,
    clearForm
  };
};

export default useFormHooks;
