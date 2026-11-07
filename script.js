// TODO PENGURUS: Lengkapi informasi yang sudah terverifikasi di objek berikut.
// Jangan menambahkan kontak, harga, lokasi, atau jam operasional sebelum datanya tersedia.
const informationPending = "Informasi akan diperbarui oleh pengurus.";

const unitDetails = {
  food: {
    name: "F&B (Food & Drink)",
    description: "Pilihan makanan dan minuman untuk kebutuhan sehari-hari.",
    services: ["Makanan", "Minuman"],
    contact: informationPending,
    hours: informationPending,
    location: informationPending,
    pricing: informationPending,
  },
  print: {
    name: "Percetakan & Dokumen",
    description:
      "Jasa print, fotokopi, dan pengetikan untuk kebutuhan dokumen.",
    services: ["Print", "Fotokopi", "Pengetikan"],
    contact: informationPending,
    hours: informationPending,
    location: informationPending,
    pricing: informationPending,
  },
  consignment: {
    name: "Konsinyasi",
    description: "Fasilitas titip jual barang dan produk mahasiswa.",
    services: ["Titip jual barang", "Titip jual produk mahasiswa"],
    contact: informationPending,
    hours: informationPending,
    location: informationPending,
    pricing: informationPending,
  },
  creative: {
    name: "Jasa Kreatif",
    description: "Layanan desain grafis, fotografi, dan videografi.",
    services: ["Desain grafis", "Fotografi", "Videografi"],
    contact: informationPending,
    hours: informationPending,
    location: informationPending,
    pricing: informationPending,
  },
};

const dialog = document.querySelector("#detail-dialog");
const title = document.querySelector("#dialog-title");
const description = document.querySelector("#dialog-description");
const services = document.querySelector("#dialog-services");
const contact = document.querySelector("#dialog-contact");
const hours = document.querySelector("#dialog-hours");
const locationInfo = document.querySelector("#dialog-location");
const pricingInfo = document.querySelector("#dialog-pricing");
const operationalFields = document.querySelector("#dialog-operational-fields");
const operationalPending = document.querySelector(
  "#dialog-operational-pending",
);
const closeButton = dialog.querySelector(".dialog-close");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let openingButton = null;
let closeTimer = null;

document
  .querySelectorAll(".detail-button, .device-row[data-unit]")
  .forEach((button) => {
    const unit = unitDetails[button.dataset.unit];
    if (!unit) return;

    button.disabled = false;
    button.addEventListener("click", () => {
      openingButton = button;
      title.textContent = unit.name;
      description.textContent = unit.description;
      services.replaceChildren();

      unit.services.forEach((service) => {
        const item = document.createElement("li");
        item.textContent = service;
        services.append(item);
      });

      contact.textContent = unit.contact;
      hours.textContent = unit.hours;
      if (locationInfo) locationInfo.textContent = unit.location;
      if (pricingInfo) pricingInfo.textContent = unit.pricing;
      const allPending = [
        unit.contact,
        unit.hours,
        unit.location,
        unit.pricing,
      ].every((value) => value === informationPending);
      if (operationalFields) operationalFields.hidden = allPending;
      if (operationalPending) operationalPending.hidden = !allPending;
      dialog.showModal();
    });
  });

// Modal tetap terbuka selama animasi keluar agar fokus keyboard tetap terjaga.
function finishDialogClose() {
  window.clearTimeout(closeTimer);
  closeTimer = null;
  dialog.classList.remove("is-closing");
  if (dialog.open) dialog.close();
}

function requestDialogClose() {
  if (!dialog.open || dialog.classList.contains("is-closing")) return;
  if (reducedMotion.matches) {
    finishDialogClose();
    return;
  }
  dialog.classList.add("is-closing");
  // Cadangan jika event animasi tidak dikirim oleh browser.
  closeTimer = window.setTimeout(finishDialogClose, 230);
}

