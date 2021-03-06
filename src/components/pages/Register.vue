<template>
  <section>
    <base-card>
      <h2>Register as a Coach With Us!</h2>
      <form @submit.prevent="submitInfo" @reset="resetListener" ref='regForm'>
        <base-form-control>
          <template #default>
          <input type="text"
                 placeholder="First Name"
                 required
                 v-model.trim="firstName">
          </template>
        </base-form-control>
        <base-form-control>
          <template #default>
          <input type="text"
                 placeholder="Last Name"
                 required
                 v-model.trim="lastName" >
          </template>
        </base-form-control>
        <base-form-control>
          <template #default>
          <input type="number" step="0.01"
                 ref="rate"
                 @input="cageNumber"
                 placeholder="Hourly Rate (US $)"
                 required
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
          <template #default>
          <textarea
               placeholder="Short description or bio"
               v-model.trim="description"
               required
               rows="5"
          />
          </template>
        </base-form-control>
        <div class="buttons">
          <base-button @mousedown="mouseDown">
            Submit Your Info
          </base-button>
          <base-button @click.prevent="clearRegForm" @mouseover="unselectFields" mode="outline">
            Clear Form
          </base-button>
        </div>
      </form>
    </base-card>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import useFormHooks from '@/hooks/UseFormHooks';

export default defineComponent({
  setup() {
    const allowedAreas = ['frontend', 'backend', 'career'];
    const areas = ref([]);
    const firstName = ref('');
    const lastName = ref('');
    const hourlyRate: Ref<number|null> = ref(null);
    const rate = ref(null); // ref to DOM.
    const description = ref('');

    const areaCGroup: Ref<HTMLDivElement | null> = ref(null);
    const regForm: Ref<HTMLFormElement> | Ref<null> = ref(null);

    const store = useStore();
    const router = useRouter();

    const { clearForm, resetListener, triggerClearForm, unselectFields, hasInvalidControl } = useFormHooks();

    const shouldBeAvailable = computed(() => {
      const loggedIn = store.getters.loginStatus != '';
      return loggedIn;
    });

    watch( shouldBeAvailable, now => {
      if (!now) {
        router.push('/');
      }
    });

    // Enforce format of the number field. Run as @input.
    function cageNumber(evt: Event) {
      const fld = evt.target as HTMLInputElement;
      const val = fld.value;
      const match = val.match(/^\d+(\.\d{0,2})?/);
      if (match) {
        hourlyRate.value = parseFloat(match[0]!);
      }
    }

    // Validate or invalidate the checkbox group
    // before submit actually occurs.
    function mouseDown() {
      // console.log('mouse down! mouse down!');
      const areaOK = validateAreaGroup();
      markAreaGroupValidity(areaOK);
    }

    // Put a blur listener on the last area checkbox and
    // trigger a validity check on the checkbox group.
    function validateOnCBBlur() {
      const lastCB = areaCGroup.value?.querySelector('div.checkbox:last-of-type input');
      if( lastCB) {
        lastCB.addEventListener('blur', () => {
          const isValid = validateAreaGroup();
          markAreaGroupValidity(isValid);
        });
      }
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

    function clearRegFields() {
      areas.value = [];
      firstName.value = '';
      lastName.value = '';
      hourlyRate.value = null;
      description.value = '';

    }

    function clearRegForm(evt: Event) {
      clearRegFields();
      markAreaGroupValidity(true);
      triggerClearForm(evt);
    }

    const submitInfo = (evt: Event) => {
      console.log('enter submit');
      const form = evt.target as HTMLFormElement;
      const areasOK = validateAreaGroup();
      console.log('areasOK', areasOK);
      markAreaGroupValidity(areasOK);
      if (!areasOK || hasInvalidControl(evt)) {
        return;
      }
      const payload = {
        firstName: firstName.value,
        lastName: lastName.value,
        description: description.value,
        hourlyRate: hourlyRate.value!,
        areas: areas.value,
      };
      try {
        store.dispatch('addCoach', payload);
        store.dispatch('setFlash', 'Thank you for registering with us!');
        clearForm(form);
      }
      catch (err) {
        store.dispatch('setFlash', 'We were not able to connect to the database. Please try again later');
      }
      window.scroll(0,0);
    };

    onMounted(() => {
      validateOnCBBlur();
    })

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
      clearRegForm,
      resetListener,
      unselectFields,
      mouseDown,
      cageNumber
    };

  },
})
</script>

<style lang="scss" scoped>
@import '@/scss/fc-forms.scss';

.buttons {
  @media only screen and (max-width: 40em) {
    button {
      font-size: 12px;
      padding: 12px;
    }
  }
}
</style>
