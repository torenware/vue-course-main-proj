import { StoreOptions } from 'vuex';
import fetcher from './fetcher';
import FetchError from '@/utils/FetchError';
import router from '@/routes';
import { LS_UNSET, LS_LOADING, LS_LOADED } from '@/types';
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
        context.dispatch(
          'setFlash',
          {
            msg: 'Our server did not handle the request',
            msgType: 'error'
          },
          { root: true }
        );
        window.scroll(0, 0);
      }
    },

    async loadRequests(context) {
      try {
        const token = context.rootGetters.jwtToken;
        context.commit('setRequestsLoaded', LS_LOADING, { root: true });
        const requests = await fetcher<Request[]>('api/requests', 'GET', token);
        context.commit('setRequestsLoaded', LS_LOADED, { root: true });
        context.commit('loadRequests', requests);
      } catch (err) {
        if (err instanceof FetchError) {
          if (err.statusCode === 401) {
            context.dispatch('logout', null, { root: true });
            context.dispatch(
              'setFlash',
              {
                msg: 'Your session has expired. Please Log In again.',
                msgType: 'error'
              },
              { root: true }
            );
            router.push('/signin');
            window.scroll(0, 0);
            return;
          }
        }
        // For anybody else...
        context.dispatch(
          'setFlash',
          {
            msg: 'Sorry! We had a problem getting your requests',
            msgType: 'error'
          },
          { root: true }
        );
      }
      context.commit('setRequestsLoaded', LS_UNSET, { root: true });
    }
  }
};

export default store;
