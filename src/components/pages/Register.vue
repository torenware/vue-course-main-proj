<template>
  <section>
    <base-card>
      <h2>Register as a Coach With Us!</h2>
      <form @submit.prevent="submitInfo" ref='regForm'>
        <base-form-control>
          <template #default="slotProps">
          <input type="text"
                 placeholder="First Name"
                 required
                @invalid="slotProps.notify('invalid')"
                @change="slotProps.notify('change')"
                @blur="slotProps.notify('blur')"
                 v-model.trim="firstName">
          </template>
        </base-form-control>
        <base-form-control>
          <template #default="slotProps">
          <input type="text"
                 placeholder="Last Name"
                 required
                @invalid="slotProps.notify('invalid')"
                @change="slotProps.notify('change')"
                @blur="slotProps.notify('blur')"
                 v-model.trim="lastName" >
          </template>
        </base-form-control>
        <base-form-control>
          <template #default="slotProps">
          <input type="number" step="0.01"
                 ref="rate"
                 placeholder="Hourly Rate (US $)"
                 required
                @invalid="slotProps.notify('invalid')"
                @change="slotProps.notify('change')"
                @blur="slotProps.notify('blur')"
                 v-model.number="hourlyRate">
          </template>
        </base-form-control>
        <div class="form-control cgroup"  ref="areaCGroup">
          <h4>Your Areas of Expertise (choose one or more)</h4>
          <div class="checkbox-group">
            <div class="checkbox"
                  v-for="area in allowedAreas"
                  :key="area"
                  @change="checkBoxChanged"
              >
              <label>
                <input type="checkbox"
                  :value="area"
                  name="areaBadges"
                  v-model="areas"
                >
              {{area}}</label>
            </div>
          </div>
        </div>
        <base-form-control>
          <template #default="slotProps">
          <textarea
               placeholder="Short description or bio"
               v-model.trim="description"
               required
                @invalid="slotProps.notify('invalid')"
                @change="slotProps.notify('change')"
                @blur="slotProps.notify('blur')"
               rows="5"
          />
          </template>
        </base-form-control>
        <base-button>
          Submit Your Info
        </base-button>
        <base-button @click.prevent="clearForm" mode="outline">
          Clear Form
        </base-button>
      </form>
    </base-card>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue';

// useStore has been overloaded.
import { useStore } from '@/store';

export default defineComponent({
  setup() {
    const allowedAreas = ['frontend', 'backend', 'career'];
    const areas = ref([]);
    const firstName = ref('');
    const lastName = ref('');
    const hourlyRate = ref(null);
    const rate = ref(null); // ref to DOM.
    const description = ref('');

    const areaCGroup = ref(null);
    const regForm: Ref<HTMLFormElement> | Ref<null> = ref(null);

    const store = useStore();

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

    function validateAreaGroup() {
      if (!areaCGroup.value) {
        console.log('cgroup ref not inititalized');
        return true;
      }
      const group = areaCGroup.value! as Element;
      const checked = group.querySelectorAll(':checked');
      if (checked.length === 0) {
        return false;
      }
      return true;
    }

    function markAreaGroupValidity(isValid: boolean) {
      if (!areaCGroup.value) {
        console.log('cgroup ref not inititalized');
        return;
      }
      const group = areaCGroup.value! as Element;
      const hasInvalidClass = group.classList.contains('invalid');
      if (isValid) {
        if (hasInvalidClass) {
          group.classList.remove('invalid');
        }
      }
      else {
        if (!hasInvalidClass) {
          group.classList.add('invalid');
        }
      }
    }

    function checkBoxChanged() {
      const groupValid = validateAreaGroup();
      markAreaGroupValidity(groupValid);
    }

    function clearForm() {
      if (!regForm.value) {
        console.log('regform ref not up');
        return;
      }
      const controls = regForm.value.querySelectorAll('input,select,textarea');
      controls.forEach(item => {
        // @ts-ignore
        if (item.tagName.toLowerCase() === 'input') {
          const input = item as HTMLInputElement;
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
          }
          else {
            input.value = '';
          }
        }
        else {
          // @ts-ignore
          item.value = '';
        }
      });
    }

    const submitInfo = (evt: Event) => {
      const areasOK = validateAreaGroup();
      markAreaGroupValidity(areasOK);
      if (!areasOK || hasInvalidControl(evt)) {
        return;
      }
      const payload = {
        firstName: firstName.value,
        lastName: lastName.value,
        description: description.value,
        hourlyRate: parseFloat(hourlyRate.value!),
        areas: areas.value,
      };
      try {
        store.dispatch('addCoach', payload);
        store.dispatch('setFlash', 'Thank you for registering with us!');
        clearForm();
      }
      catch (err) {
        store.dispatch('setFlash', 'We were not able to connect to the database. Please try again later');
      }
      window.scroll(0,0);
    };

    return {
      allowedAreas,
      areas,
      areaCGroup,
      regForm,
      firstName,
      lastName,
      hourlyRate,
      rate,
      description,
      checkBoxChanged,
      submitInfo,
      clearForm,
    };

  },
})
</script>

<style lang="scss" scoped>
.form-control {
  display: flex;
  padding: 10px;
}

.cgroup {
  display: flex;
  flex-direction: column;
}

input, label {
  height: 2.5rem;
}

input, textarea {
  flex: 1;
}
.checkbox-group {
  display: flex;
  justify-content: space-around;
  width: 50%;
}
.checkbox-group .checkbox {
  flex: 1;
  width: 100px;

  // @see https://www.w3docs.com/snippets/css/how-to-align-checkboxes-and-their-labels-consistently-cross-browsers.html
  label {
    display: block;
    padding-left: 15px;
    text-indent: -15px;
  }
  input {
        width: 15px;
        height: 15px;
        padding: 0;
        margin: 0;
        vertical-align: bottom;
        position: relative;
        top: -1px;
  }

}

.form-control.invalid {
  input, label, textarea {
    color: red;
    border-style: solid;
    border-color: red;
  }
}
.cgroup.invalid {
  input, h4, label {
    color: red;
    border-style: none;
    border-color: none;

  }
}

</style>
