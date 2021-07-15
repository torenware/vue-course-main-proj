import { StoreOptions } from 'vuex';
import IdleJS from 'idle-js';
import ms from 'ms';
import appDefaults from '@/utils/defaults';

export interface IdleStore {
  // date number in micro seconds.
  // 0 for not idle.
  idle: number;
  expires: number;
  aboutToExpire: boolean;
  idleTimer: number | null;
  idleJs: IdleJS | null;
}

const store: StoreOptions<IdleStore> = {
  state() {
    return {
      idle: 0,
      idleTimer: null,
      expires: 0,
      aboutToExpire: false,
      idleJs: null
    };
  },
  mutations: {
    setIdleJSInstance(state, instance: IdleJS) {
      state.idleJs = instance;
    },
    setIdle(state, idle: number) {
      state.idle = idle;
      if (state.idle === 0) {
        state.expires = 0;
      } else {
        const setting = appDefaults.IDLE_TIMEOUT;
        const interval = ms(setting);
        state.expires = state.idle + interval;
      }
    },
    setIdleTimer(state, tid: number | null) {
      state.idleTimer = tid;
    },
    setAboutToExpire(state, value: boolean) {
      state.aboutToExpire = value;
    }
  },
  getters: {
    isIdle(state) {
      return state.idle > 0;
    },
    // idle in ms
    idleFor(state, _getters, _rs) {
      if (state.idle === 0) {
        return 0;
      }
      return Date.now() - state.idle;
    },
    idleExpires(state) {
      return state.expires;
    },
    idleHasExpired(state) {
      const diff = Date.now() - state.expires;
      return diff > 0;
    },
    getIdleTID(state) {
      return state.idleTimer;
    }
  },

  actions: {
    // This needs to get called to start idle monitoring.
    monitorIdle(context) {
      // Split the main functionality into nice readable functions:
      function clearCurrentTimer() {
        const timer = context.state.idleTimer;
        if (!timer) {
          console.log('no timer found');
          return;
        }
        clearInterval(timer);
        context.commit('setIdleTimer', null);
      }

      function checkExpires() {
        const expires = context.state.expires;
        if (expires && Date.now() - expires > 0) {
          console.log('expiring...');
          const timer = context.getters.getIdleTID;
          clearCurrentTimer();
          console.log('we expired at', new Date());
          context.dispatch('triggerIdleDoneEvent');
        } else if (expires > 0 && expires - Date.now() < 60 * 1000) {
          context.dispatch('triggerAboutToExpire');
        }
      }

      function setUpTimer() {
        context.commit('setIdle', Date.now());
        const expireAt = context.getters.idleExpires;
        console.log('Will idle out at', new Date(expireAt));
        const timer = setInterval(() => {
          checkExpires();
        }, 10 * 1000);
        context.commit('setIdleTimer', timer);
      }

      console.log('monitoring idleness');
      const instance = new IdleJS({
        onIdle() {
          // console.log('Detecting idle state at', new Date());
          setUpTimer();
        },
        onActive() {
          clearCurrentTimer();
          // console.log('activity detected');
        }
      });
      // save it to the store.
      context.commit('setIdleJSInstance', instance);
      instance.start();
    },
    triggerIdleDoneEvent(context) {
      // We only do this if someone is logged in.
      if (context.rootGetters.loginStatus !== '') {
        console.log('Idle leads to logout');
        context.dispatch('logout');
      }
    },
    triggerAboutToExpire(context) {
      context.commit('setAboutToExpire', true);
    },
    resetIdleCounters(context) {
      const timer = context.state.idleTimer;
      if (timer) {
        clearInterval(timer);
        context.commit('setIdleTimer', null);
      }
      context.commit('setIdle', 0);
      context.commit('setAboutToExpire', false);
      context.state.idleJs?.reset();
    }
  }
};

export default store;
