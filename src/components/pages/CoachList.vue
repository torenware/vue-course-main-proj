<template>
  <base-card>
    <section>
      <div class="controls">
        <base-button mode="outline">
          Refresh
        </base-button>
        <div>
          <base-button :link="true" to="/register">
            Become a Coach
          </base-button>
        </div>
      </div>
    </section>
    <section>
      <ul>
        <coach-item
          v-for="coach in coachList" 
          :key="coach.id" 
          :id="coach.id"
          :first-name="coach.firstName"
          :last-name="coach.lastName"
          :description="coach.description"
          :areas="coach.areas"
          :hourly-rate="coach.hourlyRate"
        />
      </ul>
    </section>
  </base-card>
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
div.controls {
  display: flex;
  justify-content: space-between;
}
</style>