closeButton.addEventListener("click", requestDialogClose);
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  requestDialogClose();
});
dialog.addEventListener("animationend", (event) => {
  if (event.target === dialog && event.animationName === "modal-out")
    finishDialogClose();
});
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    requestDialogClose();
});

dialog.addEventListener("close", () => {
  window.clearTimeout(closeTimer);
  closeTimer = null;
  dialog.classList.remove("is-closing");
  openingButton?.focus({ preventScroll: true });
  openingButton = null;
});

// Scene dekoratif mengikuti scroll native; konten layanan tetap tersedia di katalog.
const root = document.documentElement;
const introScene = document.querySelector(".intro-scene");
const scenePin = document.querySelector(".scene-pin");
const siteHeader = document.querySelector(".site-header");
const orbitNodes = [...document.querySelectorAll(".orbit-node")];
const catalogGrid = document.querySelector(".catalog-grid");
const catalogCards = [...document.querySelectorAll(".unit-card")];
const aboutSection = document.querySelector("#tentang");
const catalogSection = document.querySelector("#katalog");
const revealTargets = [
  ...document.querySelectorAll(
    ".about-grid > div, .section-heading, .operations-heading, .operations-list > details",
  ),
];
const sectionLinks = [
  ...document.querySelectorAll(".main-nav a, .menu-links a"),
]
  .map((link) => ({
    link,
    section: document.querySelector(link.getAttribute("href")),
  }))
  .filter((item) => item.section);

const sceneProperties = [
  "--scene-p",
  "--night-reveal",
  "--copy-opacity",
  "--night-opacity",
  "--device-y",
  "--device-fit",
  "--node-open",
  "--caption-color",
];
const nodeProperties = ["--node-x", "--node-y", "--node-angle", "--node-delay"];
let sceneEnabled = false;
let galleryEnabled = false;
let activeGalleryIndex = 0;
let framePending = false;
let revealObserver = null;
let lastSceneVisualKey = null;
let lastSceneNodeKey = null;
let lastSceneVisible = null;
let lastSceneHeaderNight = null;

function resetSceneCache() {
  lastSceneVisualKey = null;
  lastSceneNodeKey = null;
  lastSceneVisible = null;
  lastSceneHeaderNight = null;
}

function clamp(value, minimum = 0, maximum = 1) {
  return Math.max(minimum, Math.min(maximum, value));
}

function interpolate(start, end, progress) {
  return start + (end - start) * progress;
}

function clearSceneStyles() {
  introScene?.classList.remove("scene-enabled");
  if (introScene)
    sceneProperties.forEach((property) =>
      introScene.style.removeProperty(property),
    );
  orbitNodes.forEach((node) =>
    nodeProperties.forEach((property) => node.style.removeProperty(property)),
  );
}

function configureIntro() {
  resetSceneCache();
  sceneEnabled = false;
  clearSceneStyles();
  const headerHeight = siteHeader?.offsetHeight || 0;
  root.style.setProperty("--header-height", headerHeight + "px");
  if (!introScene || !scenePin || reducedMotion.matches) return;

  const availableHeight = window.innerHeight - headerHeight;
  if (availableHeight < 420) return;
  introScene.style.setProperty(
    "--device-fit",
    Math.min(1, availableHeight / 650).toFixed(4),
  );
  introScene.classList.add("scene-enabled");
  sceneEnabled = true;
}

