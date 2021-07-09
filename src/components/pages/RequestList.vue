<template>
  <base-card v-if="!loading">
    <h2>Your Current Requests</h2>
    <ul v-if="requests.length">
      <li v-for="request in requests" :key="request.id">
        From: {{ request.email }}
      </li>
    </ul>
    <p v-else>
      No requests, dude. So sorry!
    </p>
  </base-card>
  <p v-else>Loading...</p>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import {useStore} from '@/store';


// enum LoadingState {
//   unset = 0,
//   loading = 1,
//   loaded = 2
// }

// eslint-disable-next-line no-unused-vars
const LS_UNSET = 0;
const LS_LOADING = 1;
// eslint-disable-next-line no-unused-vars
const LS_LOADED = 2;

export default defineComponent({
  setup() {
    const store = useStore();
    const loading = computed(() => {
      console.log('LS', store.getters.requestsLoaded);
      return store.getters.requestsLoaded === LS_LOADING;
    });
    store.dispatch('requests/loadRequests');

    const requests = computed(() => {
      return store.getters['requests/allRequests'];
    });

    return {
      requests,
      loading
    };


  },
})
</script>
