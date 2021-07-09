<template>
  <li>
    <h3>{{fullName}}</h3>
    <h4>${{hourlyRate.toFixed(2)}} / hour</h4>
    <div>
      <base-badge v-for="area in areas" :key="area" :title="area" :type="area"/>
    </div>
    <div class="actions">
      <base-button :link="true" :to="coachContactLink" mode="outline">Contact Coach</base-button>
      <base-button :link="true" :to="coachLink"  mode="outline">Coach Details</base-button>

    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import BaseButton from '../UI/BaseButton.vue';

export default defineComponent({
  components: { BaseButton },
  props: {
    id: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName:  {
      type: String,
      required: true,
    },
    areas:  {
      type: Array as () => string[],
      required: true,
    },
    description:  {
      type: String,
      required: true,
    },
    hourlyRate:  {
      type: Number,
      required: true,
    },
  },
  setup(props) {

    const fullName = computed(() => {
      return `${props.firstName} ${props.lastName}`
    });

    const coachLink = computed(() => {
      const { fullPath } = useRoute();
      return `${fullPath}/${props.id}`;
    });

    const coachContactLink = computed(() => {
      const { fullPath } = useRoute();
      return `${fullPath}/${props.id}/contact`;
    });

    return {
      fullName,
      coachLink,
      coachContactLink,

    };
  },
})
</script>

<style scoped>
/**
.actions a, span {
  display: inline-block;
  border-style: double;
  background-color: blue;
  color: white;
  margin: 0 5px;
  padding: 5px 8px;
  text-decoration: none;
  border-radius: 10px;
}
 */

li {
  margin: 1rem 0;
  border: 1px solid #424242;
  border-radius: 12px;
  padding: 1rem;
  list-style: none;
}

h3 {
  font-size: 1.5rem;
}

h3,
h4 {
  margin: 0.5rem 0;
}

div {
  margin: 0.5rem 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
