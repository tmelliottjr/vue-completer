<template>
  <div>
    <Simple />
    <Complex />
  </div>
</template>
<script>
import Simple from './components/Simple.vue';
import Complex from './components/Complex.vue';

export default {
  name: 'App',
  components: {
    Simple,
    Complex,
  },
};
</script>
<style>
body {
  font-family: sans-serif;
}
.autocomplete__input {
  border: 1px solid rgb(233, 233, 233);
  box-sizing: border-box;
  font-size: 16px;
  height: 35px;
  padding: 0 0 0 5px;
  width: 100%;
}

.autocomplete__container {
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 300px;
}

.autocomplete__suggestion-results-container {
  width: 100%;
  position: relative;
}

.autocomplete__suggestion-results-list {
  background-color: rgb(83, 94, 107);
  border: 1px solid#e4e4e4;
  box-sizing: border-box;
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
  position: absolute;
  z-index: 999;
}

.autocomplete__suggestion-query-match {
  font-weight: bold;
}

.autocomplete__suggestion-results-item {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 0 0 0 5px;
  min-height: 30px;
  outline: none;
  color: rgb(125, 162, 210);
  padding: 10px;
  background-color: #304354;
  font-size: 14px;
  border-bottom: 1px solid rgb(187, 219, 240);
}
.autocomplete__suggestion-results-item:last-child {
  border-bottom: none;
}
.autocomplete__suggestion-results-item--highlighted {
  background-color: #4b6881;
}

.autocomplete__suggestion-results-item:hover:not(.autocomplete__suggestion-results-item--highlighted) {
  background-color: #4b6881;
}

.employee-suggestion--left {
  height: 35px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.employee-suggestion {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 100%;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
}

.employee-name {
  font-size: 18px;
  color: #64d8be;
}
.employee-title {
  font-size: 12px;
  /* font-style: italic; */
  color: rgb(133, 164, 185);
}
</style>
