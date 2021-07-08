import { StoreOptions } from 'vuex';

interface AuthStore {
  loggedIn: string;
}

interface UserAttribs {
  name: string;
  email: string;
  password: string;
}

interface LocalParams {
  [index: string]: string;
  userId: string;
}

function getLocalKeys() {
  return ['userId'];
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
      loggedIn: ''
    };
  },
  mutations: {
    setLogin(state, userId: string) {
      console.log('login set to', userId);
      state.loggedIn = userId;
    }
  },
  getters: {
    loginStatus(state) {
      console.log('LIS in store:', state.loggedIn);
      return state.loggedIn;
    }
  },
  actions: {
    loadLocalData(context) {
      const userId = localStorage.getItem('userId');
      if (userId !== null) {
        context.commit('setLogin', userId);
      }
    },
    signup(context, _: UserAttribs) {
      // simulate it for now
      const id = Date.now().toString(16);
      context.commit('setLogin', id);
      saveLocalData({
        userId: id
      });
    },
    login(context, _: { email: string; password: string }) {
      // temp: just wing it
      const id = Date.now().toString(16);
      context.commit('setLogin', id);
      saveLocalData({
        userId: id
      });
    },
    logout(context) {
      context.commit('setLogin', '');
      clearLocalData();
    }
  }
};

export default store;
