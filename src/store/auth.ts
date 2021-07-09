import { StoreOptions } from 'vuex';
import fetcher from './fetcher';
import router from '../routes';

interface AuthStore {
  loggedIn: string;
  token: string | null;
  name: string;
  email: string;
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

// Params in localStorage
interface LocalParams {
  [index: string]: string;
  userId: string;
  token: string;
}

// Keys for localStorage.
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
      token: null,
      name: '',
      email: ''
    };
  },
  mutations: {
    setLogin(state, userId: string) {
      state.loggedIn = userId;
    },
    setToken(state, token: string | null) {
      state.token = token;
    },
    setUser(state, user: User | null) {
      if (user) {
        state.loggedIn = user.id;
        state.token = user.token;
        state.email = user.email;
        state.name = user.name;
      } else {
        state.loggedIn = '';
        state.token = null;
        state.email = '';
        state.name = '';
      }
    }
  },
  getters: {
    loginStatus(state) {
      return state.loggedIn;
    },
    jwtToken(state) {
      return state.token;
    },
    user(state) {
      return {
        id: state.loggedIn,
        token: state.token,
        email: state.email,
        name: state.name
      };
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
        context.commit('setUser', user);
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
        context.commit('setUser', user);
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
      context.commit('setUser', null);
      context.commit('setCurrentCoach', null);
      clearLocalData();
    }
  }
};

export default store;
