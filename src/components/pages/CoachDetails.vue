<template>
  <h2>Coach Details</h2>
  <p>For Coach ID = {{ $route.params.id}}</p>
  <p v-if="isTopLevelPage"><router-link :to="contactLink">Contact This Coach</router-link></p>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute} from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const contactLink = computed(() => {
      return `/coaches/${route.params.id}/contact`;
    });

    const isTopLevelPage = computed(() => {
      const path = route.fullPath.split('/');
      const id = route.params.id;
      if (id !== path.pop()) {
        return false;
      }
      return true;
    });

    return {
      contactLink,
      isTopLevelPage
    };
  },
})
</script>
