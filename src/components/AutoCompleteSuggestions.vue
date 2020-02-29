<template>
  <ul class="autocomplete__suggestions">
    <!-- TODO: Add custom rendering -->
    <AutoCompleteSuggestionItem
      :shouldHighlight="currentIndex === key"
      :key="key"
      :suggestion="suggestion"
      @select="onSelect"
      v-for="(suggestion, key) in suggestions"
    >
    </AutoCompleteSuggestionItem>
  </ul>
</template>

<script>
import AutoCompleteSuggestionItem from './AutoCompleteSuggestionItem';
export default {
  name: 'auto-complete-suggestions',
  components: {
    AutoCompleteSuggestionItem,
  },
  props: ['suggestions', 'currentIndex'],
  methods: {
    onSelect(e) {
      this.$emit('select', e);
    },
  },
};
</script>

<style>
.autocomplete__suggestions {
  list-style-type: none;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
