const resultsContainer = document.getElementById("results");
const resultsCount = document.getElementById("resultsCount");

const searchInput = document.getElementById("searchInput");
const languageFilter = document.getElementById("languageFilter");
const sourceTypeFilter = document.getElementById("sourceTypeFilter");
const eventCategoryFilter = document.getElementById("eventCategoryFilter");
const timeCategoryFilter = document.getElementById("timeCategoryFilter");
const resetFiltersButton = document.getElementById("resetFilters");

function getUniqueValues(key) {
  return [...new Set(sources.map(s => s[key]).filter(Boolean))];
}

function populateDropdown(selectElement, values) {
  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

function renderSources(filtered) {
  resultsContainer.innerHTML = "";
  resultsCount.textContent = `${filtered.length} Quelle(n) gefunden`;

  filtered.forEach(source => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${source.title}</h3>
      <p><strong>Anbieter:</strong> ${source.provider}</p>
      <p>${source.description}</p>
      <p><strong>Sprache:</strong> ${source.language}</p>
      <p><strong>Typ:</strong> ${source.sourceType}</p>
      <p><strong>Kategorie:</strong> ${source.eventCategory}</p>
      <p><strong>Zeit:</strong> ${source.timeCategory}</p>
      <a href="${source.url}" target="_blank">Zur Quelle</a>
    `;

    resultsContainer.appendChild(card);
  });
}

function filterSources() {
  const search = searchInput.value.toLowerCase();
  const lang = languageFilter.value;
  const type = sourceTypeFilter.value;
  const event = eventCategoryFilter.value;
  const time = timeCategoryFilter.value;

  const filtered = sources.filter(s =>
    (s.title.toLowerCase().includes(search) ||
     s.description.toLowerCase().includes(search)) &&
    (!lang || s.language === lang) &&
    (!type || s.sourceType === type) &&
    (!event || s.eventCategory === event) &&
    (!time || s.timeCategory === time)
  );

  renderSources(filtered);
}

function resetFilters() {
  searchInput.value = "";
  languageFilter.value = "";
  sourceTypeFilter.value = "";
  eventCategoryFilter.value = "";
  timeCategoryFilter.value = "";
  renderSources(sources);
}

populateDropdown(languageFilter, getUniqueValues("language"));
populateDropdown(sourceTypeFilter, getUniqueValues("sourceType"));
populateDropdown(eventCategoryFilter, getUniqueValues("eventCategory"));
populateDropdown(timeCategoryFilter, getUniqueValues("timeCategory"));

renderSources(sources);

searchInput.addEventListener("input", filterSources);
languageFilter.addEventListener("change", filterSources);
sourceTypeFilter.addEventListener("change", filterSources);
eventCategoryFilter.addEventListener("change", filterSources);
timeCategoryFilter.addEventListener("change", filterSources);
resetFiltersButton.addEventListener("click", resetFilters);