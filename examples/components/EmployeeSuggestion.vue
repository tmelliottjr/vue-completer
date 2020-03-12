<template functional>
  <div class="employee-suggestion">
    <div class="employee-suggestion--left">
      <div class="employee-name">
        {{ props.suggestion.value }}
      </div>
      <div class="employee-title">{{ props.suggestion.position.title }}</div>
    </div>
    <div class="employee-suggestion--right">
      <div class="employee-department">
        {{ props.suggestion.position.department }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['suggestion'],
};
</script>

<style></style>
