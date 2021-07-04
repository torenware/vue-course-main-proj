<template>
  <the-header />
  <base-container>
    <router-view></router-view>
  </base-container>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import TheHeader from './components/layout/TheHeader.vue'

export default defineComponent({
  components: {
    TheHeader
  },
  setup() {
    const store = useStore();
    store.dispatch('loadStore');
  }
})
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}
</style>
