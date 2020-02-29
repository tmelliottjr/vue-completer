<template>
  <div class="autocomplete__container">
    <input
      @blur="onBlur"
      @focus="onFocus"
      @input="onInput"
      @keydown="onKeyDown"
      autocomplete="off"
      class="autocomplete__input"
      ref="input"
      type="text"
      v-bind="$attrs"
      v-model="query"
      v-on="$listeners"
    />

    <AutoCompleteSuggestions
      :currentIndex="computedCurrentIndex"
      :suggestionValue="suggestionValue"
      :suggestions="filteredSuggestions"
      @select="onSelect"
      v-show="filteredSuggestions && suggestionsShouldShow"
    />
  </div>
</template>

<script>
import AutoCompleteSuggestions from './AutoCompleteSuggestions';

export default {
  inheritAttrs: false,
  name: 'auto-complete',
  components: {
    AutoCompleteSuggestions,
  },
  mounted() {
    this.input = this.$refs.input;
  },
  model: {
    prop: 'value',
    event: 'selectionChange',
  },
  props: {
    selectOnBlur: {
      type: Boolean,
      default: true,
    },
    highlightFirst: {
      type: Boolean,
      default: true,
    },
    suggestionFilter: {
      type: Function,
      required: true,
    },
    suggestionValue: {
      type: Function,
      default: suggestion => suggestion,
    },
    limit: {
      type: Number,
      default: 10,
    },
    inputProps: {
      type: Object,
      default: () => {},
    },
    inputListeners: {
      type: Object,
      default: () => {},
    },
    value: {},
  },
  data() {
    return {
      input: null,
      currentIndex: null,
      currentSelection: null,
      defaultIndex: 0,
      isFocused: false,
      madeSelection: false,
      query: '',
    };
  },
  methods: {
    onInput() {
      this.madeSelection = false;

      // Enables v-model support, fires when a selection is made or input changes.
      this.$emit('selectionChange', null);
    },
    onFocus() {
      if (this.highlightFirst && this.filteredSuggestions.length) {
        this.currentIndex = 0;
      }
      this.isFocused = true;
    },
    onBlur(e) {
      if (
        e.relatedTarget &&
        typeof e.relatedTarget.dataset.acIgnoreBlur !== 'undefined'
      ) {
        e.preventDefault();
        return;
      }
      // TODO: Move to select handler
      if (this.selectOnBlur) {
        this.onSelect(this.computedCurrentIndex);
      }

      this.currentIndex = null;
      this.isFocused = false;
      this.madeSelection = false;
    },
    onKeyDown(e) {
      // if (!this.query) return;

      /**
       * 40: Arrow Down
       * 38: Arrow Up
       * 9:  Tab
       * 13: Enter
       */
      switch (e.which) {
        // TODO: Move to separate function and use +/- to indication direction
        case 40:
          e.preventDefault();

          if (
            this.currentIndex < this.filteredSuggestions.length - 1 &&
            this.currentIndex !== null
          ) {
            this.currentIndex += 1;
          } else {
            this.currentIndex = 0;
          }
          break;
        case 38: {
          e.preventDefault();

          if (!this.currentIndex) {
            this.currentIndex = this.filteredSuggestions.length - 1;
          } else {
            this.currentIndex -= 1;
          }
          break;
        }
        case 9:
        case 13: {
          if (this.computedCurrentIndex !== null) {
            this.onSelect(this.computedCurrentIndex);
          }
        }
      }
    },
    onSelect(e) {
      if (e === null) {
        return;
      }

      // update to use object key
      this.currentSelection = e;

      // TODO: update to use object value
      const selection = this.filteredSuggestions[e];
      this.query = this.suggestionValue(selection);

      this.madeSelection = true;

      // Wait for UI to update before changing the currentIndex.
      this.$nextTick(() => {
        this.currentIndex = null;
      });

      // Enables v-model support, fires when a selection is made or input changes.
      this.$emit('selectionChange', selection);

      // Fires only when an actual selection is made, i.e. onBlur, click, tab, enter
      this.$emit('select', selection);
    },
  },
  watch: {
    filteredSuggestions(value) {
      if (value && !value.length) {
        this.currentIndex = null;
      }
    },
  },
  computed: {
    suggestionsShouldShow() {
      return this.isFocused && !this.madeSelection && this.query;
    },
    computedCurrentIndex() {
      if (!this.suggestionsShouldShow) {
        return null;
      }
      return this.currentIndex !== null && this.filteredSuggestions.length
        ? this.currentIndex
        : this.filteredSuggestions.length && this.highlightFirst
        ? 0
        : null;
    },
    filteredSuggestions() {
      return this.suggestionFilter(this.query).slice(0, this.limit) || [];
    },
  },
};
</script>

<style>
.autocomplete__input {
  width: 100%;
  height: 35px;
  font-size: 16px;
  box-sizing: border-box;
  border: 1px solid rgb(233, 233, 233);
  z-index: 999;
}

.autocomplete__container {
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
</style>
