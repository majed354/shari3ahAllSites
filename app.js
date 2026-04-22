const tools = {
  activity: {
    title: "النشاط العلمي للأعضاء",
    status: "منصة الأعضاء والبحث العلمي",
    url: "https://faculty-activities.netlify.app/",
    color: "var(--activity)",
  },
  kpi: {
    title: "مؤشرات الأداء للكلية",
    status: "لوحة الجودة والقياس والتحسين",
    url: "https://kpishare3h.netlify.app/",
    color: "var(--kpi)",
  },
  courses: {
    title: "خطط ومقررات كلية الشريعة",
    status: "الخطط الدراسية وتوصيفات المقررات",
    url: "https://courseofshar3ah.netlify.app/",
    color: "var(--courses)",
  },
  calendar: {
    title: "تقويم الفعاليات والمؤتمرات",
    status: "الفعاليات الأكاديمية القادمة",
    url: "https://conferences-calendar.netlify.app/",
    color: "var(--calendar)",
  },
  surveys: {
    title: "ساحة الاستطلاعات والرأي",
    status: "الاستبانات النشطة ومؤشرات المشاركة",
    url: "https://shari3ahsurveys.netlify.app/",
    color: "var(--surveys)",
  },
};

const searchIndex = [
  {
    tool: "activity",
    type: "نشاط علمي",
    title: "إضافة بحث منشور",
    subtitle: "تسجيل إنتاج علمي جديد لهذا الفصل",
    keywords: "بحث منشور نشاط علمي انتاج faculty activities",
  },
  {
    tool: "activity",
    type: "نشاط علمي",
    title: "مؤتمر أو ندوة شاركت بها",
    subtitle: "توثيق مشاركة عضو هيئة التدريس",
    keywords: "مؤتمر ندوة مشاركة عضو هيئة التدريس",
  },
  {
    tool: "kpi",
    type: "مؤشر أداء",
    title: "إغلاق خطط التحسين",
    subtitle: "مؤشر يحتاج متابعة عاجلة",
    keywords: "مؤشرات اداء جودة تحسين kpi",
  },
  {
    tool: "kpi",
    type: "مؤشر أداء",
    title: "مؤشر الاعتماد الأكاديمي",
    subtitle: "نسبة إنجاز مرتفعة ضمن لوحة الجودة",
    keywords: "اعتماد اكاديمي مؤشر جودة",
  },
  {
    tool: "courses",
    type: "مقرر",
    title: "أصول الفقه",
    subtitle: "توصيف ينتظر التحديث",
    keywords: "اصول الفقه مقرر توصيف خطة",
  },
  {
    tool: "courses",
    type: "مقرر",
    title: "النظام التجاري",
    subtitle: "مراجعة خطة قادمة",
    keywords: "النظام التجاري مقرر خطة مراجعة",
  },
  {
    tool: "calendar",
    type: "فعالية",
    title: "ندوة الأنظمة العدلية",
    subtitle: "28 أبريل - الرياض",
    keywords: "ندوة الانظمة العدلية مؤتمر فعالية الرياض",
  },
  {
    tool: "calendar",
    type: "فعالية",
    title: "ملتقى البحث الفقهي",
    subtitle: "6 مايو - مكة",
    keywords: "ملتقى البحث الفقهي مؤتمر مكة",
  },
  {
    tool: "surveys",
    type: "استطلاع",
    title: "استبانة رضا المستفيدين",
    subtitle: "يغلق خلال 3 أيام",
    keywords: "استبانة استطلاع رضا المستفيدين surveys",
  },
  {
    tool: "surveys",
    type: "استطلاع",
    title: "قياس تجربة الطالب",
    subtitle: "نسبة مشاركة القسم 68%",
    keywords: "استطلاع تجربة الطالب مشاركة القسم",
  },
];

const sidebarToggle = document.querySelector("#sidebar-toggle");
const toolFrame = document.querySelector("#tool-frame");
const workspaceTitle = document.querySelector("#workspace-title");
const workspaceStatus = document.querySelector("#workspace-status");
const externalActiveLink = document.querySelector("#external-active-link");
const copyActiveLink = document.querySelector("#copy-active-link");
const toast = document.querySelector("#toast");
const searchInput = document.querySelector("#smart-search");
const searchResults = document.querySelector("#search-results");
const searchClear = document.querySelector("#search-clear");
const openButtons = Array.from(document.querySelectorAll("[data-open-tool]"));
const navButtons = Array.from(document.querySelectorAll(".tool-nav-item"));
const cards = Array.from(document.querySelectorAll(".ops-card"));

let activeTool = "activity";
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

const showToast = (message) => {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
};

const setActiveTool = (toolKey, options = {}) => {
  const tool = tools[toolKey];
  if (!tool) return;

  activeTool = toolKey;
  workspaceTitle.textContent = tool.title;
  workspaceStatus.textContent = tool.status;
  externalActiveLink.href = tool.url;
  toolFrame.src = tool.url;
  toolFrame.title = tool.title;

  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.openTool === toolKey);
  });

  cards.forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.openTool === toolKey);
  });

  if (options.scroll) {
    document.querySelector("#embedded-workspace").scrollIntoView({ block: "start", behavior: "smooth" });
  }
};

const renderSearch = () => {
  const query = normalize(searchInput.value);
  searchClear.hidden = !query;

  if (!query) {
    searchResults.hidden = true;
    searchResults.innerHTML = "";
    return;
  }

  const matches = searchIndex
    .filter((item) => {
      const haystack = normalize(`${item.title} ${item.subtitle} ${item.type} ${item.keywords}`);
      return haystack.includes(query);
    })
    .slice(0, 7);

  if (!matches.length) {
    searchResults.hidden = false;
    searchResults.innerHTML = '<div class="search-empty">لا توجد نتائج مطابقة</div>';
    return;
  }

  searchResults.hidden = false;
  searchResults.innerHTML = matches
    .map((item, index) => {
      const tool = tools[item.tool];
      return `
        <button class="search-result" type="button" role="option" data-result-tool="${item.tool}" data-result-index="${index}">
          <i style="background: ${tool.color}"></i>
          <span>
            <strong>${item.title}</strong>
            <small>${item.subtitle}</small>
          </span>
          <span>${item.type}</span>
        </button>
      `;
    })
    .join("");
};

openButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const toolKey = button.dataset.openTool;
    if (!toolKey) return;
    event.stopPropagation();
    setActiveTool(toolKey, { scroll: true });
  });
});

cards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    setActiveTool(card.dataset.openTool, { scroll: true });
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActiveTool(card.dataset.openTool, { scroll: true });
    }
  });
});

sidebarToggle.addEventListener("click", () => {
  const isCollapsed = document.body.classList.toggle("sidebar-collapsed");
  sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
});

searchInput.addEventListener("input", renderSearch);

searchInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  const firstResult = searchResults.querySelector("[data-result-tool]");
  if (!firstResult) return;
  event.preventDefault();
  setActiveTool(firstResult.dataset.resultTool, { scroll: true });
  searchResults.hidden = true;
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  renderSearch();
  searchInput.focus();
});

searchResults.addEventListener("click", (event) => {
  const result = event.target.closest("[data-result-tool]");
  if (!result) return;
  setActiveTool(result.dataset.resultTool, { scroll: true });
  searchResults.hidden = true;
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".smart-search")) return;
  searchResults.hidden = true;
});

copyActiveLink.addEventListener("click", async () => {
  const link = tools[activeTool].url;

  try {
    await navigator.clipboard.writeText(link);
    showToast("تم نسخ رابط المنصة");
  } catch {
    showToast(link);
  }
});

setActiveTool(activeTool);