function positionOrbitNodes(progress) {
  const mobile = window.innerWidth <= 600;
  const nodeOpen = clamp((progress - 0.25) / 0.45);
  const startY = mobile ? [-75, -110, 95, 130] : [-70, -105, 160, 180];
  const endY = mobile ? [-65, -65, 100, 100] : [-65, -65, 105, 105];
  const angles = [-14, 12, 9, -10];
  const mobileSpread = Math.min(window.innerWidth * 0.37, 145);
  const desktopLimit = window.innerWidth * 0.3;
  const limitSpread = (value) =>
    Math.sign(value) * Math.min(Math.abs(value), desktopLimit);
  const startX = mobile
    ? [-mobileSpread, mobileSpread, -mobileSpread, mobileSpread]
    : [-340, 330, -260, 290].map(limitSpread);
  const endX = mobile
    ? [-mobileSpread, mobileSpread, -mobileSpread, mobileSpread]
    : [-340, 340, -340, 340].map(limitSpread);

  orbitNodes.forEach((node, index) => {
    if (index > 3) return;
    node.style.setProperty(
      "--node-x",
      interpolate(startX[index], endX[index], nodeOpen).toFixed(2) + "px",
    );
    node.style.setProperty(
      "--node-y",
      interpolate(startY[index], endY[index], nodeOpen).toFixed(2) + "px",
    );
    node.style.setProperty(
      "--node-angle",
      interpolate(angles[index], 0, nodeOpen).toFixed(2) + "deg",
    );
    node.style.setProperty("--node-delay", (index * 0.09).toFixed(2) + "s");
  });
}

function updateScene() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const headerHeight = siteHeader?.offsetHeight || 0;
  const aboutTop = aboutSection?.getBoundingClientRect().top;
  const catalogTop = catalogSection?.getBoundingClientRect().top;
  const introBounds = introScene?.getBoundingClientRect();
  const pinBounds = scenePin?.getBoundingClientRect();
  const animatedScene = sceneEnabled && introScene && scenePin;
  const scrollDistance = animatedScene
    ? introScene.offsetHeight - scenePin.offsetHeight
    : 0;
  const progress =
    animatedScene && scrollDistance > 0
      ? clamp((headerHeight - introBounds.top) / scrollDistance)
      : 0;
  const visible =
    !!pinBounds &&
    pinBounds.bottom > headerHeight &&
    pinBounds.top < viewportHeight;
  const geometryKey = [
    viewportWidth,
    viewportHeight,
    headerHeight,
    scrollDistance,
  ].join("|");
  const visualKey = geometryKey + "|" + progress.toFixed(4);
  const nodeKey =
    geometryKey + "|" + clamp((progress - 0.25) / 0.45).toFixed(4);
  const withinDarkSection = sceneEnabled
    ? progress > 0.58
    : aboutTop !== undefined && aboutTop <= headerHeight;
  const beforeCatalog =
    catalogTop === undefined || catalogTop > headerHeight + 28;
  const headerNight = withinDarkSection && beforeCatalog;

  if (introScene && visible !== lastSceneVisible) {
    if (visible) introScene.classList.remove("is-scene-offscreen");
    else introScene.classList.add("is-scene-offscreen");
    lastSceneVisible = visible;
  }

  if (animatedScene && visualKey !== lastSceneVisualKey) {
    const availableHeight = Math.max(0, viewportHeight - headerHeight);
    const mobile = viewportWidth <= 600;

    introScene.style.setProperty("--scene-p", progress.toFixed(4));
    introScene.style.setProperty(
      "--night-reveal",
      clamp((progress - 0.12) / 0.7).toFixed(4),
    );
    introScene.style.setProperty(
      "--copy-opacity",
      Math.max(0, 1 - progress * 3).toFixed(4),
    );
    introScene.style.setProperty(
      "--night-opacity",
      clamp((progress - 0.55) / 0.25).toFixed(4),
    );
    introScene.style.setProperty(
      "--device-y",
      interpolate(mobile ? -35 : 20, -availableHeight * 0.22, progress).toFixed(
        2,
      ) + "px",
    );
    introScene.style.setProperty(
      "--node-open",
      clamp((progress - 0.25) / 0.45).toFixed(4),
    );
    introScene.style.setProperty(
      "--caption-color",
      progress > 0.5 ? "#d1dee7" : "#777b78",
    );
    lastSceneVisualKey = visualKey;
  }
  if (animatedScene && nodeKey !== lastSceneNodeKey) {
    positionOrbitNodes(progress);
    lastSceneNodeKey = nodeKey;
  }
  if (siteHeader && headerNight !== lastSceneHeaderNight) {
    if (headerNight) siteHeader.classList.add("is-night");
    else siteHeader.classList.remove("is-night");
    lastSceneHeaderNight = headerNight;
  }
}

