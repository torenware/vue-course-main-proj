import { StoreOptions } from 'vuex';
import IdleJS from 'idle-js';

interface IdleStore {
  idle: boolean;
}

const store: StoreOptions<IdleStore> = {
  state() {
    return {
      idle: false
    };
  },
  mutations: {
    setIdle(state, idle: boolean) {
      state.idle = idle;
    }
  },
  getters: {
    isIdle(state) {
      return state.idle;
    }
  },
  actions: {
    // This needs to get called to start idle monitoring.
    monitorIdle(context) {
      const instance = new IdleJS({
        onIdle() {
          context.commit('setIdle', true);
        },
        onActive() {
          context.commit('setIdle', false);
        }
      });
      instance.start();
    }
  }
};

export default store;
