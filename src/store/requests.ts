import { StoreOptions } from 'vuex';
import { Ref } from 'vue';
import fetcher from './fetcher';

interface Request {
  id?: string;
  coachId: string;
  title: string;
  email: string;
  message: string;
}

export interface RequestStore {
  requests: Request[];
}

const store: StoreOptions<RequestStore> = {
  // @ts-ignore
  namespaced: true,
  state() {
    return {
      requests: []
    };
  },
  mutations: {
    addRequest(state, request: Request) {
      state.requests.unshift(request);
    },
    loadRequests(state, requests: Request[]) {
      state.requests = requests;
    }
  },
  getters: {
    allRequests(state) {
      return state.requests;
    },
    requests(state, coachId: string) {
      return (coachId => {
        return state.requests.filter(req => {
          return req.coachId === coachId;
        });
      })(coachId);
    },
    hasRequests(state) {
      return state.requests.length > 0;
    }
  },
  actions: {
    async addRequest(context, newRequest: Request) {
      const tmpID = Date.now()
        .toFixed()
        .toString();
      newRequest.id = tmpID;
      try {
        const request = await fetcher<Request>(
          'api/requests',
          'POST',
          false, // no token yet
          newRequest
        );
        context.commit('addRequest', request);
      } catch (e) {
        throw new Error(e);
      }
    },

    async loadRequests(context, loaded: Ref<boolean>) {
      try {
        const token = context.rootGetters.jwtToken;
        loaded.value = false;
        const requests = await fetcher<Request[]>('api/requests', 'GET', token);
        context.commit('loadRequests', requests);
        loaded.value = true;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};

export default store;
