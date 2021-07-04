import { createStore } from 'vuex';
// @ts-ignore
// import coaches from '@/coaches';

import type { Coach } from '@/types';
import fetcher from './fetcher';

interface CoachList {
  coaches: Coach[];
}

interface FetchOptions {
  method: string;
  // path to resource
  res: string;
  body?: object;
}

async function loadData(): Promise<Coach[]> {
  try {
    const coaches = await fetcher<Coach[]>('api/coaches', 'GET');
    return coaches;
  }
  catch(err) {
    console.log('Problem fetching', err);
    return [];
  }
}

// Create a new store instance.
const store = createStore({
  state() {
    return {
      coaches: []
    };
  },
  mutations: {
    initStore(state: CoachList, coaches: Coach[]) {
      state.coaches = coaches;
    }
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
   },
   actions: {
     async loadStore(context) {
       const coaches = await loadData();
       context.commit('initStore', coaches);
     }
   }

});

export default store;
