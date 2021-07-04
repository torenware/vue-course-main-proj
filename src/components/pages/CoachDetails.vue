<template>
  <section>
    <base-card>
      <h2>{{ fullName }}</h2>
      <h3>${{ coach.hourlyRate.toFixed(2)}} / hour</h3>
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
      <div class="badges">
        <base-badge v-for="area in coach.areas" :key="area" :title="area" :type="area"/>
    </div>
      <p>{{coach.description}}</p>
    </base-card>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute} from 'vue-router';
import { useStore } from '@/store';

export default defineComponent({
  setup() {
    const route = useRoute();
    const contactLink = computed(() => {
      return `/coaches/${route.params.id}/contact`;
    });

    const coach = computed(() => {
      const store = useStore();
      const id = route.params.id;
      return store.getters.coachById(id);
    });

    const fullName = computed(() => {
      const store = useStore();
      const id = route.params.id;
      return store.getters.fullName(id);
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
      fullName
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
