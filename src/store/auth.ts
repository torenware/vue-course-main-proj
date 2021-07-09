import { StoreOptions } from 'vuex';
import fetcher from './fetcher';
import router from '../routes';

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
        const user = await fetcher<User>('auth/signup', 'POST', false, payload);
        context.commit('setLogin', user.id);
        context.commit('setToken', user.token);
        saveLocalData({
          userId: user.id,
          token: user.token
        });
        router.push('/');
        window.scroll(0, 0);
        context.dispatch('setFlash', { msg: 'Thank you for signing up.' });
      } catch (err) {
        context.dispatch('setFlash', {
          msg: 'Problem creating your account.',
          msgType: 'error'
        });
        window.scroll(0, 0);
      }
    },
    async login(context, userData: { email: string; password: string }) {
      try {
        const user = await fetcher<User>(
          'auth/signin',
          'POST',
          false,
          userData
        );
        context.commit('setLogin', user.id);
        context.commit('setToken', user.token);
        saveLocalData({
          userId: user.id,
          token: user.token
        });
        // if a coach, load their data.
        context.dispatch('setCurrentCoach');
        router.push('/');
        window.scroll(0, 0);
        context.dispatch('setFlash', 'Welcome back!');
      } catch (err) {
        context.dispatch('setFlash', {
          msg: 'There was a problem logging you in.',
          msgType: 'error'
        });
        window.scroll(0, 0);
      }
    },
    logout(context) {
      context.commit('setLogin', '');
      context.commit('setToken', '');
      context.commit('setCurrentCoach', null);
      clearLocalData();
    }
  }
};

export default store;
