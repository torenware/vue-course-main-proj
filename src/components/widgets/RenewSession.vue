<template>
  <base-dialog title="Continue Session?">
    <template #default>
      <p>The clock is running out on your session. Time remaining: {{ sessionEnding }}</p>
      <p>
         Continue working?
      </p>
    </template>
    <template #actions>
      <base-button  @click="renewSession" :default="true">Continue</base-button>
      <base-button mode="outline" @click="$emit('close')">Cancel</base-button>
    </template>
  </base-dialog>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import BaseDialog from '../UI/BaseDialog.vue';
import { useStore } from '@/store';

export default defineComponent({
  components: {
    BaseDialog
  },
  emits: ['close'],
  setup(props, context) {
    const store = useStore();

    function renewSession() {
      store.dispatch('renew');
      context.emit('close');
    }

    const sessionEnding = computed(() => {
      return store.getters.countdownString;
    });

    return {
      renewSession,
      sessionEnding
    };
  },
})
</script>
