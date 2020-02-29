<template>
  <div>
    {{ selection }}
    <AutoComplete
      :suggestionFilter="suggestionFilter"
      :limit="5"
      @select="onSelect"
    ></AutoComplete>
  </div>
</template>

<script>
import AutoComplete from './AutoComplete';

export default {
  name: 'HelloWorld',
  components: {
    AutoComplete,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      selection: null,
      dataset: [
        'Alabama',
        'Alaska',
        'American Samoa',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'District of Columbia',
        'Federated States of Micronesia',
        'Florida',
        'Georgia',
        'Guam',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Marshall Islands',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Northern Mariana Islands',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Palau',
        'Pennsylvania',
        'Puerto Rico',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virgin Island',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
      ],
    };
  },
  methods: {
    onSelect(e) {
      this.selection = e;
    },
    suggestionFilter(query) {
      return this.dataset.filter(suggestion => {
        return (
          query !== '' && suggestion.toLowerCase().includes(query.toLowerCase())
        );
      });
    },
  },
};
</script>
