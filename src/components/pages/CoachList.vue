<template>
  <div v-if="!loaded">
    Loading...
  </div>
  <base-card v-else>
    <section>
      <div class="controls">
        <base-search  @search="doSearch" />
        <div class='control-buttons'>
          <base-button mode="outline">
            Refresh
          </base-button>
          <div>
            <base-button :link="true" to="/register">
              Become a Coach
            </base-button>
          </div>
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
import { Coach } from '@/types';
import { defineComponent, computed, ref, inject } from 'vue';
import { useStore } from '@/store';

import CoachItem from '../coaches/CoachItem.vue';
import BaseSearch from '../UI/BaseSearch.vue';

export default defineComponent({
  components: {
    CoachItem,
    BaseSearch
  },
  setup() {
    const loaded = inject('loaded');
    const fullName = (coach: Coach) => {
      return `${coach.firstName} ${coach.firstName}`;
    };

    const searchTerm = ref('');

    function doSearch(term: string) {
      searchTerm.value = term;
    }

    const coachList = computed(() => {
      const store = useStore();
      const coaches = store.getters.coaches;
      if (searchTerm.value === '') {
        return coaches;
      }
      const ucTerm = searchTerm.value.toUpperCase();
      return  coaches.filter((coach: Coach) => {
        return fullName(coach).toUpperCase().includes(ucTerm);
      });
    });


    return {
      coachList,
      searchTerm,
      doSearch,
      loaded
    };
  },
})
</script>

<style scoped>
div.controls {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

div.control-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}
</style>
