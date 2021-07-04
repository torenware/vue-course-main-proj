import { createStore } from 'vuex';
// @ts-ignore
import coaches from '@/coaches';

import type { Coach } from '@/types'; 

interface CoachList {
  coaches: Coach[];
}

// Create a new store instance.
const store = createStore({
  state() {
    return {
      coaches: coaches as Coach[]
    };
  },
  getters: {
    coaches(state: CoachList) {
      return state.coaches;
    }
  }
});

export default store;
