import { shallowMount, mount } from '@vue/test-utils';
import AutoComplete from '@/components/AutoComplete';

const simpleSuggestions = [
  'Jacob',
  'Joanne',
  'John',
  'Jonathon',
  'Logan',
  'Thomas',
  'Tim',
  'Tom',
];

const simpleSuggestionsFilter = query => {
  if (!query) {
    return [];
  }

  return simpleSuggestions.filter(s => {
    return s.toLowerCase().includes(query.toLowerCase());
  });
};

const complexSuggestions = [
  { code: 'AA', value: 'Jacob' },
  { code: 'BB', value: 'Joanne' },
  { code: 'CC', value: 'John' },
  { code: 'DD', value: 'Jonathon' },
  { code: 'EE', value: 'Logan' },
  { code: 'FF', value: 'Thomas' },
  { code: 'GG', value: 'Tim' },
  { code: 'HH', value: 'Tom' },
];

const complexSuggestionsFilter = query => {
  if (!query) {
    return [];
  }

  return complexSuggestions.filter(s => {
    return s.value.toLowerCase().includes(query.toLowerCase());
  });
};

describe('AutoComplete.vue', () => {
  it('mounts properly', () => {
    const propsData = {
      suggestions: [],
    };
    const wrapper = shallowMount(AutoComplete, { propsData });
    expect(wrapper.find('.autocomplete__container').exists()).toBeTruthy();
  });

  it('renders simple suggestions', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.findAll('.autocomplete__suggestion-results-item').length,
    ).toBe(4);

    expect(
      wrapper.find('#autocomplete__suggestion-results-item--0').text(),
    ).toBe('Jacob');
  });

  it('renders complex suggestions', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
        };
      },
      methods: {
        getSuggestionValue(suggestion) {
          return suggestion.value;
        },
      },
      computed: {
        suggestions() {
          return complexSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :getSuggestionValue="getSuggestionValue" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.findAll('.autocomplete__suggestion-results-item').length,
    ).toBe(4);

    expect(
      wrapper.find('#autocomplete__suggestion-results-item--0').text(),
    ).toBe('Jacob');
  });

  it('renders suggestions on focus when suggestionsOnFocus is true', async () => {
    const wrapper = mount({
      data() {
        return {
          query: 'j',
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.findAll('.autocomplete__suggestion-results-item').length,
    ).toBe(4);

    expect(
      wrapper.find('#autocomplete__suggestion-results-item--0').text(),
    ).toBe('Jacob');
  });

  it('does not render suggestions on focus when suggestionsOnFocus is false', async () => {
    const wrapper = mount({
      data() {
        return {
          query: 'j',
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestionsOnFocus="false" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.findAll('.autocomplete__suggestion-results-item').length,
    ).toBe(0);
  });

  it('returns complex suggestion', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        getSuggestionValue(suggestion) {
          return suggestion.value;
        },
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return complexSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :getSuggestionValue="getSuggestionValue" :suggestions="suggestions" @selectionChange="selectionChange"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    wrapper.find('#autocomplete__suggestion-results-item--3').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.selection).toEqual({ code: 'DD', value: 'Jonathon' });
  });

  it('limits rendered suggestions', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :limit="2" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.findAll('.autocomplete__suggestion-results-item').length,
    ).toBe(2);
  });

  it('closes suggestions on Escape', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(true);

    inputWrapper.trigger('keydown.esc');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(false);
  });

  it('re-opens suggestions on arrow down', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(true);

    inputWrapper.trigger('keydown.esc');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(false);

    inputWrapper.trigger('keydown.down');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(true);
  });

  it('re-opens suggestions on input', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });
    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(true);

    inputWrapper.trigger('keydown.esc');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(false);

    inputWrapper.trigger('input');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(true);
  });

  it('closes suggestions on blur', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(true);

    inputWrapper.trigger('blur');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(false);
  });

  it('navigates suggestions with arrow keys correctly when noCycle is off', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :highlightFirstSuggestion="false" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    // Cycle through list to back to top most suggestions 0>1>2>3>0
    inputWrapper.trigger('keydown.down');
    inputWrapper.trigger('keydown.down');
    inputWrapper.trigger('keydown.down');
    inputWrapper.trigger('keydown.down');
    inputWrapper.trigger('keydown.down');

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--0')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(true);

    // Last suggestion (3)
    inputWrapper.trigger('keydown.up');

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--3')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(true);

    // First Suggestion
    inputWrapper.trigger('keydown.down');

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--0')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(true);
  });

  it('navigates suggestions with arrow keys correctly when noCycle is on', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :highlightFirstSuggestion="false" :highlightCycle="false" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    // Cycle through list to back to top most suggestions 0>1>2>3>0
    // Should stop at last suggestion (3)
    inputWrapper.trigger('keydown.down');
    inputWrapper.trigger('keydown.down');
    inputWrapper.trigger('keydown.down');
    inputWrapper.trigger('keydown.down');
    inputWrapper.trigger('keydown.down');

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--3')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(true);

    // Second to last suggestion (2)
    inputWrapper.trigger('keydown.up');

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--2')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(true);

    // Cycle back up and around suggestion list
    // Should stop on first suggestion (0)
    inputWrapper.trigger('keydown.up');
    inputWrapper.trigger('keydown.up');
    inputWrapper.trigger('keydown.up');
    inputWrapper.trigger('keydown.up');

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--0')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(true);
  });

  it('makes selection on click', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions" :highlightFirstSuggestion="false" @selectionChange="selectionChange"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    wrapper.find('#autocomplete__suggestion-results-item--3').trigger('click');

    await wrapper.vm.$nextTick();

    expect(inputWrapper.element.value).toBe('Jonathon');
    expect(wrapper.vm.selection).toEqual('Jonathon');
  });

  it('makes selection on Enter', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions" :highlightFirstSuggestion="false" @selectionChange="selectionChange"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    // First suggestion (0)
    inputWrapper.trigger('keydown.down');

    // Second suggestion (1)
    inputWrapper.trigger('keydown.down');

    await wrapper.vm.$nextTick();

    inputWrapper.trigger('keydown.enter');

    await wrapper.vm.$nextTick();

    expect(inputWrapper.element.value).toBe('Joanne');
    expect(wrapper.vm.selection).toBe('Joanne');
  });

  it('makes selection on Tab when selectOnBlur is false', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions" :selectOnBlur="false" @selectionChange="selectionChange"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    // First suggestion (0)
    inputWrapper.trigger('keydown.down');

    // Second suggestion (1)
    inputWrapper.trigger('keydown.down');

    await wrapper.vm.$nextTick();

    inputWrapper.trigger('keydown.tab');

    await wrapper.vm.$nextTick();

    expect(inputWrapper.element.value).toBe('John');
    expect(wrapper.vm.selection).toBe('John');
  });

  it('does not make selection on Tab when selectOnBlur is true', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions" @selectionChange="selectionChange"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });
    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    // First suggestion (0)
    inputWrapper.trigger('keydown.down');

    // Second suggestion (1)
    inputWrapper.trigger('keydown.down');

    await wrapper.vm.$nextTick();

    inputWrapper.trigger('keydown.tab');

    await wrapper.vm.$nextTick();

    expect(inputWrapper.element.value).toBe('j');
    expect(wrapper.vm.selection).toBe(null);
  });

  it('makes selection on blur when selectOnBlur is true', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions" @selectionChange="selectionChange"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    // First suggestion (0)
    inputWrapper.trigger('keydown.down');

    // Second suggestion (1)
    inputWrapper.trigger('keydown.down');

    await wrapper.vm.$nextTick();

    inputWrapper.trigger('blur');

    await wrapper.vm.$nextTick();

    expect(inputWrapper.element.value).toBe('John');
    expect(wrapper.vm.selection).toBe('John');
  });

  it('does not make selection on blur when selectOnBlur is false', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions" :selectOnBlur="false" @selectionChange="selectionChange"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });
    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    // First suggestion (0)
    inputWrapper.trigger('keydown.down');

    // Second suggestion (1)
    inputWrapper.trigger('keydown.down');

    await wrapper.vm.$nextTick();

    inputWrapper.trigger('blur');

    await wrapper.vm.$nextTick();

    expect(inputWrapper.element.value).toBe('j');
    expect(wrapper.vm.selection).toBe(null);
  });

  it("emits 'input' on selection", async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions" :highlightFirstSuggestion="false" @selectionChange="selectionChange"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    wrapper.find('#autocomplete__suggestion-results-item--3').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.query).toEqual('Jonathon');
  });

  it('highlights first suggestion when highlightFirst prop is true', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions" @selectionChange="selectionChange"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--0')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(true);
  });

  it('does not highlight first suggestion when highlightFirst prop is false', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" :suggestions="suggestions" :highlightFirstSuggestion="false" @selectionChange="selectionChange"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--0')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(false);
  });

  it('renders suggestion slot', async () => {
    const wrapper = mount({
      data() {
        return {
          query: null,
          selection: null,
        };
      },
      methods: {
        selectionChange(selection) {
          this.selection = selection;
        },
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div>
                <auto-complete v-model="query" :suggestions="suggestions" :highlightFirstSuggestion="false" @selectionChange="selectionChange">
                  <template v-slot="{suggestion}">
                    <div class="test-slot__suggestion"> {{ suggestion }} </div>
                  </template>
                </auto-complete>
              </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.test-slot__suggestion').length).toBe(4);

    expect(
      wrapper.findAll('.autocomplete__suggestion-results-item').length,
    ).toBe(4);

    expect(
      wrapper.find('#autocomplete__suggestion-results-item--0').text(),
    ).toBe('Jacob');
  });

  it('applies namespace to all selectors', async () => {
    const expectedSelectors = {
      container: '.test-autocomplete__container',
      highlightedResultItem:
        '.test-autocomplete__suggestion-results-item--highlighted',
      input: '.test-autocomplete__input',
      queryMatch: '.test-autocomplete__suggestion-query-match',
      resultItem: '.test-autocomplete__suggestion-results-item',
      resultItemId: '#test-autocomplete__suggestion-results-item--',
      resultsContainer: '.test-autocomplete__suggestion-results-container',
      resultsContainerId: '#test-autocomplete__suggestion-results',
      resultsList: '.test-autocomplete__suggestion-results-list',
    };

    const wrapper = mount({
      data() {
        return {
          query: null,
        };
      },
      computed: {
        suggestions() {
          return simpleSuggestionsFilter(this.query);
        },
      },
      template: `<div> <auto-complete v-model="query" namespace="test" :suggestions="suggestions"></auto-complete> </div>`,
      components: { 'auto-complete': AutoComplete },
    });

    const inputWrapper = wrapper.find('.test-autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(wrapper.find(expectedSelectors.container).exists()).toBe(true);
    expect(wrapper.find(expectedSelectors.highlightedResultItem).exists()).toBe(
      true,
    );
    expect(wrapper.find(expectedSelectors.input).exists()).toBe(true);
    expect(wrapper.find(expectedSelectors.queryMatch).exists()).toBe(true);
    expect(wrapper.findAll(expectedSelectors.resultItem).length).toBe(4);
    expect(wrapper.find(`${expectedSelectors.resultItemId}0`).exists()).toBe(
      true,
    );
    expect(wrapper.find(expectedSelectors.resultsContainer).exists()).toBe(
      true,
    );
    expect(wrapper.find(expectedSelectors.resultsContainerId).exists()).toBe(
      true,
    );
    expect(wrapper.find(expectedSelectors.resultsList).exists()).toBe(true);
  });
});
