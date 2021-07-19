<template>
  <div class='card' :class="classes">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    cardType: {
      type: String,
      required: false,
      default: 'plain'
    }
  },
  setup(props) {

    const classes = computed(() => {
      const obj = {
        [props.cardType]: true
      };
      return obj;
    });

    return {
      classes
    };
  },
})
</script>


<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  margin: 1.5rem auto;
  max-width: 40rem;

  @media only screen and (max-width: 40em) {
    margin: .2rem auto;
    padding: 0;
  }
}

.card.info {
  background-color: lightgreen;
}

.card.error {
  background-color: lightpink;
}
</style>