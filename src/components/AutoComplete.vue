<template>
  <div :class="selectors.container">
    <slot
      name="input"
      :inputAttrs="inputAttrs"
      :inputListeners="inputListeners"
    >
      <input v-bind="{ ...$attrs, ...inputAttrs }" v-on="inputListeners" />
    </slot>
    <div
      :class="selectors.resultsContainer"
      :id="selectors.resultsContainerId"
      v-if="suggestionsShouldShow"
    >
      <ul :class="selectors.resultsList" role="listbox">
        <AutoCompleteSuggestion
          :key="index"
          :shouldHighlight="currentIndex === index"
          :suggestionId="selectors.resultItemId"
          :suggestionClass="selectors.resultItem"
          :highlightClass="selectors.highlightedResultItem"
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
        </AutoCompleteSuggestion>
      </ul>
    </div>
  </div>
</template>

<script>
import AutoCompleteSuggestion from './AutoCompleteSuggestion';
import { getNamespacedSelectors } from '../util';

export default {
  inheritAttrs: false,
  name: 'vue-auto-complete',
  model: {
    prop: 'query',
  },
  components: {
    AutoCompleteSuggestion,
  },
  created() {
    this.selectors = getNamespacedSelectors(this.namespace);
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
    highlightFirstSuggestion: {
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
    getSuggestionValue: {
      type: Function,
      default: (suggestion) => suggestion,
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
    highlightCycle: {
      type: Boolean,
      default: true,
    },
    /**
     * Should show suggestions on initial focus
     */
    suggestionsOnFocus: {
      type: Boolean,
      default: true,
    },
    /**
     * CSS Namespace to use for class/id selectors
     */
    namespace: {
      type: String,
      default: null,
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
      /**
       * CSS Selectors
       */
      selectors: null,

      /**
       * Input Listeners
       */
      listeners: {
        blur: this.onBlur,
        focus: this.onFocus,
        input: this.onInput,
        keydown: this.onKeyDown,
      },
    };
  },
  watch: {
    suggestionsShouldShow(shouldShow) {
      this.currentIndex =
        this.highlightFirstSuggestion && shouldShow ? 0 : null;
    },
  },
  methods: {
    onInput(event) {
      let value;

      // Detect custom input components, such as VueBootstrap's Input
      if (event instanceof Event && 'target' in event) {
        value = event.target.value;
      } else {
        value = event;
      }

      this.setQuery(value);

      this.showResults = true;

      if (this.selection) {
        this.updateSelection(null);
      }

      this.currentIndex = this.highlightFirstSuggestion ? 0 : null;
    },
    onFocus() {
      this.showResults = this.suggestionsOnFocus;
    },
    onBlur() {
      if (this.selectOnBlur && this.suggestionsShouldShow) {
        this.processSelection(this.currentIndex);
      }

      this.showResults = false;
    },
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
          // If selectOnBlur is true, prevent selection on tab from also firing
          if (!this.selectOnBlur) {
            this.processSelection(this.currentIndex);
          }
          break;
        }
        case 13: {
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
    onSelect(selectionIndex) {
      this.processSelection(selectionIndex);
    },
    /**
     * Updates the current selection and emits 'selectionChange' and 'input'.
     *
     * @param {Number} selectionIndex The current selection's index
     */
    updateSelection(selectionIndex) {
      this.selection = this.suggestions[selectionIndex] || null;

      this.$emit('selectionChange', this.selection);
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

      this.setQuery(this.getSuggestionValue(this.selection));

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

      if ((reachedLowerLimit || reachedUpperLimit) && !this.highlightCycle) {
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
        return haystack.replace(re, (match) => {
          return `<span class="${this.selectors.queryMatch}">${match}</span>`;
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
        this.getSuggestionValue(suggestion),
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
      return {
        ...this.$listeners,
        ...this.listeners,
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
    /**
     * Defines attributes used by the input component.
     *
     * @return {object} The attributes to be applied to the input element
     */
    inputAttrs() {
      return {
        'aria-autocomplete': 'both',
        'aria-expanded': this.suggestionsShouldShow ? 'true' : 'false',
        'aria-owns': this.selectors.resultsContainerId,
        autocomplete: 'off',
        class: this.selectors.input,
        ref: 'input',
        type: 'text',
        value: this.query,
      };
    },
  },
};
</script>
