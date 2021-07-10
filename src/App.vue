<template>
  <the-header :counting-down="countingDown" />
  <renew-session  @close="dialogCancelled" v-if="countingDown && !hasCancelled" />
  <base-container>
    <transition name="fade">
      <base-flash v-if="displayFlash" />
    </transition>
    <router-view></router-view>
  </base-container>
</template>


<script lang="ts">
import { defineComponent, ref, provide, computed, watch, onMounted  } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import TheHeader from './components/layout/TheHeader.vue';
import RenewSession from './components/widgets/RenewSession.vue';
import notifier from '@/store/countDowner';

export default defineComponent({
  components: {
    TheHeader,
    RenewSession
  },
  setup() {
    const loaded = ref(false);
    const fubar = ref(false);
    const cancelled = ref(false);
    provide('loaded', loaded);
    provide('fubar', fubar);

    // Final countdown to expiration:
    const countingDown = computed(() => {
      return store.getters.countingDown;
    });

    const isIdle = computed(() => {
      return store.getters.isIdle;
    });

    const hasCancelled = computed(() => {
      return cancelled.value;
    });

    function dialogCancelled() {
      cancelled.value = true;
    }

    const store = useStore();
    const router = useRouter();

    try {
      store.dispatch('loadLocalData');
      store.dispatch('loadStore', loaded);
      store.dispatch('monitorIdle');
      if (store.getters.timeRemaining > 0) {
        console.log('start clock');
        store.dispatch('setCurrentCoach');
        // start the clock...
        store.dispatch('setUpTimer', notifier);
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
        }, 6 * 1000);
      }
    });

    watch(countingDown, now => {
      if (!now) {
        cancelled.value = false;
      }
    });


    onMounted(() => {
      if (fubar.value) {
        store.dispatch('setFlash', 'Sorry! The database failed to load for us!');
        router.push('/404');
      }
    });

    return {
      displayFlash,
      countingDown,
      isIdle,
      hasCancelled,
      dialogCancelled
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
