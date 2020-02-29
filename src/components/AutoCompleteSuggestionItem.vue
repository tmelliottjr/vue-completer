<template>
  <li
    :class="{ 'autocomplete__suggestion-item--highlighted': shouldHighlight }"
    @click="$emit('select', $vnode.key)"
    class="autocomplete__suggestion-item"
    data-ac-ignore-blur
    tabindex="-1"
  >
    {{ suggestion }}
  </li>
</template>

<script>
export default {
  name: 'auto-complete-suggestion-item',
  props: ['suggestion', 'shouldHighlight'],
};
</script>

<style>
.autocomplete__suggestion-item {
  cursor: pointer;
  outline: none;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.autocomplete__suggestion-item--highlighted {
  background-color: #06c;
  color: white;
}

.autocomplete__suggestion-item:hover:not(.autocomplete__suggestion-item--highlighted) {
  background-color: lightgrey;
  color: #333;
}
</style>
