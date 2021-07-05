import { StoreOptions } from 'vuex';

export interface FlashStore {
  flash: string;
}

const store: StoreOptions<FlashStore> = {
  state() {
    return {
      flash: ''
    };
  },
  mutations: {
    setFlash(state, msg: string) {
      state.flash = msg;
    }
  },
  getters: {
    currentFlash(state) {
      return state.flash;
    },
    hasFlash(state) {
      return state.flash.length > 0;
    }
  },
  actions: {
    setFlash(context, msg: string) {
      context.commit('setFlash', msg);
    }
  }
};

export default store;
