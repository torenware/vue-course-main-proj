<template>
  <coach-finder
    @update-areas="updateAreas"
    @update-search-term="doSearch"
  />
  <div v-if="!loaded">
    <base-spinner />
  </div>
  <base-card v-else>
    <section class="search-controls">
      <div class="controls">
        <div class='control-buttons'>
          <base-button @click="reloadCoaches" mode="outline">
            Refresh
          </base-button>
          <div>
            <base-button
               :link="true"
               v-if="!currentCoach && loggedIn"
               to="/register">
              Become a Coach
            </base-button>
          </div>
        </div>
      </div>
    </section>
    <section class="coach-list">
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
import { defineComponent, computed, ref, Ref, inject } from 'vue';
import { useStore } from '@/store';

import CoachItem from '../coaches/CoachItem.vue';
import CoachFinder from '../coaches/CoachFinder.vue';
import areas from '@/utils/areas';

export default defineComponent({
  components: {
    CoachItem,
    CoachFinder,
  },
  setup() {
    const loaded: Ref<boolean> | undefined = inject('loaded');
    const store = useStore();

    const fullName = (coach: Coach) => {
      return `${coach.firstName} ${coach.lastName}`;
    };

    const searchTerm = ref('');
    const selectedAreas: Ref<string[]> = ref(areas);

    async function reloadCoaches() {
      if (!loaded) {
        return;
      }
      loaded.value = false;
      await store.dispatch('loadStore', loaded);
    }

    function doSearch(term: string) {
      searchTerm.value = term;
    }

    function updateAreas(selected: string[]) {
      selectedAreas.value = selected;
    }

    const coachList = computed(() => {
      const coaches = store.getters.coaches;
      const ucTerm = searchTerm.value.toUpperCase();
      return  coaches.filter((coach: Coach) => {
        let sharesGroup = false;
        coach.areas.map(area => {
           if (selectedAreas.value.includes(area)){
             sharesGroup = true;
           }
        });
        if (!sharesGroup) {
          return false;
        }
        const searchThis = fullName(coach).toUpperCase();
        return searchThis.includes(ucTerm);
      });
    });

    const loggedIn = computed(() => {
      return store.getters.loginStatus;
    });

    const currentCoach = computed(() => {
      return store.getters.currentCoach;
    });



    return {
      coachList,
      searchTerm,
      doSearch,
      updateAreas,
      selectedAreas,
      reloadCoaches,
      loaded,
      loggedIn,
      currentCoach,
    };
  },
})
</script>

<style lang="scss" scoped>
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
