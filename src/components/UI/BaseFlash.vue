<template>
  <base-card>
    {{ flash }}
  </base-card>
</template>

<script lang="ts">
import { defineComponent, computed} from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  setup() {
    const store = useStore();

    const flash = computed(() => {
      const flash = store.getters.currentFlash;
      return flash;
    });


    return {
      flash
    };
  },
})
</script>
