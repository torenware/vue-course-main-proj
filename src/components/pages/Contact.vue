<template>
  <base-container>
  <form>
    <div class="form-control">
      <label for="title"></label>
      <input id="title" type="text">
    </div>
    <div class="form-control">
      <label for="message"></label>
      <textarea rows="5" placeholder="Your message here"></textarea>
    </div>
    <button>Send</button>
  </form>
  
  </base-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {

    const idParam = computed(() => {
      const {params} = useRoute();
      return params.id;
    })

    onMounted(() => {
      const stuff = useRoute();
      console.log(stuff);
    });

    return {
      idParam
    }
  },
})
</script>
