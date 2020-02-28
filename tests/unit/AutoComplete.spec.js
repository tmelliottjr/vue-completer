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
    return;
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
    return;
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
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
    };

    const wrapper = mount(AutoComplete, { propsData });
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
    const propsData = {
      suggestions: complexSuggestionsFilter('j'),
      suggestionValue(suggestion) {
        return suggestion.value;
      },
    };

    const wrapper = mount(AutoComplete, { propsData });
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

  it('returns complex suggestion', async () => {
    const propsData = {
      suggestions: complexSuggestionsFilter('j'),
      suggestionValue(suggestion) {
        return suggestion.value;
      },
    };

    const wrapper = mount(AutoComplete, { propsData });
    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    wrapper.find('#autocomplete__suggestion-results-item--3').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().selectionChange[0]).toEqual([
      { code: 'DD', value: 'Jonathon' },
    ]);
    expect(wrapper.emitted().selectionChange).toBeTruthy();
  });

  it('limits rendered suggestions', async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
      limit: 2,
    };

    const wrapper = mount(AutoComplete, { propsData });
    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.findAll('.autocomplete__suggestion-results-item').length,
    ).toBe(2);
  });

  it('closes suggestions on Escape', async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
    };

    const wrapper = mount(AutoComplete, { propsData });
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
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
    };

    const wrapper = mount(AutoComplete, { propsData });
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
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
    };

    const wrapper = mount(AutoComplete, { propsData });
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
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
    };

    const wrapper = mount(AutoComplete, { propsData });
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

  it('navigates suggestions with arrow keys', async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
      highlightFirst: false,
    };

    const wrapper = mount(AutoComplete, { propsData });
    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    expect(
      wrapper.find('.autocomplete__suggestion-results-list').exists(),
    ).toBe(true);

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--0')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(false);

    // First suggestion (0)
    inputWrapper.trigger('keydown.down');

    // Second suggestion (2)
    inputWrapper.trigger('keydown.down');

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--1')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(true);

    // First suggestion (0)
    inputWrapper.trigger('keydown.up');

    await wrapper.vm.$nextTick();

    expect(
      wrapper
        .find('#autocomplete__suggestion-results-item--0')
        .classes('autocomplete__suggestion-results-item--highlighted'),
    ).toBe(true);
  });

  it('makes selection on click', async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
      highlightFirst: false,
    };

    const wrapper = mount(AutoComplete, { propsData });
    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    wrapper.find('#autocomplete__suggestion-results-item--3').trigger('click');

    await wrapper.vm.$nextTick();

    expect(inputWrapper.element.value).toBe('Jonathon');
    expect(wrapper.emitted().selectionChange[0]).toEqual(['Jonathon']);
    expect(wrapper.emitted().selectionChange).toBeTruthy();
  });

  it('makes selection on Enter', async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
      highlightFirst: false,
    };

    const wrapper = mount(AutoComplete, { propsData });
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
    expect(wrapper.emitted().selectionChange).toBeTruthy();
  });

  it('makes selection on Tab when selectOnBlur is false', async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
      selectOnBlur: false,
    };

    const wrapper = mount(AutoComplete, { propsData });
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
    expect(wrapper.emitted().selectionChange).toBeTruthy();
  });

  it('does not make selection on Tab when selectOnBlur is true', async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
    };

    const wrapper = mount(AutoComplete, { propsData });
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
    expect(wrapper.emitted().selectionChange).toBeFalsy();
  });

  it('makes selection on blur when selectOnBlur is true', async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
    };

    const wrapper = mount(AutoComplete, { propsData });
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
    expect(wrapper.emitted().selectionChange[0]).toEqual(['John']);
    expect(wrapper.emitted().selectionChange).toBeTruthy();
  });

  it('does not make selection on blur when selectOnBlur is false', async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
      selectOnBlur: false,
    };

    const wrapper = mount(AutoComplete, { propsData });
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
    expect(wrapper.emitted('selectionChange')).toBeFalsy();
  });

  it("emits 'input' on selection", async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
      highlightFirst: false,
    };

    const wrapper = mount(AutoComplete, { propsData });
    const inputWrapper = wrapper.find('.autocomplete__input');

    inputWrapper.trigger('focus');
    inputWrapper.setValue('j');

    await wrapper.vm.$nextTick();

    wrapper.find('#autocomplete__suggestion-results-item--3').trigger('click');

    await wrapper.vm.$nextTick();

    expect(wrapper.emitted().input[1]).toEqual(['Jonathon']);
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it('highlights first suggestion when highlightFirst prop is true', async () => {
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
      highlightFirst: true,
    };

    const wrapper = mount(AutoComplete, { propsData });
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
    const propsData = {
      suggestions: simpleSuggestionsFilter('j'),
      highlightFirst: false,
    };

    const wrapper = mount(AutoComplete, { propsData });
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
});
