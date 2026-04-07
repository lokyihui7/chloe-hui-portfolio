const data = window.PORTFOLIO_DATA;

function createEl(tag, className, html) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (html !== undefined) el.innerHTML = html;
  return el;
}

function createImage(src, alt, className = "") {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.className = className;
  img.loading = "lazy";
  return img;
}

function createLink(href, label, className = "pill-link") {
  const link = document.createElement("a");
  link.href = href;
  link.className = className;
  link.textContent = label;
  if (/^https?:\/\//.test(href)) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }
  return link;
}

function createCarouselButton(direction, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `media-carousel__arrow media-carousel__arrow--${direction}`;
  button.setAttribute("aria-label", label);
  const icon = createEl(
    "span",
    "media-carousel__arrow-icon",
    direction === "prev" ? "&#8249;" : "&#8250;"
  );
  button.appendChild(icon);
  return button;
}

function createSectionCarousel(section, projectTitle) {
  const carousel = createEl("div", "media-carousel media-carousel--section");
  const prevButton = createCarouselButton("prev", `Show previous ${projectTitle} ${section.label} image`);
  const nextButton = createCarouselButton("next", `Show next ${projectTitle} ${section.label} image`);
  const viewport = createEl("div", "media-carousel__viewport");
  let activeIndex = 0;

  const panels = section.images.map((src, index) => {
    const panel = createEl("div", `media-section__panel${index === 0 ? " is-active" : ""}`);
    const figure = createEl(
      "figure",
      `project-card__figure${section.fit === "contain" ? " project-card__figure--contain" : ""}`
    );
    figure.appendChild(
      createImage(
        src,
        `${projectTitle} ${section.label} ${index + 1}`,
        `project-card__image${section.fit === "contain" ? " project-card__image--contain" : ""}`
      )
    );
    panel.appendChild(figure);
    viewport.appendChild(panel);
    return panel;
  });

  const updateCarousel = () => {
    panels.forEach((panel, index) => {
      panel.classList.toggle("is-active", index === activeIndex);
    });
  };

  prevButton.addEventListener("click", () => {
    activeIndex = (activeIndex - 1 + panels.length) % panels.length;
    updateCarousel();
  });

  nextButton.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % panels.length;
    updateCarousel();
  });

  updateCarousel();
  carousel.appendChild(prevButton);
  carousel.appendChild(viewport);
  carousel.appendChild(nextButton);
  return carousel;
}

function renderHome() {
  const about = document.getElementById("about-copy");
  const categories = document.getElementById("category-grid");
  const selected = document.getElementById("selected-work-grid");
  const designGallery = document.getElementById("selected-design-grid");

  if (about) {
    data.profile.about.forEach((paragraph) => {
      about.appendChild(createEl("p", "", paragraph));
    });
  }

  if (categories) {
    data.categories.forEach((category) => {
      const card = createEl("article", "category-card");
      const media = createEl("a", "category-card__media");
      media.href = category.href;
      media.appendChild(createImage(category.cover, category.name, "category-card__image"));

      const overlay = createEl("div", "category-card__overlay");
      overlay.appendChild(createEl("span", "category-card__label", category.name));
      media.appendChild(overlay);

      const body = createEl("div", "category-card__body");
      body.appendChild(createEl("p", "eyebrow", category.name));
      body.appendChild(createEl("p", "category-card__blurb", category.blurb));
      body.appendChild(createLink(category.href, "Open category"));

      card.appendChild(media);
      card.appendChild(body);
      categories.appendChild(card);
    });
  }

  if (selected) {
    data.selectedWorks.forEach((work) => {
      const card = createEl("article", "feature-card");
      card.appendChild(createEl("div", "feature-card__number", work.number));

      const media = createEl("div", "feature-card__media");
      media.appendChild(createImage(work.image, work.title, "feature-card__image"));

      const content = createEl("div", "feature-card__content");
      content.appendChild(createEl("p", "eyebrow", work.category));
      content.appendChild(createEl("h3", "", work.title));
      content.appendChild(createEl("p", "", work.description));
      content.appendChild(createLink(work.href, "View more"));

      card.appendChild(media);
      card.appendChild(content);
      selected.appendChild(card);
    });
  }

  if (designGallery) {
    data.selectedDesignGallery.forEach((src, index) => {
      const item = createEl("div", "mosaic-card");
      item.appendChild(createImage(src, `Selected design ${index + 1}`, "mosaic-card__image"));
      designGallery.appendChild(item);
    });
  }
}

