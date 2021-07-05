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
      console.log('call API here');
      const tmpID = Date.now()
        .toFixed()
        .toString();
      newRequest.id = tmpID;
      try {
        const request = await fetcher<Request>(
          'api/requests',
          'POST',
          newRequest
        );
        context.commit('addRequest', request);
      } catch (e) {
        console.log(e);
        // emit error here?
      }
    },

    async loadRequests(context, loaded: Ref<boolean>) {
      try {
        loaded.value = false;
        const requests = await fetcher<Request[]>('api/requests', 'GET');
        context.commit('loadRequests', requests);
        loaded.value = true;
        console.log('requests loaded');
      } catch (err) {
        console.log('Problem fetching requests', err);
      }
    }
  }
};

export default store;
