<template>
  <section>
    <base-card>
      <h3>Register as a Coach With Us!</h3>
      <form @submit.prevent="submitInfo">
        <div class="form-control">
          <input type="text" placeholder="First Name" >
        </div>
        <div class="form-control">
          <input type="text" placeholder="Last Name" >
        </div>
        <div class="form-control">
          <input type="number" placeholder="Hourly Rate (US $)" >
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
               v-model="description"
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

export default defineComponent({
  setup() {
    const allowedAreas = ['frontend', 'backend', 'career'];
    const areas = ref([]);
    const firstName = ref('');
    const lastName = ref('');
    const hourlyRate = ref(null);
    const description = ref('');

    const submitInfo = () => {
      console.log('we will submit registration here.');
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
