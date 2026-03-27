document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
});
// Skills interactions: filter + search + details panel
(() => {
    const section = document.querySelector("#skills");
    if (!section) return;

    const filterButtons = Array.from(section.querySelectorAll("[data-skill-filter]"));
    const search = section.querySelector("#skillsSearch");
    const pills = Array.from(section.querySelectorAll(".skill-pill"));

    const titleEl = section.querySelector("#skillsSelectedTitle");
    const descEl = section.querySelector("#skillsSelectedDesc");
    const meterValueEl = section.querySelector("#skillsMeterValue");
    const meterFillEl = section.querySelector("#skillsMeterFill");

    const categoryLabel = (cat) =>
        ({
            technical: "Technical Skills",
            virtual: "Virtual Assistant Skills",
            tools: "Tools",
            soft: "Soft Skills",
        })[cat] || "Skills";

    const descriptionFor = (skill, cat) => {
        const base = {
            technical: "I use this to build clean, responsive, user-friendly interfaces.",
            virtual: "I use this to keep operations organized, consistent, and efficient.",
            tools: "I use this tool to plan, design, collaborate, and deliver work smoothly.",
            soft: "This helps me communicate clearly and solve problems proactively.",
        }[cat];

        return `${base} (${categoryLabel(cat)})`;
    };

    const engagementFor = (skill) => {
        let hash = 0;
        for (let i = 0; i < skill.length; i++) hash = (hash * 31 + skill.charCodeAt(i)) % 101;
        return Math.max(70, hash);
    };

    let activeFilter = "all";
    let activeQuery = "";

    const applyFilter = () => {
        const q = activeQuery.trim().toLowerCase();
        pills.forEach((pill) => {
            const cat = pill.dataset.category || "";
            const name = (pill.dataset.skill || pill.textContent || "").toLowerCase();
            const matchesFilter = activeFilter === "all" || cat === activeFilter;
            const matchesQuery = !q || name.includes(q);
            pill.classList.toggle("is-hidden", !(matchesFilter && matchesQuery));
        });
    };

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            activeFilter = btn.dataset.skillFilter || "all";
            filterButtons.forEach((b) => b.classList.toggle("chip-active", b === btn));
            applyFilter();
        });
    });

    if (search) {
        search.addEventListener("input", () => {
            activeQuery = search.value || "";
            applyFilter();
        });
    }

    pills.forEach((pill) => {
        pill.addEventListener("click", () => {
            const skill = pill.dataset.skill || pill.textContent || "Skill";
            const cat = pill.dataset.category || "all";

            pills.forEach((p) => p.classList.remove("is-selected"));
            pill.classList.add("is-selected");

            if (titleEl) titleEl.textContent = skill;
            if (descEl) descEl.textContent = descriptionFor(skill, cat);

            const value = engagementFor(skill);
            if (meterValueEl) meterValueEl.textContent = `${value}%`;
            if (meterFillEl) meterFillEl.style.width = `${value}%`;
        });
    });

    // Auto-select first visible skill for a lively feel
    applyFilter();
    const first = pills.find((p) => !p.classList.contains("is-hidden"));
    if (first) first.click();
})();


//work interactve section//
(() => {
    const section = document.querySelector("#work");
    if (!section) return;

    const filterButtons = Array.from(section.querySelectorAll("[data-work-filter]"));
    const cards = Array.from(section.querySelectorAll(".work-card"));
    const modalBackdrop = section.querySelector("#workModal");
    const modalTitle = section.querySelector("#workModalTitle");
    const modalDesc = section.querySelector("#workModalDesc");
    const modalKicker = section.querySelector("#workModalKicker");
    const closeBtn = section.querySelector(".modal-close");

    let activeFilter = "all";
    let lastFocused = null;

    const labelFor = (cat) =>
        ({
            web: "Web Design",
            va: "Virtual Assistant",
            robotics: "Robotics",
        })[cat] || "Project";

    const applyFilter = () => {
        cards.forEach((card) => {
            const cat = card.dataset.workCategory || "";
            const visible = activeFilter === "all" || cat === activeFilter;
            card.classList.toggle("is-hidden", !visible);
        });
    };

    const openModal = (card) => {
        if (!modalBackdrop) return;

        lastFocused = document.activeElement;

        const title = card.dataset.title || "Project";
        const desc = card.dataset.desc || "";
        const cat = card.dataset.workCategory || "";

        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalKicker) modalKicker.textContent = labelFor(cat);

        modalBackdrop.classList.remove("is-hidden");
        if (closeBtn) closeBtn.focus();
    };

    const closeModal = () => {
        if (!modalBackdrop) return;
        modalBackdrop.classList.add("is-hidden");
        if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    };

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            activeFilter = btn.dataset.workFilter || "all";
            filterButtons.forEach((b) => b.classList.toggle("chip-active", b === btn));
            applyFilter();
        });
    });

    cards.forEach((card) => {
        card.addEventListener("click", () => openModal(card));
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal(card);
            }
        });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", (e) => {
            if (e.target === modalBackdrop) closeModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalBackdrop && !modalBackdrop.classList.contains("is-hidden")) {
            closeModal();
        }
    });

    applyFilter();
})();