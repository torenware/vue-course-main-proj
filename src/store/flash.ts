import { StoreOptions } from 'vuex';
import { Ref } from 'vue';

interface FlashParams {
  msg: string;
  msgType: string;
}

export interface FlashStore {
  flash: string;
  msgType: string;
}

const store: StoreOptions<FlashStore> = {
  state() {
    return {
      flash: '',
      msgType: ''
    };
  },
  mutations: {
    setFlash(state, msg: string, msgType: string = '') {
      state.flash = msg;
    },
    setMsgType(state, msgType: string) {
      state.msgType = msgType;
    }
  },
  getters: {
    currentFlash(state) {
      return state.flash;
    },
    currentMsgType(state) {
      return state.msgType;
    },
    hasFlash(state) {
      return state.flash.length > 0;
    }
  },
  actions: {
    setFlash(context, payload: string | FlashParams) {
      const msg = typeof payload === 'string' ? payload : payload.msg;
      const msgType: string =
        typeof payload === 'string' ? '' : payload.msgType;
      context.commit('setFlash', msg);
      context.commit('setMsgType', msgType);
    }
  }
};

export default store;
