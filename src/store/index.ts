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
  currentCoach: Coach | null;
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
      requestsLoaded: LoadingState.unset,
      currentCoach: null
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
    setCurrentCoach(state, coach: Coach | null) {
      state.currentCoach = coach;
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
    currentCoach(state) {
      return state.currentCoach;
    },
    // Returns a function taking coachId
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
    // Returns a function taking coachId
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
    },
    userFullName(state, getters) {
      const user = getters.user;
      if (user.id) {
        const coach = getters.currentCoach;
        if (coach) {
          return getters.fullName(user.id);
        } else {
          return user.name;
        }
      }
      return 'Guest';
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
        try {
          if (!id || id === '') {
            throw new Error('Must be logged in to register as a coach');
          }
          const rawCoach = {
          ...newCoach,
          id
          };
         const token = context.rootGetters.jwtToken;
         const coach = await fetcher<Coach>('api/coaches', 'POST', token, rawCoach);
         context.commit('addCoach', coach);
         context.dispatch('setCurrentCoach', null, {root: true});
       }
       catch(err) {
         context.dispatch('setFlash', {
           msg: 'Sorry! There was a problem registering.',
           msgType: 'error'
         },
         {root: true}
         );
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
     },
     async setCurrentCoach(context) {
       const userId = context.getters.loginStatus;
       if (!userId) {
         context.commit('setCurrentCoach', null);
       }
       else {
         try {
           const coach = await fetcher<Coach>('api/coaches/' + userId, 'GET');
           if (!coach) {
             context.commit('setCurrentCoach', null);
           }
           else {
             context.commit('setCurrentCoach', coach);
           }
         }
         catch (err) {
            console.log('threw looking for current coach');
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
