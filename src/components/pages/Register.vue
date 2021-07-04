<template>
  <section>
    <base-card>
      <h3>Register as a Coach With Us!</h3>
      <form @submit.prevent="submitInfo">
        <div class="form-control">
          <input type="text" placeholder="First Name" v-model.trim="firstName">
        </div>
        <div class="form-control">
          <input type="text" placeholder="Last Name" v-model.trim="lastName" >
        </div>
        <div class="form-control">
          <input type="number" placeholder="Hourly Rate (US $)" v-model.number="hourlyRate">
        </div>
        <div class="form-control cgroup">
          <h4>Your Areas of Expertise</h4>
          <div class="checkbox-group">
            <div class="checkbox" v-for="area in allowedAreas" :key="area">
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
        <div class="form-control">
          <textarea
               placeholder="Short description or bio"
               v-model.trim="description"
               rows="5"
          />
        </div>
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
    const firstName = ref('');
    const lastName = ref('');
    const hourlyRate = ref(null);
    const description = ref('');

    const store = useStore();

    const submitInfo = () => {
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
      firstName,
      lastName,
      hourlyRate,
      description,
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
</style>