function activateGalleryCard(index) {
  if (!galleryEnabled || !catalogCards[index]) return;
  activeGalleryIndex = index;
  catalogCards.forEach((card, cardIndex) => {
    if (cardIndex === activeGalleryIndex) card.classList.add("is-active");
    else card.classList.remove("is-active");
  });
}

function configureGallery() {
  galleryEnabled = false;
  catalogGrid?.classList.remove("gallery-ready");
  catalogCards.forEach((card) => card.classList.remove("is-active"));
  if (
    !catalogGrid ||
    !catalogCards.length ||
    catalogGrid.classList.contains("is-filtered") ||
    reducedMotion.matches ||
    window.innerWidth < 1000
  )
    return;
  galleryEnabled = true;
  catalogGrid.classList.add("gallery-ready");
  activateGalleryCard(Math.min(activeGalleryIndex, catalogCards.length - 1));
}

catalogCards.forEach((card, index) => {
  function previewCard(event) {
    if (
      !galleryEnabled ||
      dialog.open ||
      activeGalleryIndex === index ||
      event.buttons
    )
      return;
    const action = card.querySelector(".detail-button");
    // Biarkan posisi tombol tetap saat pointer masuk ke area aksi.
    if (action && event.clientY >= action.getBoundingClientRect().top - 12)
      return;
    activateGalleryCard(index);
  }
  card.addEventListener("pointerenter", previewCard);
  card.addEventListener("pointermove", previewCard);
  card.addEventListener("focusin", (event) => {
    if (openingButton === event.target) return;
    if (event.target.matches(":focus-visible")) activateGalleryCard(index);
  });
});

// Reveal hanya dipasang untuk elemen di bawah layar, sekali saat mulai dibaca.
function initializeReveals() {
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
  document
    .querySelectorAll(".about-grid, .operations-list")
    .forEach((group) => {
      [...group.children].forEach((element, index) => {
        element.style.setProperty(
          "--reveal-delay",
          Math.min(index * 60, 160) + "ms",
        );
      });
    });
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
  );
  revealTargets.forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    element.classList.add("reveal-element");
    revealObserver.observe(element);
  });
}

function showAllReveals() {
  revealObserver?.disconnect();
  revealTargets.forEach((element) => {
    element.classList.add("is-visible");
    element.classList.remove("reveal-element");
  });
}

function updatePage() {
  let activeSection = null;
  sectionLinks.forEach((item) => {
    if (item.section.getBoundingClientRect().top <= window.innerHeight * 0.35)
      activeSection = item.section;
  });
  updateScene();
  sectionLinks.forEach(({ link, section }) => {
    if (section === activeSection)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

function queuePageUpdate() {
  if (framePending) return;
  framePending = true;
  window.requestAnimationFrame(() => {
    framePending = false;
    updatePage();
  });
}

function configureExperience() {
  configureIntro();
  configureGallery();
  queuePageUpdate();
}

if (!reducedMotion.matches) root.classList.add("motion-enabled");
configureIntro();
configureGallery();
initializeReveals();
updatePage();

window.addEventListener("scroll", queuePageUpdate, { passive: true });
window.addEventListener("resize", configureExperience);
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) {
    root.classList.remove("motion-enabled");
    showAllReveals();
    if (dialog.classList.contains("is-closing")) finishDialogClose();
  } else {
    root.classList.add("motion-enabled");
  }
  configureExperience();
});

// Menu kapsul memakai dialog native agar fokus, Escape, dan latar inert terjaga.
const navigationDialog = document.querySelector("#navigation-dialog");
const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const navigationCapsule = document.querySelector(".header-inner");
let menuCloseTimer = null;
let pendingMenuDestination = null;

