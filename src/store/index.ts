import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

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

export const key: InjectionKey<Store<CoachList>> = Symbol()

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
    },
    addCoach(state, coach: Coach) {
      state.coaches.push(coach);
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
        return '';
      }
    }
   },
   actions: {
     async loadStore(context) {
       const coaches = await loadData();
       context.commit('initStore', coaches);
     },

     async addCoach(context, newCoach) {
       console.log('AC called');
       // @ts-ignore
       const id = Date.now().toFixed(0).toString(16);
       const rawCoach = {
        ...newCoach,
        id
       };
       try {
         console.log('received', rawCoach);
         const coach = await fetcher<Coach>('api/coaches', 'POST', rawCoach);
         context.commit('addCoach', coach);
         console.log('got back', coach);
       }
       catch(e) {
         console.log(e);
         // emit error here?
       }
     }
   }

});

// @ts-ignore
export function InitStore(app) {
  app.use(store, key);
}

// Our own overloaded useStore
export function useStore() {
  return baseUseStore(key);
}

export default store;
