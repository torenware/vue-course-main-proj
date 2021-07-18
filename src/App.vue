<template>
  <the-header :counting-down="countingDown" />
  <about-to-idle-out  @close="dismissIdleOut" v-if="idleThreat && !countingDown"/>
  <renew-session  @close="dialogCancelled" v-if="countingDown && !hasCancelled" />
  <base-container>
    <transition name="fade">
      <base-flash v-if="displayFlash" />
    </transition>
    <router-view></router-view>
  </base-container>
</template>


<script lang="ts">
import { defineComponent, ref, provide, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from '@/store';
import TheHeader from './components/layout/TheHeader.vue';
import RenewSession from './components/widgets/RenewSession.vue';
import AboutToIdleOut from './components/widgets/AboutToIdleOutAlert.vue';
import notifier from '@/store/countDowner';

export default defineComponent({
  components: {
    TheHeader,
    RenewSession,
    AboutToIdleOut
  },
  setup() {
    const loaded = ref(false);
    const fubar = ref(false);
    const cancelled = ref(false);
    const idledOut = ref(false);
    // Put up UI for about-to-idle-out:
    const idleThreat = ref(false);
    provide('loaded', loaded);
    provide('fubar', fubar);

    // Final countdown to expiration:
    const countingDown = computed(() => {
      return store.state.auth.countingDown;
    });

    const isIdle = computed(() => {
      return store.state.idle.idle !== 0;
    });

    const almostIdledOut = computed(() => {
      if (store.state.idle.idle === 0) {
        return false;
      }
      return store.state.idle.aboutToExpire;
    });

    const hasCancelled = computed(() => {
      return cancelled.value;
    });

    function dialogCancelled() {
      cancelled.value = true;
    }

    const store = useStore();
    const router = useRouter();
    const route = useRoute();

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
      else if (store.getters.jwtToken) {
        // call logout w/o the flash message.
        store.dispatch('logout', false);
      }
      else {
        // if we landed first at a guarded route,
        // trigger the route guards.
        const path = route.path;
        router.replace(path);
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

    const loginState = computed(() => {
      const lis =  store.state.auth.loggedIn;
      return lis;
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

    watch(loginState, now => {
      console.log('loginState is', now);
      if (now === '') {
        // Just logged out
        idledOut.value = false;
        idleThreat.value = false;
      }
    });

    watch(almostIdledOut, now => {
      if (now) {
        if (loginState.value !== '') {
          store.dispatch('setFlash', "30 second warning");
          idleThreat.value = true;
        }
      }
    });

    function dismissIdleOut() {
      idleThreat.value = false;
    }

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
      dialogCancelled,
      idleThreat,
      dismissIdleOut
    }
  }
})
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  @import "@/scss/main.scss";
  font-family: "Roboto", sans-serif;
  // font-size: 62.5%; //rem == 10px

  @include respond(tab-land) {
    // rem == 9px
    // font-size: 56.25%;
  }

  @include respond(tab-port) {
    // rem == 8px
    // font-size: 50%;
  }

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

section {
  @media only screen and (max-width: 40em) {
    margin: 0;
    padding: .5rem 0;
  }
}

</style>
