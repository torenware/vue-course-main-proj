<template>
  <h3>Contact Form</h3>
  <base-card>
  <form @submit.prevent="">
    <div class="form-control">
      <label for="title">Subject</label>
      <input id="title" type="text" v-model="subject">
    </div>
    <div class="form-control">
      <label for="message">Message</label>
      <textarea rows="5" cols="40" placeholder="Your message here" v-model="message"></textarea>
    </div>
    <base-button mode="outline">Send</base-button>
  </form>

  </base-card>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {

    const subject = ref('');
    const message = ref('');

    const idParam = computed(() => {
      const {params} = useRoute();
      return params.id;
    })

    const submitContact = () => {

    }

    onMounted(() => {
      const stuff = useRoute();
      console.log(stuff);
    });

    return {
      idParam,
      subject,
      message,
      submitContact
    }
  },
})
</script>

<style scoped>
 label {
   display: block;
 }
 .form-control {
   margin-bottom: 1rem;
   display: flex;
   align-items: flex-start;
 }

 input, textarea {
   margin: 10px 20px;
   flex: 1;
 }


</style>
