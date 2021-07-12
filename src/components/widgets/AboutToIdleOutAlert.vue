<template>
  <base-dialog title="Still There?">
    <template #default>
      <p>You've been away from this page for a while. Logging you out in 60 seconds.</p>
      <p>
         Continue working?
      </p>
    </template>
    <template #actions>
      <base-button mode="outline" @click="$emit('close')">Close</base-button>
    </template>
  </base-dialog>
</template>

<script lang="ts">
import { defineComponent} from 'vue';
import BaseDialog from '../UI/BaseDialog.vue';

export default defineComponent({
  components: {
    BaseDialog
  },
  emits: ['close'],
  setup() {
    return {
    };
  },
})
</script>
