<template>
  <the-header />
  <base-container>
    <base-flash v-if="displayFlash" />
    <router-view></router-view>
  </base-container>
</template>


<script lang="ts">
import { defineComponent, ref, provide, computed, watch, onMounted  } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import TheHeader from './components/layout/TheHeader.vue';

export default defineComponent({
  components: {
    TheHeader,
  },
  setup() {
    const loaded = ref(false);
    // const loadedRequests = ref(false);
    const fubar = ref(false);
    provide('loaded', loaded);
    // provide('loadedRequests', loadedRequests);
    provide('fubar', fubar);

    const store = useStore();
    const router = useRouter();

    try {
      store.dispatch('loadLocalData');
      store.dispatch('loadStore', loaded);
      if (store.getters.timeRemaining > 0) {
        console.log('start clock');
        store.dispatch('setCurrentCoach');
        // start the clock...
        store.dispatch('setUpTimer');
      }
    }
    catch (err) {
      // Regretably not much to do here.  Not even the router
      // is up yet!
      console.error('App data failed to load from server:', err);
      fubar.value = true;
    }

    const displayFlash = computed(() => {
      return store.getters.hasFlash;
    });

    watch(displayFlash, (now: boolean) => {
      if (now) {
        setTimeout(() => {
          store.dispatch('setFlash', '');
        }, 10 * 1000);
      }
    })


    onMounted(() => {
      if (fubar.value) {
        store.dispatch('setFlash', 'Sorry! The database failed to load for us!');
        router.push('/404');
      }
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
