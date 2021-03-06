<template>
  <div>
    <VueCompleter
      :limit="5"
      :suggestions="suggestions"
      @selectionChange="onSelectionChange"
      :getSuggestionValue="selection => selection.value"
      ref="autocomplete"
      :selectOnBlur="false"
      :highlightFirstSuggestion="false"
      :highlightCycle="false"
      v-model="query"
    >
    </VueCompleter>
    <pre v-html="JSON.stringify(selection, null, 4)"></pre>
  </div>
</template>

<script>
import VueCompleter from '@/components/AutoComplete.vue';

export default {
  name: 'Complex',
  components: {
    VueCompleter,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      query: 'Ja',
      select: null,
      selection: null,
      lastResult: [],
      currentHighlight: null,
      dataset: [
        {
          code: '93473',
          value: 'Jacob',
          position: {
            title: 'Director',
            department: 'Engineering',
          },
        },
        {
          code: '23674',
          value: 'Janet',
          position: {
            title: 'Senior Software Engineer',
            department: 'Engineering',
          },
        },
        {
          code: '68684',
          value: 'James',
          position: {
            title: 'Software Engineer',
            department: 'Engineering',
          },
        },
        {
          code: '83565',
          value: 'John',
          position: {
            title: 'Financial Analyst',
            department: 'Finance',
          },
        },
        {
          code: '93756',
          value: 'Jonathon',
          position: {
            title: 'CFO',
            department: 'Finance',
          },
        },
        {
          code: '63453',
          value: 'Jerry',
          position: {
            title: 'DevOps Engineer',
            department: 'Information Technology',
          },
        },
        {
          code: '88156',
          value: 'Tom',
          position: {
            title: 'Systems Administrator',
            department: 'Information Technology',
          },
        },
        {
          code: '54363',
          value: 'Logan',
          position: {
            title: 'Assistant Manager',
            department: 'Engineering',
          },
        },
        {
          code: '97832',
          value: 'Larry',
          position: {
            title: 'SEO Specialist',
            department: 'Marketing',
          },
        },
      ],
    };
  },
  methods: {
    getSuggestionValue(suggestion) {
      return suggestion.value;
    },
    onSelectionChange(selection) {
      this.selection = selection;
    },
    suggestionFilter(query) {
      // lastResult is used to demonstrate mainting the list of previous suggestions
      // when the current query doesn't return any results.
      if (!query) {
        this.lastResult = [];
        return;
      }

      const result = this.dataset.filter(suggestion => {
        return suggestion.value.toLowerCase().includes(query.toLowerCase());
      });
      result.sort((a, b) => {
        if (a.value > b.value) {
          return 1;
        }

        if (a.value < b.value) {
          return -1;
        }

        return 0;
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
