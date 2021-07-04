<template>
  <h2>Coach List</h2>
  <section>
    <div class="controls">
      <button>Refresh</button>
      <div>
        <router-link to="/register">Become a Coach</router-link>
      </div>
    </div>
  </section>
  <section>
    <ul>
      <li v-for="coach in coachList" :key="coach.id">
        <coach-item 
          :id="coach.id"
          :first-name="coach.firstName"
          :last-name="coach.lastName"
          :description="coach.description"
          :areas="coach.areas"
          :hourly-rate="coach.hourlyRate"
        />
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

import CoachItem from '../coaches/CoachItem.vue';

export default defineComponent({
  components: {
    CoachItem
  },
  setup() {
    const coachList = computed(() => {
      const store = useStore();
      return store.getters.coaches;
    });

    return {
      coachList
    };
  },
})
</script>

<style scoped>
li {
  list-style: none;
}
</style>
