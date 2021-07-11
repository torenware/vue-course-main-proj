import { StoreOptions } from 'vuex';
import IdleJS from 'idle-js';
import ms from 'ms';
import appDefaults from '@/utils/defaults';

interface IdleStore {
  // date number in micro seconds.
  // 0 for not idle.
  idle: number;
  expires: number;
  idleTimer: number | null;
}

const store: StoreOptions<IdleStore> = {
  state() {
    return {
      idle: 0,
      idleTimer: null,
      expires: 0
    };
  },
  mutations: {
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
      function clearCurrentTimer() {
        const timer = context.getters.getIdleTID;
        clearInterval(timer);
        context.commit('setIdleTimer', null);
      }

      function checkExpires() {
        if (context.getters.idleHasExpired) {
          clearCurrentTimer();
          console.log('we expired at', new Date());
          context.dispatch('triggerIdleDoneEvent');
        }
      }

      function setUpTimer() {
        context.commit('setIdle', Date.now());
        const expireAt = context.getters.idleExpires;
        console.log('Will expire at', new Date(expireAt));
        const timer = setInterval(() => {
          checkExpires();
          console.log('checked idle');
        }, 10 * 1000);
        context.commit('setIdleTimer', timer);
      }

      console.log('monitoring idleness');
      const instance = new IdleJS({
        onIdle() {
          console.log('updating at', new Date());
          setUpTimer();
        },
        onActive() {
          clearCurrentTimer();
          console.log('activity detected');
        }
      });
      instance.start();
    },
    triggerIdleDoneEvent(context) {
      // We only do this if someone is logged in.
      if (context.rootGetters.loginStatus !== '') {
        console.log('Idle leads to logout');
        context.dispatch('logout');
      }
    }
  }
};

export default store;
