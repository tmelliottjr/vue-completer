<template>
  <div>
    Simple Suggestions
    <AutoComplete
      :limit="5"
      :suggestions="suggestions"
      @selectionChange="onSelectionChange"
      ref="autocomplete"
      v-model="query"
    ></AutoComplete>
    <pre v-html="JSON.stringify(selection, null, 4)"></pre>
  </div>
</template>

<script>
import AutoComplete from '@/components/AutoComplete.vue';

export default {
  name: 'Simple',
  components: {
    AutoComplete,
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
