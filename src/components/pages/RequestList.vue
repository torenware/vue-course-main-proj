<template>
  <base-card v-if="loaded">
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
import { defineComponent, computed, inject, ref } from 'vue';
import {useStore} from '@/store';

export default defineComponent({
  setup() {
    const store = useStore();
    const loaded = inject('loadedRequests', ref(false));

    const requests = computed(() => {
      return store.getters['requests/allRequests'];
    });

    return {
      requests,
      loaded
    };


  },
})
</script>
