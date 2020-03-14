
# VueCompleter

A Vue Autocomplete component with accessibility and simplicity in mind.

## Installation

```bash
npm install vue-completer
```

or

```bash
yarn add vue-completer
```

## Usage

```javascript
<template>
    <AutoComplete
      :limit="5"
      :suggestions="suggestions"
      @selectionChange="onSelectionChange"
      v-model="query"
    ></AutoComplete>
</template>

<script>
  import { AutoComplete } from 'vue-completer';

  export default {
    ...
    components: {
        AutoComplete
    }
    ...
  };
</script>
```

## Examples

- [Simple Suggestions](https://codesandbox.io/s/simplesuggestions-drp7z)
- [Complex Suggestions w/ Custom Slot](https://codesandbox.io/s/vue-completer-custom-slot-e4kct)

## Props

| Property          | Description |Type      | Required | Default |
| -------------     |-------------|----------|----------|---------|
| `suggestions`     | An array of suggestions to be rendered. This can be as simple as an array of string values or deeply nested objects.    | Array    | Yes      |
| `suggestionValue` | Used to determine the value to be rendered in the suggestion list. *_Required for non-string suggestions. i.e. an array of suggestion objects._    | Function | No*       |  
| `limit`           | The number of suggestions to render.      | Number   | No       | 5
| `noCycle`         | Used to stop at the top & bottom suggestions when using the up & down arrow keys.     | Boolean  | No       | False
| `selectOnBlur`    | Used to automatically select the highlighted suggestion on blur. | Boolean  | No       | True
| `highlightFirst`  | Used to automatically highlight the first suggestion when the suggestion list is rendered. | Boolean  | No       | True

### suggestions

The supplied suggestions array can be as simple as an array of strings or more complex as in an array of objects. When using objects, use the [suggestionValue](#suggestionvalue) prop to tell VueCompleter how to render the suggestions.

**Simple:**

```javascript
dataset: [
  'Jacob',
  'Joanne',
  'John',
  'Jonathon',
  'Logan',
  'Thomas',
  'Tim',
  'Tom',
],
```

**Complex:**

```javascript
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
]
```

### suggestionValue

When using a more complex suggestion, like an object, VueCompleter needs to know how to render suggestions. For example, using the complex example above:

```javascript
<template>
    <AutoComplete
      :suggestions="suggestions"
      :suggestionValue="getSuggestionValue"
      @selectionChange="onSelectionChange"
      v-model="query"
    ></AutoComplete>
</template>

<script>
export default {
  ...
  methods: {
    getSuggestionValue(suggestion) {
      return suggestion.value;
    },
  }
}
</script>
```

## Slots

For more control over the rendered suggestions, the `suggestion` [scoped slot](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) is available. This allows the use of any markup or component you want.

```javascript
<AutoComplete
  :suggestions="suggestions"
  @selectionChange="onSelectionChange"
  v-model="query"
>
  <template v-slot="{ suggestion }">
    <EmployeeSuggestion :suggestion="suggestion" />
  </template>
</AutoComplete>
```

EmployeeSuggestion.vue

```javascript
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
```

## Events
|Event|Description|
|-----|-----------|
|`selectionChange`| Fired when the suggestion selection has been changed. i.e. A user manually makes a selection from the list. This event is also fired once on input if a selection has been previously.

## Classes & Styling
VueCompleter does not provide **ANY** styles out of the box. See the [examples](#examples) for ideas.

|Class|Description|
|-----|-----------|
|`autocomplete__container`|Top level container|
|`autocomplete__input`|The input element|
|`autocomplete__suggestion-results-container`|Suggestion list container|
|`autocomplete__suggestion-results-list`|Suggestion list|
|`autocomplete__suggestion-results-item`|Suggestion list item|
|`autocomplete__suggestion-results-item--highlighted`|Currently highlighted suggestion list item|
|`autocomplete__suggestion-query-match`|Matched input within the rendered suggestion list item|

## Additional Information

Any additional events or attributes are inherited directly by the native input element.

VueCompleter supports the use of v-model. Note: when a selection is made, in addition to the `selectionChange` event an `input` event is also fired to update the value of v-model using the appropriate suggestion value.
