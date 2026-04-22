const searchInput = document.querySelector("#platform-search");
const filterTabs = Array.from(document.querySelectorAll("[data-filter]"));
const cards = Array.from(document.querySelectorAll("[data-card]"));
const visibleCount = document.querySelector("#visible-count");
const emptyState = document.querySelector("#empty-state");
const toast = document.querySelector("#toast");

let activeFilter = "all";
let toastTimer;

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();

const renderCards = () => {
  const query = normalize(searchInput.value);
  let count = 0;

  cards.forEach((card) => {
    const matchesFilter = activeFilter === "all" || card.dataset.category === activeFilter;
    const haystack = normalize(`${card.textContent} ${card.dataset.keywords || ""}`);
    const matchesSearch = !query || haystack.includes(query);
    const isVisible = matchesFilter && matchesSearch;

    card.hidden = !isVisible;
    if (isVisible) count += 1;
  });

  visibleCount.textContent = count;
  emptyState.hidden = count > 0;
};

const showToast = (message) => {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
};

filterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeFilter = tab.dataset.filter;
    filterTabs.forEach((item) => {
      item.classList.toggle("is-active", item === tab);
    });
    renderCards();
  });
});

searchInput.addEventListener("input", renderCards);

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const link = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(link);
      showToast("تم نسخ الرابط");
    } catch {
      showToast(link);
    }
  });
});

renderCards();
