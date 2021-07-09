<template>
  <ul v-if="coach">
    <coach-item
    :id="coach.id"
    :first-name="coach.firstName"
    :last-name="coach.lastName"
    :description="coach.description"
    :areas="coach.areas"
    :hourly-rate="coach.hourlyRate"

    :displayButtons="false"
    :displayDescription="true"
  />
</ul>

<base-card v-if="!loading">
  <h2>Your Current Requests</h2>
  <ul v-if="requests.length">
    <li v-for="request in requests" :key="request.id">
      <table>
        <tbody>
      <tr class="request-line">
        <td><label><span>Sent:</span></label></td> <td><p>{{ new Date(parseInt(request.id)).toLocaleString() }}</p></td>
      </tr>
      <tr class="request-line">
        <td><label><span>Subject:</span></label></td> <td><p>{{ request.title }}</p></td>
      </tr>
      <tr class="request-line">
        <td><label><span>From:</span></label></td> <td><p>{{ request.email }}</p></td>
      </tr>
      <tr class="request-line">
        <td><label><span>Message:</span></label></td> <td><p>{{ request.message }}</p></td>
      </tr>
      </tbody>
      </table>
    </li>
  </ul>
  <p v-else>
    No requests, dude. So sorry!
  </p>
</base-card>
<p v-else><base-spinner /></p>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import {useStore} from '@/store';
import { useRouter } from 'vue-router';
import CoachItem from '../coaches/CoachItem.vue';
import { Request } from '@/types';

// eslint-disable-next-line no-unused-vars
const LS_UNSET = 0;
const LS_LOADING = 1;
// eslint-disable-next-line no-unused-vars
const LS_LOADED = 2;

export default defineComponent({
  components: {
    CoachItem
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const loading = computed(() => {
      console.log('LS', store.getters.requestsLoaded);
      return store.getters.requestsLoaded === LS_LOADING;
    });
    store.dispatch('requests/loadRequests');

    const coach = computed(() => {
      return store.getters.currentCoach;
    });
    const requests = computed(() => {
      const rawRequests =  store.getters['requests/allRequests'] as Request[];
      const sortRoutine = (r1: Request, r2: Request) => {
        // as it turns out, the IDs are generated from microseconds.
        const r1_key = r1.id!;
        const r2_key = r2.id!;
        if (r1_key > r2_key) {
          return -1;
        }
        else if (r1_key < r2_key) {
          return 1;
        }
        else {
          return 0;
        }
      };
      return rawRequests.sort(sortRoutine);
    });

    watch(coach, now => {
      if (!now) {
        store.dispatch('setFlash', {
          msg: "Logged due to session expiring"
        });
        router.push('/');
      }
    });

    return {
      coach,
      requests,
      loading
    };


  },
})
</script>

<style lang="scss" scoped>
ul {
  max-width: 40rem;
  margin: 0 auto;
  padding-left: 0;

  li {
    list-style: none;
  }
}

table {
  border-top: solid;
  width: 95%;
  padding-bottom: 1rem;
  padding-top: 1rem;

  tr {
    margin-bottom: 1rem;
  }
}

td {
   vertical-align: top;
   &:first-of-type {
     width: 6rem;
   }

    p {
      margin-block-start: 0;
      margin-bottom: auto;
    }

  label {
    display: inline-block;
    width: 4.5rem;
    font-weight: bold;
    padding: auto 0;
    text-align: right;
  }

}

</style>
