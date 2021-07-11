<template>
  <div v-if="!loaded" >
    <base-spinner />
  </div>
  <div v-else>
  <section>
    <base-card>
      <h2>{{ fullName }}</h2>
      <h3>${{ coach ? coach.hourlyRate.toFixed(2) : ""}} / hour</h3>
    </base-card>
  </section>
  <section>
    <base-card>
      <div class='contact' v-if="isTopLevelPage">
        <header>
          <h3>Get in Touch</h3>
        </header>
        <div  class="btn">
          <base-button :link="true" :to="contactLink">
            Contact This Coach
          </base-button>
        </div>
      </div>
      <router-view />
    </base-card>
  </section>
  <section>
    <base-card>
      <div class="badges" v-if="coach && coach.areas">
        <base-badge v-for="area in coach.areas" :key="area" :title="area" :type="area"/>
    </div>
      <p>{{coach.description}}</p>
    </base-card>
  </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, inject, ref, Ref, onBeforeMount } from 'vue'
import { useRoute, useRouter} from 'vue-router';
import { useStore } from '@/store';

export default defineComponent({
  setup() {
    const loaded: Ref<boolean> = inject('loaded', ref(false));
    const route = useRoute();
    const store = useStore();
    const router = useRouter();

    const contactLink = computed(() => {
      return `/coaches/${route.params.id}/contact`;
    });

    const coach = computed(() => {
      const id = route.params.id;
      if (!loaded.value) {
        return null;
      }
      return store.getters.coachById(id);
    });

    onBeforeMount(() => {
      if (!coach.value) {
        router.push('/');
      }
    });

    const fullName = computed(() => {
      if (!loaded.value) {
        return "";
      }
      const id = route.params.id;
      const rslt = store.getters.coachById(id);
      if (rslt) {
        return `${rslt.firstName} ${rslt.lastName}`;
      }
      return "";
    });

    const isTopLevelPage = computed(() => {
      const path = route.fullPath.split('/');
      const id = route.params.id;
      if (id !== path.pop()) {
        return false;
      }
      return true;
    });

    return {
      contactLink,
      isTopLevelPage,
      coach,
      fullName,
      loaded
    };
  },
})
</script>

<style scoped>
  header {
    color: white;
    margin-bottom: 10px;
  }

  .contact .btn {
    text-align: end;
  }

  .badges {
    display: flex;
    justify-content: center;
  }
</style>
