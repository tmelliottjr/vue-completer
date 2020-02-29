<template>
  <ul class="autocomplete__suggestions">
    <!-- TODO: Add custom rendering -->
    <AutoCompleteSuggestionItem
      :key="index"
      :shouldHighlight="currentIndex === index"
      :suggestion="suggestion"
      :suggestionValue="suggestionValue"
      @select="onSelect"
      v-for="(suggestion, index) in suggestions"
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
  props: ['suggestions', 'currentIndex', 'suggestionValue'],
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
  border: 1px solid#bbc0c4;
}
</style>
