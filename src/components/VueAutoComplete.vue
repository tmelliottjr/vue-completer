<template>
  <div class="autocomplete__container">
    <input
      :aria-activedescendant="
        suggestionsShouldShow
          ? `autocomplete__suggestion-results-item--${currentIndex}`
          : null
      "
      :aria-expanded="suggestionsShouldShow ? 'true' : 'false'"
      :value="query"
      @blur="onBlur"
      @focus="onFocus"
      @input="onInput"
      @keydown="onKeyDown"
      aria-autocomplete="both"
      aria-owns="autocomplete__suggestion-results"
      autocomplete="off"
      class="autocomplete__input"
      ref="input"
      type="text"
      v-bind="$attrs"
      v-on="inputListeners"
    />
    <div
      class="autocomplete__suggestion-results-container"
      id="autocomplete__suggestion-results"
      v-if="suggestionsShouldShow"
    >
      <ul class="autocomplete__suggestion-results-list" role="listbox">
        <VueAutoCompleteSuggestionItem
          :key="index"
          :shouldHighlight="currentIndex === index"
          @select="onSelect"
          v-for="(suggestion, index) in limitedSuggestions"
        >
          <!-- suggestion slot was not provided, use defaults -->
          <span
            v-html="formattedSuggestion(suggestion)"
            v-if="!$scopedSlots.default"
          ></span>
          <!-- suggestion slot was provided -->
          <slot v-else v-bind:suggestion="suggestion" />
        </VueAutoCompleteSuggestionItem>
      </ul>
    </div>
  </div>
</template>

<script>
import VueAutoCompleteSuggestionItem from './VueAutoCompleteSuggestionItem';

