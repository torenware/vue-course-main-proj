import { StoreOptions } from 'vuex';
import fetcher from './fetcher';

interface AuthStore {
  loggedIn: string;
  token: string | null;
}

interface UserAttribs {
  name: string;
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
  id: string;
  token: string;
}

interface LocalParams {
  [index: string]: string;
  userId: string;
  token: string;
}

function getLocalKeys() {
  return ['userId', 'token'];
}

function saveLocalData(params: LocalParams) {
  Object.keys(params).forEach(key => {
    localStorage.setItem(key, params[key]);
  });
}

function clearLocalData() {
  const keys = getLocalKeys();
  keys.forEach(key => {
    localStorage.removeItem(key);
  });
}

const store: StoreOptions<AuthStore> = {
  state() {
    return {
      // A user ID or blacnk
      loggedIn: '',
      token: null
    };
  },
  mutations: {
    setLogin(state, userId: string) {
      state.loggedIn = userId;
    },
    setToken(state, token: string | null) {
      state.token = token;
    }
  },
  getters: {
    loginStatus(state) {
      return state.loggedIn;
    },
    jwtToken(state) {
      return state.token;
    }
  },
  actions: {
    loadLocalData(context) {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (userId !== null) {
        context.commit('setLogin', userId);
      }
      if (token != null) {
        context.commit('setToken', token);
      }
    },
    async signup(context, userData: UserAttribs) {
      try {
        const payload: UserAttribs = userData;
        // @ts-ignore
        const user = await fetcher<User>('auth/signup', 'POST', null, payload);
        context.commit('setLogin', user.id);
        context.commit('setToken', user.token);
        saveLocalData({
          userId: user.id,
          token: user.token
        });
      } catch (err) {
        throw new Error(err);
      }
    },
    login(context, _: { email: string; password: string }) {
      // temp: just wing it
      const id = Date.now().toString(16);
      context.commit('setLogin', id);
      saveLocalData({
        userId: id,
        token: ''
      });
    },
    logout(context) {
      context.commit('setLogin', '');
      clearLocalData();
    }
  }
};

export default store;
