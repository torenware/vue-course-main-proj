<template>
  <header>
    <h1><router-link to="/">Coach Hotel</router-link></h1>
    <nav>
      <ul>
        <li class="state">
          State: {{ isLoggedIn }}
        </li>
        <li>
          <router-link to="/coaches">Pick A Coach</router-link>
        </li>
        <li>
          <router-link to="/signin" v-if="!isLoggedIn">
            Log In
          </router-link>
          <router-link to="/signup" v-if="!isLoggedIn">
            Sign Up
          </router-link>
        </li>
          <button @click="logout" v-if="isLoggedIn">
            Log Out
          </button>
        <li>
          <router-link to="/requests" v-if="isLoggedIn">
            Browse Your Requests
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();

    function logout() {
      store.dispatch('logout');
      router.push('/');
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

    return {
      isLoggedIn,
      logout
    };
  },
})
</script>


<style>
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

header a, header button {
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
  justify-content: flex-end;
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
}

.state {
  color: white;
}
</style>