<template>
  <form>
    <input type="search" @input="search"
          :value="searchTerm" :placeholder="widgetPlaceholder" />
  </form>
</template>

<script>
export default {
  emits: ['search'],
  props: {
    placeholder: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      searchTerm: ''
    }
  },
  methods: {
    search(event) {
      this.$emit('search', event.target.value);
    },
  },
  computed: {
    widgetPlaceholder() {
      if (this.placeholder) {
        return this.placeholder;
      }
      else {
        return "Filter items";
      }
    }
  }
};
</script>

<style scoped>
input {
  font: inherit;
  width: 100%;
  display: block;
  padding: 0.15rem;
  padding-left: 1rem;
  border: 1px solid #ccc;
  height: 2rem;
}

input:focus {
  outline: none;
  border-color: #00006b;
  background-color: #eeeeff;
}
</style>