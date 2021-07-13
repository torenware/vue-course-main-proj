import { StoreOptions } from 'vuex';

export interface FormContextStore {
  // should be set *during* a form clear.
  clearingForm: boolean;
  processingBlur: boolean;
}

const store: StoreOptions<FormContextStore> = {
  state() {
    return {
      clearingForm: false,
      processingBlur: false
    };
  },
  mutations: {
    setClearingForm(state, isClearing: boolean) {
      state.clearingForm = isClearing;
    },
    setProcessingBlur(state, val: boolean) {
      state.processingBlur = val;
    }
  },
  getters: {
    inClearingForm(state) {
      return state.clearingForm;
    },
    inProcessingBlur(state) {
      return state.processingBlur;
    }
  }
};

export default store;
