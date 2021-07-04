import { createStore } from 'vuex';
// @ts-ignore
import coaches from '@/coaches';

import type { Coach } from '@/types';

interface CoachList {
  coaches: Coach[];
}

type CoachOrNull = Coach | null;

type CoachFunc = (id: string) => CoachOrNull;

// Create a new store instance.
const store = createStore({
  state() {
    return {
      coaches: coaches as Coach[]
    };
  },
  getters: {
    coaches(state: CoachList): Coach[] {
      return state.coaches;
    },
    coachById(state: CoachList) {
      return (id: string): Coach | null => {
        const coach = state.coaches.find(item => {
          return item.id === id;
        });
        return coach || null;
      }
    },
    fullName(state, getters) {
      return (id: string) => {
        const coach = getters.coachById(id);
        if (coach) {
          return `${coach.firstName} ${coach.lastName}`;
        }
        return null;
      }
    }
   }
});

export default store;
