<template>
  <base-card>
    <h2>Find a Coach</h2>
     <div class="search-box">
      <base-search
         @search="doSearch"
         placeholder="Search by Coach Name"
      />
    </div>

    <div class="areas">
      <div class="area"
           v-for="area in areas"
          :key="area">
        <label>
          <input type="checkbox"
                 v-model="selectedAreas"
                 :value="area"
                 @change="updateAreas">
          {{ area }}
        </label>
      </div>
    </div>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import coachAreas from '@/utils/areas';
import BaseSearch from '../UI/BaseSearch.vue';


export default defineComponent({
  components: {
    BaseSearch
  },
  emits: [
    "update-areas",
    "update-search-term"
  ],
  setup(_, context) {
    const areas = coachAreas;
    const selectedAreas = ref(areas);

    function updateAreas() {
      context.emit('update-areas', selectedAreas.value);
    }

    function doSearch(term: string) {
      context.emit('update-search-term', term);
    }

    return {
      areas,
      selectedAreas,
      updateAreas,
      doSearch
    }
  },
})
</script>

<style scoped>
div.areas {
  display: flex;
  justify-content: center;
}
label {
  display: block;
  margin: 0 10px;
}
.search-box {
  margin-bottom: 1rem;
}
</style>