if (
  navigationDialog &&
  menuToggle &&
  menuClose &&
  navigationCapsule &&
  typeof navigationDialog.showModal === "function"
) {
  root.classList.add("menu-ready");
  menuToggle.hidden = false;

  function positionNavigation() {
    const bounds = navigationCapsule.getBoundingClientRect();
    navigationDialog.style.left = bounds.left + "px";
    navigationDialog.style.top = bounds.top + "px";
    navigationDialog.style.width = bounds.width + "px";
    navigationDialog.style.maxHeight =
      Math.max(120, window.innerHeight - bounds.top - 12) + "px";
  }

  function finishMenuClose() {
    window.clearTimeout(menuCloseTimer);
    menuCloseTimer = null;
    if (navigationDialog.open) navigationDialog.close();
    navigationDialog.classList.remove("is-closing");
    navigationDialog.style.removeProperty("--menu-close-clip");
  }

  function requestMenuClose(destination = null) {
    if (!navigationDialog.open) return;
    if (destination) pendingMenuDestination = destination;
    if (navigationDialog.classList.contains("is-closing")) return;
    if (reducedMotion.matches) {
      finishMenuClose();
      return;
    }
    navigationDialog.style.setProperty(
      "--menu-close-clip",
      window.getComputedStyle(navigationDialog).clipPath,
    );
    navigationDialog.classList.add("is-closing");
    menuCloseTimer = window.setTimeout(finishMenuClose, 340);
  }

  menuToggle.addEventListener("click", () => {
    if (navigationDialog.open || dialog.open) return;
    pendingMenuDestination = null;
    window.clearTimeout(menuCloseTimer);
    navigationDialog.classList.remove("is-closing");
    positionNavigation();
    navigationDialog.showModal();
    menuToggle.setAttribute("aria-expanded", "true");
  });
  menuClose.addEventListener("click", () => requestMenuClose());
  navigationDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    requestMenuClose();
  });
  navigationDialog.addEventListener("animationend", (event) => {
    if (
      event.target === navigationDialog &&
      event.animationName === "menu-panel-out"
    )
      finishMenuClose();
  });
  navigationDialog.addEventListener("click", (event) => {
    if (event.target !== navigationDialog) return;
    const bounds = navigationDialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      requestMenuClose();
  });
  navigationDialog.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      const section = document.querySelector(hash);
      if (!section) return;
      event.preventDefault();
      requestMenuClose({ section, hash });
    });
  });
  navigationDialog.addEventListener("close", () => {
    window.clearTimeout(menuCloseTimer);
    menuCloseTimer = null;
    navigationDialog.classList.remove("is-closing");
    menuToggle.setAttribute("aria-expanded", "false");
    const destination = pendingMenuDestination;
    pendingMenuDestination = null;
    if (!destination) {
      menuToggle.focus({ preventScroll: true });
      return;
    }
    // Navigasi dilakukan sesudah dialog ditutup dan scroll halaman dibuka kembali.
    window.requestAnimationFrame(() => {
      const heading =
        destination.section.querySelector("h1, h2") || destination.section;
      if (!heading.hasAttribute("tabindex"))
        heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
      destination.section.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "start",
      });
      if (window.location.hash !== destination.hash)
        window.history.pushState(null, "", destination.hash);
      queuePageUpdate();
    });
  });
  window.addEventListener("resize", () => {
    if (navigationDialog.open) positionNavigation();
  });
  reducedMotion.addEventListener("change", () => {
    if (
      reducedMotion.matches &&
      navigationDialog.classList.contains("is-closing")
    )
      finishMenuClose();
  });
  configureExperience();
}

