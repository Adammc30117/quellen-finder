const resultsContainer = document.getElementById("results");
const resultsCount = document.getElementById("resultsCount");

const searchInput = document.getElementById("searchInput");
const languageFilter = document.getElementById("languageFilter");
const sourceTypeFilter = document.getElementById("sourceTypeFilter");
const eventCategoryFilter = document.getElementById("eventCategoryFilter");
const timeCategoryFilter = document.getElementById("timeCategoryFilter");
const resetFiltersButton = document.getElementById("resetFilters");

function splitValues(value) {
  if (!value) return [];

  return value
    .split(/;|,/)
    .map(item => item.trim())
    .filter(Boolean);
}

function getUniqueValues(key) {
  const allValues = sources.flatMap(source => splitValues(source[key]));
  return [...new Set(allValues)].sort();
}

function populateDropdown(selectElement, values) {
  selectElement.innerHTML = `<option value="">Alle</option>`;

  values.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

function createTags(value) {
  return splitValues(value)
    .map(item => `<span class="tag">${item}</span>`)
    .join("");
}

function renderSources(filteredSources) {
  resultsContainer.innerHTML = "";

  resultsCount.textContent = `${filteredSources.length} Quelle(n) gefunden`;

  if (filteredSources.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        Keine passenden Quellen gefunden.
      </div>
    `;
    return;
  }

  filteredSources.forEach(source => {
    const card = document.createElement("div");
    card.className = "card";

    const provider = source.provider || "Keine Angabe";
    const description = source.description || "Keine Kurzbeschreibung vorhanden.";
    const title = source.title || "Ohne Titel";

    card.innerHTML = `
      <h3>${title}</h3>

      <p><strong>Anbieter:</strong> ${provider}</p>

      <p>${description}</p>

      <div class="tags">
        ${createTags(source.language)}
        ${createTags(source.sourceType)}
        ${createTags(source.eventCategory)}
        ${createTags(source.timeCategory)}
      </div>

      <a href="${source.url}" target="_blank" rel="noopener noreferrer">
        Quelle öffnen
      </a>
    `;

    resultsContainer.appendChild(card);
  });
}

function filterSources() {
  const searchValue = searchInput.value.toLowerCase().trim();

  const selectedLanguage = languageFilter.value;
  const selectedSourceType = sourceTypeFilter.value;
  const selectedEventCategory = eventCategoryFilter.value;
  const selectedTimeCategory = timeCategoryFilter.value;

  const filtered = sources.filter(source => {

    const safeSource = {
      title: source.title || "",
      provider: source.provider || "",
      subject: source.subject || "",
      contentField: source.contentField || "",
      timeCategory: source.timeCategory || "",
      eventCategory: source.eventCategory || "",
      sourceType: source.sourceType || "",
      language: source.language || "",
      description: source.description || "",
      notes: source.notes || ""
    };

    const searchableText = `
      ${safeSource.title}
      ${safeSource.provider}
      ${safeSource.subject}
      ${safeSource.contentField}
      ${safeSource.timeCategory}
      ${safeSource.eventCategory}
      ${safeSource.sourceType}
      ${safeSource.language}
      ${safeSource.description}
      ${safeSource.notes}
    `.toLowerCase();

    const matchesSearch =
      !searchValue || searchableText.includes(searchValue);

    const matchesLanguage =
      !selectedLanguage ||
      splitValues(source.language).includes(selectedLanguage);

    const matchesSourceType =
      !selectedSourceType ||
      splitValues(source.sourceType).includes(selectedSourceType);

    const matchesEventCategory =
      !selectedEventCategory ||
      splitValues(source.eventCategory).includes(selectedEventCategory);

    const matchesTimeCategory =
      !selectedTimeCategory ||
      splitValues(source.timeCategory).includes(selectedTimeCategory);

    return (
      matchesSearch &&
      matchesLanguage &&
      matchesSourceType &&
      matchesEventCategory &&
      matchesTimeCategory
    );
  });

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
