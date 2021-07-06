<template>
  <base-card>
    <h2>Sorry! You've Ended Up Here</h2>
    <base-flash v-if="displayFlash" />
    <p v-else>
      The page you sought was not found on this site. ALAS!!
    </p>
  </base-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  setup() {
    const store = useStore();
    const displayFlash = ref(false);

    displayFlash.value = store.getters.hasFlash;

    return {
      displayFlash
    };
  },
})
</script>
