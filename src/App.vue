<template>
  <div>
    <pre>{{ query }}</pre>
    <pre>{{ { selection } }}</pre>
    <pre>{{ { selectionChange } }}</pre>

    <AutoComplete
      :highlightFirst="false"
      :limit="5"
      @blur="onBlur"
      @focus="onFocus"
      id="what i want"
      :selectOnBlur="true"
      :suggestions="suggestions"
      ref="autocomplete"
      @selectionChange="onSelectionChange"
      v-model="query"
    ></AutoComplete>
  </div>
</template>

<script>
import AutoComplete from '@/components/AutoComplete';

export default {
  name: 'App',
  components: {
    AutoComplete,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      query: 'Thomas',
      select: null,
      selectionChange: null,
      lastResult: [],
      dataset: [
        'Jacob',
        'Joanne',
        'John',
        'Jonathon',
        'Logan',
        'Thomas',
        'Tim',
        'Tom',
      ],
    };
  },
  methods: {
    onFocus() {
      // this.$refs.autocomplete.input.setSel();
    },
    onBlur(e) {
      console.log(e);
    },
    onSelectionChange(e) {
      this.selectionChange = e;
      console.log('here');
    },
    suggestionFilter(query) {
      if (!query) {
        this.lastResult = [];
        return;
      }

      const result = this.dataset.filter(suggestion => {
        return suggestion.toLowerCase().includes(query.toLowerCase());
      });

      if (!result.length) {
        return this.lastResult;
      }

      this.lastResult = result;
      return result;
    },
  },
  computed: {
    /**
     * Filter the user's using the provided suggestion filter functionx
     */
    suggestions() {
      if (!this.query) {
        return [];
      }

      const suggestions = this.suggestionFilter(this.query);

      return Array.isArray(suggestions) && suggestions.length
        ? suggestions.slice(0, this.limit)
        : [];
    },
  },
};
</script>
<style>
body {
  font-family: sans-serif;
}
.autocomplete__input {
  border: 1px solid rgb(233, 233, 233);
  box-sizing: border-box;
  font-size: 16px;
  height: 35px;
  padding: 0 0 0 5px;
  width: 100%;
  z-index: 999;
}

.autocomplete__container {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 300px;
}

.autocomplete__suggestion-results-container {
  width: 100%;
}

.autocomplete__suggestion-results-list {
  border: 1px solid#bbc0c4;
  box-sizing: border-box;
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

.autocomplete__suggestion-query-match {
  font-weight: bold;
}

.autocomplete__suggestion-results-item {
  align-items: center;
  cursor: pointer;
  display: flex;
  padding: 0 0 0 5px;
  min-height: 30px;
  outline: none;
  white-space: pre;
}

.autocomplete__suggestion-results-item--highlighted {
  background-color: #71879c;
  color: rgb(246, 250, 255);
}

.autocomplete__suggestion-results-item:hover:not(.autocomplete__suggestion-results-item--highlighted) {
  background-color: #bec7d0;
  color: #333;
}
</style>
