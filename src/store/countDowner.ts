import { ref, Ref } from 'vue';

// a singleton used to share a ref between vuex and components.
const theCountDown: Ref<number> = ref(0);
export default theCountDown;
