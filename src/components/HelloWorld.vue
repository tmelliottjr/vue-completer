<template>
  <div>
    <pre>{{ selection }}</pre>
    <AutoComplete
      :highlightFirst="true"
      :limit="5"
      :selectOnBlur="true"
      :suggestionFilter="suggestionFilter"
      :suggestionValue="suggestion => suggestion.value"
      @select="onSelect"
      ref="autocomplete"
      v-model="selection"
    ></AutoComplete>
  </div>
</template>

<script>
import AutoComplete from './AutoComplete';
import geodata from '../geodata';

export default {
  name: 'HelloWorld',
  components: {
    AutoComplete,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      lastResult: [],
      selection: null,
      dataset: geodata,
    };
  },
  methods: {
    onSelect(e) {
      console.log(e);
    },
    suggestionFilter(query) {
      let result = this.dataset.filter(suggestion => {
        return (
          query !== '' &&
          suggestion.value.toLowerCase().includes(query.toLowerCase())
        );
      });

      // Emulates default on none.
      if (query && !result.length) {
        return this.lastResult;
      }

      this.lastResult = result;
      return result;
    },
  },
};
</script>