// Fokus keyboard menampilkan akses cepat secara utuh, tanpa menggulir wadah yang terpotong.
const quickAccess = document.querySelector(".device-services");
if (quickAccess && introScene && scenePin) {
  quickAccess.addEventListener("focusin", (event) => {
    if (openingButton === event.target) return;
    if (!sceneEnabled || !event.target.matches(":focus-visible")) return;
    const headerHeight = siteHeader?.offsetHeight || 0;
    const start =
      window.scrollY + introScene.getBoundingClientRect().top - headerHeight;
    const target =
      start + (introScene.offsetHeight - scenePin.offsetHeight) * 0.94;
    root.classList.add("focus-jump");
    scenePin.scrollTop = 0;
    window.scrollTo(0, target);
    updatePage();
    window.requestAnimationFrame(() => {
      // Fokus native dapat menyesuaikan scroll sesudah focusin; kembalikan adegan yang utuh.
      window.scrollTo(0, target);
      updatePage();
      root.classList.remove("focus-jump");
    });
  });
}

// Pencarian lokal berdasarkan kebutuhan; kueri tidak dikirim atau disimpan.
const catalogSearchForm = document.querySelector(".catalog-search");
const catalogSearchInput = document.querySelector("#service-search");
const catalogSearchStatus = document.querySelector("#catalog-search-status");
const catalogSearchEmpty = document.querySelector("#catalog-empty");
if (
  catalogSearchForm &&
  catalogSearchInput &&
  catalogSearchStatus &&
  catalogSearchEmpty &&
  catalogGrid &&
  catalogCards.length
) {
  const clearSearch = catalogSearchForm.querySelector(".catalog-search-clear");
  const resetSearch = catalogSearchEmpty.querySelector(".catalog-search-reset");
  const searchSection = catalogSearchForm.closest(".catalog-section");
  const searchIndex = {
    food: "f&b food drink makanan minuman makan minum konsumsi kuliner",
    print:
      "percetakan dokumen print fotokopi pengetikan cetak ketik tugas laporan",
    consignment: "konsinyasi titip jual produk barang mahasiswa",
    creative:
      "jasa kreatif desain design grafis fotografi foto videografi video visual logo poster",
  };
  function normalizeSearch(value) {
    return value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }
  function applyCatalogSearch() {
    const query = catalogSearchInput.value.trim().replace(/\s+/g, " ");
    const terms = normalizeSearch(query).split(" ").filter(Boolean);
    let count = 0;
    catalogCards.forEach((card) => {
      const words = normalizeSearch(
        searchIndex[card.dataset.gallery] || card.textContent,
      );
      const matches = terms.every((term) => words.includes(term));
      card.hidden = !matches;
      if (matches) count += 1;
    });
    if (terms.length) catalogGrid.classList.add("is-filtered");
    else catalogGrid.classList.remove("is-filtered");
    catalogSearchEmpty.hidden = count !== 0;
    if (clearSearch) clearSearch.hidden = catalogSearchInput.value.length === 0;
    const message = terms.length
      ? count + " unit ditemukan untuk “" + query + "”."
      : count + " unit usaha ditampilkan.";
    if (catalogSearchStatus.textContent !== message)
      catalogSearchStatus.textContent = message;
    configureGallery();
  }
  function clearCatalogSearch() {
    catalogSearchInput.value = "";
    applyCatalogSearch();
    catalogSearchInput.focus({ preventScroll: true });
  }
  catalogSearchForm.hidden = false;
  searchSection?.classList.add("search-ready");
  catalogSearchForm.addEventListener("submit", (event) =>
    event.preventDefault(),
  );
  catalogSearchInput.addEventListener("input", applyCatalogSearch);
  catalogSearchInput.addEventListener("search", applyCatalogSearch);
  catalogSearchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !catalogSearchInput.value) return;
    event.preventDefault();
    clearCatalogSearch();
  });
  clearSearch?.addEventListener("click", clearCatalogSearch);
  resetSearch?.addEventListener("click", clearCatalogSearch);
  applyCatalogSearch();
}
