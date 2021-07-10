import { StoreOptions } from 'vuex';
import fetcher from './fetcher';
import router from '../routes';
import { ref, Ref } from 'vue';
import theCountDown from './countDowner';

interface AuthStore {
  loggedIn: string;
  token: string | null;
  name: string;
  email: string;
  expires: number | null;
  // ID of the expiry timer
  timer: number | null;
  countingDown: boolean;
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
  expires: number | null;
}

// Params in localStorage
interface LocalParams {
  [index: string]: string | number;
  userId: string;
  token: string;
  expires: number;
}

// Keys for localStorage.
function getLocalKeys() {
  return ['userId', 'token', 'expires'];
}

function saveLocalData(params: LocalParams) {
  Object.keys(params).forEach(key => {
    // @ts-ignore
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
      email: '',
      expires: null,
      timer: null,
      countingDown: false
    };
  },
  mutations: {
    setLogin(state, userId: string) {
      state.loggedIn = userId;
    },
    setToken(state, token: string | null) {
      state.token = token;
    },
    setExpires(state, expires: number | null) {
      state.expires = expires;
    },
    setTimer(state, timerId: number | null) {
      state.timer = timerId;
    },
    setCountingDown(state, val: boolean) {
      state.countingDown = val;
    },
    setUser(state, user: User | null) {
      if (user) {
        state.loggedIn = user.id;
        state.token = user.token;
        state.email = user.email;
        state.name = user.name;
        state.expires = user.expires;
      } else {
        state.loggedIn = '';
        state.token = null;
        state.email = '';
        state.name = '';
        state.expires = null;
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
    timerId(state) {
      return state.timer;
    },
    // TTL in seconds.
    timeRemaining(state) {
      if (state.expires === null) {
        return -1;
      }
      return Math.round(state.expires - Date.now() / 1000);
    },
    countingDown(state) {
      return state.countingDown;
    },
    user(state) {
      return {
        id: state.loggedIn,
        token: state.token,
        email: state.email,
        name: state.name,
        expires: state.expires
      };
    }
  },
  actions: {
    loadLocalData(context) {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const expires = localStorage.getItem('expires');
      if (userId !== null) {
        context.commit('setLogin', userId);
      }
      if (token !== null) {
        context.commit('setToken', token);
      }
      if (expires) {
        context.commit('setExpires', expires);
      }
    },
    // Force logout and manage a count-down widget.
    setUpTimer(context, notifier: Ref<number>) {
      console.log('start timer');
      const timerId = setInterval(() => {
        if (context.getters.timeRemaining <= 0) {
          console.log('Logging out as time has expired');
          context.commit('setCountingDown', false);
          context.dispatch('logout');
        } else if (
          !context.getters.countingDown &&
          context.getters.timeRemaining < 4 * 60
        ) {
          console.log('start the countdown');
          context.commit('setCountingDown', true);
          context.dispatch('setUpCountdown', notifier);
        }
      }, 1 * 60 * 1000);
      context.commit('setTimer', timerId);
    },
    cleanUpTimer(context) {
      const id = context.getters.timerId;
      if (id) {
        clearInterval(id);
        context.commit('setTimer', null);
      }
    },
    setUpCountdown(context, notifier: Ref<number>) {
      console.log('countdown action starts');
      const ref = notifier;
      ref.value = context.getters.timeRemaining;
      const timer = setInterval(() => {
        if (!context.getters.countingDown) {
          clearInterval(timer);
          ref.value = 0;
          console.log('stopped from counting down');
          return;
        }
        ref.value = context.getters.timeRemaining;
        if (ref.value <= 0) {
          console.log('stopped from ref going to 0');
          ref.value = 0;
          clearInterval(timer);
        }
      }, 1000);
    },
    async signup(context, userData: UserAttribs) {
      try {
        const payload: UserAttribs = userData;
        const user = await fetcher<User>('auth/signup', 'POST', false, payload);
        context.commit('setUser', user);
        saveLocalData({
          userId: user.id,
          token: user.token,
          expires: user.expires || 0
        });
        context.dispatch('setUpTimer', theCountDown);
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
        console.log(user);
        context.commit('setUser', user);
        saveLocalData({
          userId: user.id,
          token: user.token,
          expires: user.expires || 0
        });
        // if a coach, load their data.
        context.dispatch('setCurrentCoach');
        context.dispatch('setUpTimer', theCountDown);
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
      context.dispatch('cleanUpTimer');
      clearLocalData();
    }
  }
};

export default store;
