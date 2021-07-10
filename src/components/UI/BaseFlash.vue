<template>
  <base-card :cardType="flassClass">
    <div class="container">
    {{ flash }}
    </div>
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

    const flassClass = computed(() => {
      const currClass = store.getters.currentMsgType;
      return currClass;
    });

    return {
      flash,
      flassClass
    };
  },
})
</script>

<style scoped>
.container {
  text-align: center;
}
</style>
