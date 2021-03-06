<template>
  <header>
    <h1><router-link to="/">Coach Hotel</router-link></h1>
    <nav>
      <div class="user-name">
        <div>
           Hello, {{ userName }}
         </div>
         <div class="expiring-in" v-if="countingDown">
           {{ timeRemaining }}
         </div>
      </div>
      <ul>
        <li>
          <router-link to="/coaches">Pick A Coach</router-link>
        </li>
        <li>
          <router-link to="/requests" v-if="isCoach">
            Browse Your Requests
          </router-link>
          <router-link to="/register" v-else-if="isLoggedIn && !isCoach">
            Become a Coach
          </router-link>
        </li>
        <li class='auth'>
          <router-link to="/signin" v-if="!isLoggedIn">
            Log In
          </router-link>
          <router-link to="/signup" v-if="!isLoggedIn">
            Sign Up
          </router-link>
          <button @click="logout" v-if="isLoggedIn">
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  props: ['countingDown'],
  setup() {
    const store = useStore();

    function logout() {
      store.dispatch('logout');
    }

    const isLoggedIn = computed(() => {
      const lis = store.getters.loginStatus;
      if (!lis) {
        return false;
      }
      else {
        return true;
      }
    });

    const timeRemaining = computed(() => {
      const uiString = store.getters.countdownString;
      if (uiString === '') {
        return '';
      }
      return `Logging out in ${uiString}`;
    });

    const userName = computed(() => {
      const fullName = store.getters.userFullName;
      return fullName;
    });

    const isCoach = computed(() => {
      return store.getters.currentCoach;
    });

    return {
      isLoggedIn,
      userName,
      logout,
      isCoach,
      timeRemaining
    };
  },
})
</script>


<style lang="scss">
  header {
  width: 100%;
  height: 5rem;
  background-color: #3d008d;
  display: flex;
  justify-content: center;
  align-items: center;

}

header button {
  background-color: #3d008d;
}

header a, header button, div.user-name {
  text-decoration: none;
  color: #f391e3;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;

}

a:active,
a:hover,
a.router-link-active,
header button:active,
header button:hover
{
  border: 1px solid #f391e3;
}

h1 {
  margin: 20px;
  color: white;

  @media only screen and (max-width: 40em) {
    font-size: 16px;
    margin: 5px;
  }

}

h1 a {
  color: white;
  margin: 0;
}

h1 a:hover,
h1 a:active,
h1 a.router-link-active {
  border-color: transparent;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;

  @media only screen and (max-width: 40em) {
    font-size: 80%;
  }


.user-name {
    @media only screen and (max-width: 40em) {
      display: none;
    }
  }

}

header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 0.5rem;
  text-align: center;

  @media only screen and (max-width: 40em) {
    margin: 0 0.2rem;
  }

  &:last-of-type {
    margin-right: 2em;
    @media only screen and (max-width: 40em) {
      margin-right: 1em;
    }
  }

  &.auth {
    display: flex;
  }

}

.expiring-in {
  font-size: smaller;
}

</style>