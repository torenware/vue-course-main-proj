<template>
  <section>
    <base-card>
      <h2>Register as a Coach With Us!</h2>
      <form @submit.prevent="submitInfo">
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
          <input type="number"
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
      </form>
    </base-card>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// useStore has been overloaded.
import { useStore } from '@/store';

export default defineComponent({
  setup() {
    const allowedAreas = ['frontend', 'backend', 'career'];
    const areas = ref([]);
    const areaCGroup = ref(null);
    const firstName = ref('');
    const lastName = ref('');
    const hourlyRate = ref(null);
    const description = ref('');

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
        areas: areas.value
      };
      store.dispatch('addCoach', payload);
    };

    return {
      allowedAreas,
      areas,
      areaCGroup,
      firstName,
      lastName,
      hourlyRate,
      description,
      checkBoxChanged,
      submitInfo
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
