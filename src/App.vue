<template>
  <the-header />
  <base-container>
    <base-flash v-if="displayFlash" />
    <router-view></router-view>
  </base-container>
</template>


<script lang="ts">
import { defineComponent, ref, provide,  onMounted, onUpdated  } from 'vue';
import { useStore } from '@/store';
import TheHeader from './components/layout/TheHeader.vue';
import BaseFlash from './components/UI/BaseFlash.vue';

export default defineComponent({
  components: {
    TheHeader,
    BaseFlash
  },
  setup() {
    const loaded = ref(false);
    const loadedRequests = ref(false);
    provide('loaded', loaded);
    provide('loadedRequests', loadedRequests);
    const displayFlash = ref(false);

    const store = useStore();
    store.dispatch('loadStore', loaded);
    store.dispatch('requests/loadRequests', loadedRequests);

    function initializeFlash() {
      const hasFlash = store.getters.hasFlash;
      if (hasFlash) {
        displayFlash.value = true;
        setTimeout(() => {
          store.dispatch('setFlash', '');
          displayFlash.value = false;
        }, 10 * 1000);
      }
    }
    provide('initializeFlash', initializeFlash);


    onMounted(() => {
      initializeFlash();
    });

    onUpdated(() => {
      initializeFlash();
    });

    return {
      displayFlash
    }
  }
})
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}
</style>
