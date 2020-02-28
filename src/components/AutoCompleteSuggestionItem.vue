<template>
  <li
    :aria-selected="shouldHighlight ? 'true' : 'false'"
    :class="{
      'autocomplete__suggestion-results-item--highlighted': shouldHighlight,
    }"
    :id="`autocomplete__suggestion-results-item--${$vnode.key}`"
    @click="$emit('select', $vnode.key)"
    class="autocomplete__suggestion-results-item"
    data-ac-ignore-blur
    role="option"
    tabindex="-1"
    v-html="suggestion"
  ></li>
</template>

<script>
export default {
  name: 'auto-complete-suggestion-item',
  props: {
    suggestion: {
      type: String,
      require: true,
    },
    shouldHighlight: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
