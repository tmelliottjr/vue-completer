<template>
  <li
    :aria-selected="shouldHighlight ? 'true' : 'false'"
    :class="{
      'autocomplete__suggestion-results-item--highlighted': shouldHighlight,
    }"
    :id="`autocomplete__suggestion-results-item--${$vnode.key}`"
    @click="onClick"
    @mousedown="onMouseDown"
    class="autocomplete__suggestion-results-item"
    role="option"
    tabindex="-1"
  >
    <slot> </slot>
  </li>
</template>

<script>
export default {
  name: 'vue-auto-complete-suggestion-item',
  props: {
    shouldHighlight: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onMouseDown(e) {
      // Ensure's that the blur event does not fire on the input when a suggestion is clicked
      e.preventDefault();
    },
    onClick() {
      this.$emit('select', this.$vnode.key);
    }
  },
};
</script>
