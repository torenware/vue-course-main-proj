<template>
  <button v-if="!link" :class="btnClasses" ref="button">
    <slot>
    </slot>
  </button>
  <router-link v-else :to="to" :class="btnClasses" ref="button">
    <slot>
    </slot>
  </router-link>


</template>


<script lang="ts">
import { defineComponent, ref, Ref, computed, onMounted } from 'vue';

type StylingMode = "flat" | "outline" | null;

export default defineComponent({
  props: {
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    to: {
      type: String,
      required: false,
      default: ''
    },
    mode: {
      // styling mode
      type: String as () => StylingMode,
      required: false,
      default: ''
    },
    // If set, this button gets focus.
    default: {
      type: Boolean,
      required: false
    }
  },
  setup(props) {

    const button: Ref<HTMLElement | null> = ref(null);
    const btnClasses = computed(() => {
      if (props.mode) {
        return {
          [props.mode]: true
        };
      }
      else {
        return {};
      }
    });

    onMounted(() => {
      if (props.default) {
        button.value?.focus();
      }
    });

    return {
      btnClasses,
      button
    };

  },
})
</script>


<style scoped>
button,
a {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  font: inherit;
  font-size: 16px;
  background-color: #3a0061;
  border: 1px solid #3a0061;
  color: white;
  cursor: pointer;
  border-radius: 30px;
  margin-right: 0.5rem;
  display: inline-block;


  @media only screen and (max-width: 40em) {
    font-size: 12px;
    padding: 0.5rem .8rem;
  }

}

a:hover,
a:active,
button:hover,
button:active {
  background-color: lightblue;
  color: darkblue;
  border-color: lightblue;
}

.flat {
  background-color: transparent;
  color: #3a0061;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #270041;
  color: #270041;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  background-color: #edd2ff;
}
</style>