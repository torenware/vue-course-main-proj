import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';

import type { Coach } from '@/types';
// import  { LoadingState } from '@/types';
import fetcher from './fetcher';
import flashStore from './flash';
import requestStore from './requests';
import authStore from './auth';

enum LoadingState {
  unset = 0,
  loading = 1,
  loaded = 2
}

interface CoachList {
  coaches: Coach[];
  coachesLoaded: LoadingState;
  requestsLoaded: LoadingState;
}

export const key: InjectionKey<Store<CoachList>> = Symbol()

async function loadData(): Promise<Coach[]> {
  try {
    const coaches = await fetcher<Coach[]>('api/coaches', 'GET');
    return coaches;
  }
  catch(err) {
    throw new Error(err);
  }
}

// Create a new store instance.
const store = createStore<CoachList>({
  modules: {
    // @ts-ignore
    flash: flashStore,
    // @ts-ignore
    requests: requestStore,
    // @ts-ignore
    auth: authStore
  },
  // @ts-ignore
  state () {
    return {
      coaches: [],
      coachesLoaded: LoadingState.unset,
      requestsLoaded: LoadingState.unset
    };
  },
  mutations: {
    // @ts-ignore
    initStore(state: CoachList, coaches: Coach[]) {
      state.coaches = coaches;
    },
    addCoach(state, coach: Coach) {
      // @ts-ignore
      state.coaches.push(coach);
    },
    setCoachesLoaded(state, loaded: LoadingState) {
      state.coachesLoaded = loaded;
    },
    setRequestsLoaded(state, loaded: LoadingState) {
      state.requestsLoaded = loaded;
    }
  },
  getters: {
    coachesLoaded(state) {
      return state.coachesLoaded;
    },
    requestsLoaded(state) {
      return state.requestsLoaded;
    },
    coaches(state: CoachList): Coach[] {
      return state.coaches;
    },
    coachById(state: CoachList) {
      return (id: string): Coach | null => {
        if (!state.coaches) {
          //early in app history we may not yet be loaded
          return null;
        }
        try {
          const coach = state.coaches.find(item => {
            return item.id === id;
          });
          return coach || null;
        }
        catch(err) {
          console.log('db not init yet');
        }
        return null;
      }
    },
    fullName(state, getters) {
      return (id: string) => {
        let coach = null;
        try {
          coach = getters.coachById(id);
          if (coach) {
            return `${coach.firstName} ${coach.lastName}`;
          }
        }
        catch(err) {
          throw new Error('db not yet up');
        }
      }
    }
   },
   actions: {
     setCoachesLoaded(context, loaded: LoadingState) {
       context.commit('setCoachesLoaded', loaded);
     },
     setReqestsLoaded(context, loaded: LoadingState) {
       context.commit('setRequestsLoaded', loaded);
     },
     async loadStore(context, loaded) {
       const coaches = await loadData();
       context.commit('initStore', coaches);
       loaded.value = true;
     },

     async addCoach(context, newCoach) {
       // @ts-ignore
       const id = context.getters.loginStatus;
       if (!id || id === '') {
         throw new Error('Must be logged in to register as a coach');
       }
       const rawCoach = {
        ...newCoach,
        id
       };
       try {
         const token = context.rootGetters.jwtToken;
         const coach = await fetcher<Coach>('api/coaches', 'POST', token, rawCoach);
         context.commit('addCoach', coach);
       }
       catch(err) {
         throw new Error(err);
       }
     },

     // For route guards, since they may need to execute
     // too early for a full load.
     async validateCoach(context, coachId) {
       // First, see if we have a record.
       // @ts-ignore
       let coach = context.state.coaches.find(ch => ch.id === coachId);
       if (!coach) {
         // May be we just haven't loaded. So check the DB directly.
         // If we throw, the router will handle this.
         coach = await fetcher<Coach>('api/coaches/' + coachId, 'GET');
         if (!coach) {
           throw new Error('Coach not found');
         }
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
