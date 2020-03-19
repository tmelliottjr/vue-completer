const selectors = {
  container: 'autocomplete__container',
  highlightedResultItem: 'autocomplete__suggestion-results-item--highlighted',
  input: 'autocomplete__input',
  queryMatch: 'autocomplete__suggestion-query-match',
  resultItem: 'autocomplete__suggestion-results-item',
  resultItemId: 'autocomplete__suggestion-results-item--',
  resultsContainer: 'autocomplete__suggestion-results-container',
  resultsContainerId: 'autocomplete__suggestion-results',
  resultsList: 'autocomplete__suggestion-results-list',
};

export const getNamespacedSelectors = namespace => {
  if (!namespace) {
    return selectors;
  }

  let namespacedSelectors = {};

  Object.keys(selectors).forEach(key => {
    namespacedSelectors[key] = `${namespace}-${selectors[key]}`;
  });

  return namespacedSelectors;
};
