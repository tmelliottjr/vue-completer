<template>
  <div>
    <VueCompleter
      :limit="5"
      :selectOnBlur="false"
      namespace="simple"
      :suggestions="suggestions"
      @selectionChange="onSelectionChange"
      ref="autocomplete"
      v-model="query"
    ></VueCompleter>
    <pre v-html="JSON.stringify(selection, null, 4)"></pre>
  </div>
</template>

<script>
import VueCompleter from '@/components/AutoComplete.vue';

export default {
  name: 'Simple',
  components: {
    VueCompleter,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      query: null,
      select: null,
      selection: null,
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
    onSelectionChange(selection) {
      this.selection = selection;
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
    suggestions() {
      if (!this.query) {
        return [];
      }

      return this.suggestionFilter(this.query);
    },
  },
};
</script>
<style>
.simple-autocomplete__input {
  border: 1px solid rgb(233, 233, 233);
  box-sizing: border-box;
  font-size: 16px;
  height: 35px;
  padding: 0 0 0 5px;
  width: 100%;
}

.simple-autocomplete__container {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 300px;
}

.simple-autocomplete__suggestion-results-container {
  width: 100%;
  position: relative;
}

.simple-autocomplete__suggestion-results-list {
  background-color: rgb(83, 94, 107);
  border: 1px solid#e4e4e4;
  box-sizing: border-box;
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
  position: absolute;
  z-index: 999;
}

.simple-autocomplete__suggestion-query-match {
  color: rgb(209, 218, 224);
}

.simple-autocomplete__suggestion-results-item {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 0 0 0 5px;
  min-height: 30px;
  outline: none;
  color: rgb(125, 162, 210);
  padding: 10px;
  background-color: #304354;
  font-size: 14px;
  border-bottom: 1px solid rgb(187, 219, 240);
}

.simple-autocomplete__suggestion-results-item:last-child {
  border-bottom: none;
}

.simple-autocomplete__suggestion-results-item--highlighted {
  background-color: #4b6881;
}

.simple-autocomplete__suggestion-results-item:hover:not(.simple-autocomplete__suggestion-results-item--highlighted) {
  background-color: #4b6881;
}
</style>