export default {
  inheritAttrs: false,
  name: 'vue-auto-complete',
  model: {
    prop: 'query',
  },
  components: {
    VueAutoCompleteSuggestionItem,
  },
  mounted() {
    // Allow easier access to the autocomplete input's ref
    this.input = this.$refs.input;
  },
  props: {
    /**
     * The prop used for v-model
     */
    query: {
      type: String,
      default: null,
    },
    /**
     * When true, selects the current highlighted suggestion on blur
     */
    selectOnBlur: {
      type: Boolean,
      default: true,
    },
    /**
     * When true, automatically highlights the first suggestion
     */
    highlightFirst: {
      type: Boolean,
      default: true,
    },
    /**
     * User supplied suggestions.
     */
    suggestions: {
      type: Array,
      required: true,
    },
    /**
     * User supplied function to determine the suggestion value to display.
     * i.e. An array of suggestion objects: [{ code: 'RI', value: 'Rhode Island' }]
     */
    suggestionValue: {
      type: Function,
      default: suggestion => suggestion,
    },
    /**
     * Number of suggestions to display
     */
    limit: {
      type: Number,
      default: 5,
    },
    /**
     * Should arrows stop at bottom/top suggestion
     */
    noCycle: {
      type: Boolean,
      default: false,
    },
    /**
     * Should show suggestions on initial focus
     */
    suggestionsOnFocus: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      /**
       * The currently highlighted suggestion's index
       */
      currentIndex: null,
      /**
       * The currently selected suggestion
       */
      selection: null,
      /**
       * A reference to the autocomplete input element.
       * This is used to allow easier access from parent components
       */
      input: null,
      /**
       * Used to force hide results. i.e. when a selection is made or the Esc key is hit.
       */
      showResults: false,
    };
  },
  watch: {
    suggestionsShouldShow(shouldShow) {
      // Ensure the appropriate suggestion is highlighted
      this.currentIndex = this.highlightFirst && shouldShow ? 0 : null;
    },
  },
  methods: {
    /**
     * Input event handler
     */
    onInput() {
      // Ensure that the suggestion list is displayed after the user has made a selection,
      // but has started typing in the autocomplete input again
      this.showResults = true;

      // If a selection has previously been made, clear the selection on input.
      // Do not fire on every input event.
      if (this.selection) {
        this.updateSelection(null);
      }
    },
    /**
     * Focus event handler
     */
    onFocus() {
      // When the input is initially focused determine whether
      // or not the suggestion list should be rendered
      this.showResults = this.suggestionsOnFocus;
    },
    /**
     * Blur event handler
     */
    onBlur() {
      if (this.selectOnBlur && this.suggestionsShouldShow) {
        this.processSelection(this.currentIndex);
      }

      this.showResults = false;
    },
    /**
     * KeyDown event handler
     */
    onKeyDown(e) {
      const key = e.which || e.keyCode || 0;
      /**
       * 9:  Tab
       * 13: Enter
       * 27: Esc
       * 38: Arrow Up
       * 40: Arrow Down
       */
      switch (key) {
        case 40:
          e.preventDefault();
          this.showResults = true;
          this.navigateSuggestions('down');
          break;
        case 38: {
          e.preventDefault();
          this.navigateSuggestions('up');
          break;
        }
        case 9: {
          // If selectOnBlur is true, prevent  selection on tab from also firing
          if (!this.selectOnBlur) {
            this.processSelection(this.currentIndex);
          }
          break;
        }
        case 13: {
          // Only process the selection if suggestions are currently shown.
          if (this.suggestionsShouldShow) {
            this.processSelection(this.currentIndex);
          }
          break;
        }
        case 27: {
          this.showResults = false;
          break;
        }
      }
    },
    /**
     * Select event handler
     */
    onSelect(selectionIndex) {
      this.processSelection(selectionIndex);
    },
    /**
     * Updates the current selection and emits 'selectionChange' to update v-model.
     * Fires when a selection is made or input changes.
     *
     * @param {Number} selectionIndex The current selection's index
     */
    updateSelection(selectionIndex) {
      this.selection = this.suggestions[selectionIndex] || null;

      const suggestionValue = this.selection
        ? this.suggestionValue(this.selection)
        : null;

      this.$emit('selectionChange', this.selection);

      // For completeness, when a selection is made also update v-model
      this.$emit('input', suggestionValue);
    },
    /**
     * Processes the user's selection.
     * onBlur, tab, enter, and click trigger this functionality.
     *
     * @param {Number} selectionIndex The current selection's index
     */
    processSelection(selectionIndex) {
      if (selectionIndex === null) {
        return;
      }

      this.updateSelection(selectionIndex);

      // Update the input's value with the current selection's value
      this.setQuery(this.suggestionValue(this.selection));

      // If the user has made a selection, this will hide the suggestions box
      this.showResults = false;
    },
    /**
     * Handle traversing the suggestion list on arrow 'up' | 'down'.
     *
     * @param {String} direction The direction to traverse the suggestion list in
     */
    navigateSuggestions(direction) {
      if (!this.suggestionsShouldShow) {
        return;
      }

      const upperLimit = this.limitedSuggestions.length - 1;
      const lowerLimit = 0;

      const step = direction === 'up' ? -1 : 1;

      // Nothing is currently highlighted
      if (this.currentIndex === null) {
        this.currentIndex = direction === 'down' ? lowerLimit : upperLimit;
        return;
      }

      // Top of suggestion list
      const reachedLowerLimit =
        this.currentIndex === lowerLimit && direction === 'up';

      // Bottom of suggestion list
      const reachedUpperLimit =
        this.currentIndex === upperLimit && direction === 'down';

      if ((reachedLowerLimit || reachedUpperLimit) && this.noCycle) {
        return;
      }

      if (reachedLowerLimit) {
        this.currentIndex = upperLimit;
        return;
      }

      if (reachedUpperLimit) {
        this.currentIndex = lowerLimit;
        return;
      }

      this.currentIndex += step;
    },
    /**
     * Adds span wrap around search string
     *
     * @param {string} needle Search query
     * @param {string} haystack String to search
     * @returns {string} The full string including span wrap
     */
    highlightQueryString(needle, haystack) {
      const searchString = this.escapeRegExp(needle);
      try {
        const re = new RegExp(searchString.trim(), 'sgi');
        return haystack.replace(re, match => {
          return `<span class="autocomplete__suggestion-query-match">${match}</span>`;
        });
      } catch (e) {
        return haystack;
      }
    },
    /**
     * Escape regex reserved special characters
     *
     * @param {string} string string to escape
     * @returns {string} The RegExp escaped query string
     */
    escapeRegExp(string) {
      return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    },
    /**
     * Formats the suggestion to be rendered
     *
     * @param {mixed} suggestion The suggestion to highlight
     * @returns {mixed} The highlighted suggestion
     */
    formattedSuggestion(suggestion) {
      return this.highlightQueryString(
        this.query,
        this.suggestionValue(suggestion),
      );
    },
    /**
     * Helper to emit input event to update v-model
     *
     * @param {string} value The value of the event
     */
    setQuery(value) {
      this.$emit('input', value);
    },
  },
  computed: {
    /**
     * Allow listeners to be added to the input element.
     *
     * @returns {object} An object of listeners to apply to the input element
     */
    inputListeners() {
      const vm = this;
      return {
        ...this.$listeners,
        /**
         * Don't do anything native for input, allowing v-model to work seemlessly.
         *
         */
        input(event) {
          vm.setQuery(event.target.value);
        },
      };
    },
    /**
     * Determine's whether or not the suggestions list should be displayed.
     *
     * @returns {boolean} Suggestions should show
     */
    suggestionsShouldShow() {
      return (
        this.query &&
        this.query.trim().length > 0 &&
        this.limitedSuggestions.length > 0 &&
        this.showResults
      );
    },
    /**
     * Limit's the suggestions to be rendered. This is merely a useful helper,
     * The parent component could also limit the suggestions prop themselves if wanted.
     *
     * @returns {array} The suggestion list to be rendered
     */
    limitedSuggestions() {
      return this.suggestions.slice(0, this.limit);
    },
  },
};
</script>
