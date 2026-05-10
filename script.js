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
    .replace("German English", "Deutsch; Englisch")
    .replace("English German", "Englisch; Deutsch")
    .replace("German", "Deutsch")
    .replace("English", "Englisch")
    .split(/;|,|\+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function getUniqueValues(key) {

  if (key === "language") {

    const values = [];

    sources.forEach(source => {

      const langs = splitValues(source.language);

      if (langs.includes("Deutsch") && langs.includes("Englisch")) {
        values.push("Deutsch + Englisch");
      }

      if (langs.includes("Deutsch") && !langs.includes("Englisch")) {
        values.push("Deutsch");
      }

      if (langs.includes("Englisch") && !langs.includes("Deutsch")) {
        values.push("Englisch");
      }

    });

    return [...new Set(values)].sort();
  }

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

    const title = source.title || "Ohne Titel";

    const provider =
      source.provider || "Keine Angabe";

    const description =
      source.description || "Keine Kurzbeschreibung vorhanden.";

    const contentField =
      source.contentField || "Keine Themenbereiche angegeben.";

    card.innerHTML = `
      <h3>${title}</h3>

      <p>
        <strong>Anbieter:</strong>
        ${provider}
      </p>

      <p>${description}</p>

      <p>
        <strong>Themenbereiche:</strong>
        ${contentField}
      </p>

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

  const searchValue =
    searchInput.value.toLowerCase().trim();

  const selectedLanguage =
    languageFilter.value;

  const selectedSourceType =
    sourceTypeFilter.value;

  const selectedEventCategory =
    eventCategoryFilter.value;

  const selectedTimeCategory =
    timeCategoryFilter.value;

  const filtered = sources.filter(source => {

    const searchableText = `
      ${source.title || ""}
      ${source.provider || ""}
      ${source.subject || ""}
      ${source.contentField || ""}
      ${source.timeCategory || ""}
      ${source.eventCategory || ""}
      ${source.sourceType || ""}
      ${source.language || ""}
      ${source.description || ""}
      ${source.notes || ""}
    `.toLowerCase();

    const matchesSearch =
      !searchValue ||
      searchableText.includes(searchValue);

    const langs =
      splitValues(source.language);

    let matchesLanguage =
      !selectedLanguage;

    if (selectedLanguage === "Deutsch") {
      matchesLanguage =
        langs.includes("Deutsch") &&
        !langs.includes("Englisch");
    }

    if (selectedLanguage === "Englisch") {
      matchesLanguage =
        langs.includes("Englisch") &&
        !langs.includes("Deutsch");
    }

    if (selectedLanguage === "Deutsch + Englisch") {
      matchesLanguage =
        langs.includes("Deutsch") &&
        langs.includes("Englisch");
    }

    const matchesSourceType =
      !selectedSourceType ||
      splitValues(source.sourceType)
        .includes(selectedSourceType);

    const matchesEventCategory =
      !selectedEventCategory ||
      splitValues(source.eventCategory)
        .includes(selectedEventCategory);

    const matchesTimeCategory =
      !selectedTimeCategory ||
      splitValues(source.timeCategory)
        .includes(selectedTimeCategory);

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

populateDropdown(
  languageFilter,
  getUniqueValues("language")
);

populateDropdown(
  sourceTypeFilter,
  getUniqueValues("sourceType")
);

populateDropdown(
  eventCategoryFilter,
  getUniqueValues("eventCategory")
);

populateDropdown(
  timeCategoryFilter,
  getUniqueValues("timeCategory")
);

renderSources(sources);

searchInput.addEventListener(
  "input",
  filterSources
);

languageFilter.addEventListener(
  "change",
  filterSources
);

sourceTypeFilter.addEventListener(
  "change",
  filterSources
);

eventCategoryFilter.addEventListener(
  "change",
  filterSources
);

timeCategoryFilter.addEventListener(
  "change",
  filterSources
);

resetFiltersButton.addEventListener(
  "click",
  resetFilters
);