function renderCategoryPage(pageKey) {
  const pageData = data[pageKey];
  if (!pageData) return;

  const intro = document.getElementById("page-intro");
  const projects = document.getElementById("projects");
  const gallery = document.getElementById("gallery");
  const hero = document.getElementById("page-hero-title");

  if (hero) hero.textContent = pageData.hero;
  if (intro) intro.textContent = pageData.intro;

  if (projects) {
    pageData.projects.forEach((project) => {
      const article = createEl("article", "project-card");
      const summary = createEl("div", "project-card__summary");
      summary.appendChild(createEl("p", "eyebrow", project.type || project.subtitle || pageData.hero));
      summary.appendChild(createEl("h2", "", project.title));

      if (project.materials) {
        summary.appendChild(createEl("p", "meta-line", `<strong>Material:</strong> ${project.materials}`));
      }
      if (project.tool) {
        summary.appendChild(createEl("p", "meta-line", `<strong>Development software:</strong> ${project.tool}`));
      }
      if (project.motivation) {
        summary.appendChild(createEl("p", "", project.motivation));
      }
      if (project.story) {
        summary.appendChild(createEl("p", "", project.story));
      }
      (project.description || []).forEach((paragraph) => {
        summary.appendChild(createEl("p", "", paragraph));
      });

      if (project.details && project.details.length) {
        const list = createEl("ul", "detail-list");
        project.details.forEach((detail) => {
          const item = document.createElement("li");
          item.textContent = detail;
          list.appendChild(item);
        });
        summary.appendChild(list);
      }

      if (project.notes && project.notes.length) {
        const noteWrap = createEl("div", "tag-row");
        project.notes.forEach((note) => {
          noteWrap.appendChild(createEl("span", "tag", note));
        });
        summary.appendChild(noteWrap);
      }

      const actions = createEl("div", "button-row");
      if (project.link) actions.appendChild(createLink(project.link, "Open Figma"));
      if (project.extraLink) actions.appendChild(createLink(project.extraLink, "Watch demo"));
      if (project.links) {
        project.links.forEach((link) => actions.appendChild(createLink(link.href, link.label)));
      }
      if (actions.children.length) summary.appendChild(actions);

      const media = createEl("div", "project-card__gallery");
      if (project.mediaSections && project.mediaSections.length) {
        media.classList.add("project-card__gallery--sections");
        if (project.mediaSectionsLayout === "stacked-carousels") {
          media.classList.add("project-card__gallery--stacked-sections");
        }
        const sectionCount = project.mediaSections.length;
        const useStackedSectionCarousels = project.mediaSectionsLayout === "stacked-carousels";
        const useCarousel = !useStackedSectionCarousels && sectionCount > 1;
        const carousel = useCarousel ? createEl("div", "media-carousel") : null;
        const prevButton = useCarousel ? createCarouselButton("prev", `Show previous ${project.title} image group`) : null;
        const nextButton = useCarousel ? createCarouselButton("next", `Show next ${project.title} image group`) : null;
        const viewport = createEl("div", useCarousel ? "media-carousel__viewport" : "media-stack");
        let activeIndex = 0;

        const panels = project.mediaSections.map((section, sectionIndex) => {
          const block = createEl(
            "section",
            `media-section${!useCarousel || sectionIndex === 0 ? " is-active" : ""}`
          );
          block.dataset.index = String(sectionIndex);
          block.appendChild(createEl("p", "media-section__label", section.label));

          const blockGallery = createEl(
            "div",
            `media-section__grid${section.images.length === 1 ? " media-section__grid--single" : ""}`
          );

          if (useStackedSectionCarousels && section.images.length > 1) {
            block.appendChild(createSectionCarousel(section, project.title));
          } else {
            section.images.forEach((src, index) => {
              const figure = createEl(
                "figure",
                `project-card__figure${section.fit === "contain" ? " project-card__figure--contain" : ""}`
              );
              figure.appendChild(
                createImage(
                  src,
                  `${project.title} ${section.label} ${index + 1}`,
                  `project-card__image${section.fit === "contain" ? " project-card__image--contain" : ""}`
                )
              );
              blockGallery.appendChild(figure);
            });

            block.appendChild(blockGallery);
          }
          viewport.appendChild(block);
          return block;
        });

        if (useCarousel) {
          const updateCarousel = () => {
            panels.forEach((panel, index) => {
              panel.classList.toggle("is-active", index === activeIndex);
            });
          };

          prevButton.addEventListener("click", () => {
            activeIndex = (activeIndex - 1 + panels.length) % panels.length;
            updateCarousel();
          });

          nextButton.addEventListener("click", () => {
            activeIndex = (activeIndex + 1) % panels.length;
            updateCarousel();
          });

          updateCarousel();
          carousel.appendChild(prevButton);
          carousel.appendChild(viewport);
          carousel.appendChild(nextButton);
          media.appendChild(carousel);
        } else {
          media.appendChild(viewport);
        }
      } else {
        if ((project.images || []).length === 1) {
        media.classList.add("project-card__gallery--single");
        }
        if (project.imageLayout === "stack") {
          media.classList.add("project-card__gallery--stack");
        }
        (project.images || []).forEach((src, index) => {
          const figure = createEl("figure", "project-card__figure");
          if (project.imageFit === "contain") {
            figure.classList.add("project-card__figure--contain");
          }
          figure.appendChild(
            createImage(
              src,
              `${project.title} ${index + 1}`,
              `project-card__image${project.imageFit === "contain" ? " project-card__image--contain" : ""}`
            )
          );
          media.appendChild(figure);
        });
      }

      article.appendChild(summary);
      article.appendChild(media);
      projects.appendChild(article);
    });
  }

  if (gallery && pageData.gallery) {
    pageData.gallery.forEach((src, index) => {
      const item = createEl("div", "gallery-wall__item");
      item.appendChild(createImage(src, `${pageData.hero} gallery ${index + 1}`, "gallery-wall__image"));
      gallery.appendChild(item);
    });
  }
}

function setActiveTopNav() {
  const bodyPage = document.body.dataset.page;
  if (bodyPage === "home") return;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === bodyPage) {
      link.classList.add("is-active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  setActiveTopNav();

  if (page === "home") {
    renderHome();
  } else {
    renderCategoryPage(page);
  }
});
