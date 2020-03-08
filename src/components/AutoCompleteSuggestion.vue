<template>
  <li
    :aria-selected="shouldHighlight ? 'true' : 'false'"
    :class="[{ [highlightClass]: shouldHighlight }, suggestionClass]"
    :id="`${suggestionId}${$vnode.key}`"
    @click="onClick"
    @mousedown="onMouseDown"
    role="option"
    tabindex="-1"
  >
    <slot> </slot>
  </li>
</template>

<script>
export default {
  name: 'vue-auto-complete-suggestion',
  props: {
    shouldHighlight: {
      type: Boolean,
      default: false,
    },
    highlightClass: {
      type: String,
      required: true,
    },
    suggestionClass: {
      type: String,
      required: true,
    },
    suggestionId: {
      type: String,
      required: true,
    },
  },
  methods: {
    onMouseDown(e) {
      // Ensure's that the blur event does not fire on the input when a suggestion is clicked
      e.preventDefault();
    },
    onClick() {
      this.$emit('select', this.$vnode.key);
    },
  },
};
</script>
