// === TABS ===
const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");

const contextTitles = {
    intro: { title: "Welcome to FluLines", desc: "An interactive exploration of H3N2 influenza evolution and global spread from 2008 to 2026." },
    tree: { title: "The H3N2 Family Tree", desc: "Explore how H3N2 strains evolved and diverged over time. Each branch represents a lineage; each dot a sequenced sample." },
    map: { title: "Global H3N2 Activity", desc: "See where H3N2 was circulating year by year. Deeper red = more reported cases." },
    both: { title: "Evolution Meets Geography", desc: "Watch how evolutionary branching connects to global spread. Both views respond to the timeline below." }
};

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.dataset.tab;

        const treeContainer = document.getElementById("tree-container");
        const treeAxisEl = document.getElementById("tree-axis");
        const treeEl = document.getElementById("tree");

        if (treeContainer && !treeContainer.contains(treeEl)) {
            treeEl.style.transform = "";
            treeAxisEl.style.transform = "";
            treeContainer.appendChild(treeAxisEl);
            treeContainer.appendChild(treeEl);
        }

        views.forEach(v => {
            v.classList.remove("active");
            if (v.id === `${target}-view`) v.classList.add("active");
        });

        const ctx = contextTitles[target];
        document.getElementById("context-title").textContent = ctx.title;
        document.getElementById("context-desc").textContent = ctx.desc;

        if (target === "map") {
            setTimeout(() => window.buildMap("map"), 50);
        } else if (target === "both") {
            setTimeout(() => {
                window.buildMap("map-both");

                const treeBoth = document.getElementById("both-tree");
                treeBoth.innerHTML = "";
                treeBoth.appendChild(treeAxisEl);
                treeBoth.appendChild(treeEl);

                requestAnimationFrame(() => {
                    const container = document.getElementById("both-tree-container");
                    const containerWidth = container.clientWidth;
                    const scale = (containerWidth / 2500) * 1.08;

                    treeEl.style.transform = `scale(${scale})`;
                    treeEl.style.transformOrigin = "top left";
                    treeAxisEl.style.transform = `scale(${scale})`;
                    treeAxisEl.style.transformOrigin = "top left";

                    const currentYear = +document.getElementById("yearSlider").value;
                    if (window.updateTree) window.updateTree(currentYear);
                });
            }, 100);
        }
    });
});

// === STORY PANELS ===
const storyPanels = document.querySelectorAll(".story-panel");
const storyCounter = document.getElementById("story-counter");
let currentStory = 0;

function showStory(index) {
    storyPanels.forEach(p => p.classList.remove("active"));
    storyPanels[index].classList.add("active");
    storyCounter.textContent = `${index + 1} / ${storyPanels.length}`;
    const year = +storyPanels[index].dataset.year;
    document.getElementById("yearSlider").value = year;
    document.getElementById("yearLabel").textContent = year;
    if (window.updateYear) window.updateYear(year);
}

document.getElementById("story-prev").addEventListener("click", () => {
    if (currentStory > 0) { currentStory--; showStory(currentStory); }
});

document.getElementById("story-next").addEventListener("click", () => {
    if (currentStory < storyPanels.length - 1) { currentStory++; showStory(currentStory); }
});

// === LEGEND ===
const legendContainer = document.getElementById("legend-items");

const legendRegions = {
    "North America": "#e41a1c",
    "South America": "#ff7f00",
    "Europe": "#4daf4a",
    "Asia": "#377eb8",
    "Africa": "#984ea3",
    "Oceania": "#a65628",
};
const activeRegions = new Set(Object.keys(legendRegions));

Object.entries(legendRegions).forEach(([region, color]) => {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `<div class="legend-dot" style="background:${color}"></div><span>${region}</span>`;
    item.addEventListener("click", () => {
        if (activeRegions.has(region)) {
            activeRegions.delete(region);
            item.classList.add("inactive");
        } else {
            activeRegions.add(region);
            item.classList.remove("inactive");
        }
        if (window.applyRegionFilter) window.applyRegionFilter(activeRegions);
    });
    legendContainer.appendChild(item);
});

// === INTRO CTA BUTTONS ===
function switchToTree() {
    tabs.forEach(t => t.classList.remove("active"));
    document.querySelector(".tab[data-tab='tree']").classList.add("active");
    views.forEach(v => v.classList.remove("active"));
    document.getElementById("tree-view").classList.add("active");
    document.getElementById("context-title").textContent = contextTitles.tree.title;
    document.getElementById("context-desc").textContent = contextTitles.tree.desc;
}

document.getElementById("intro-start-btn")?.addEventListener("click", switchToTree);
document.getElementById("intro-end-btn")?.addEventListener("click", switchToTree);

// === DENSITY / COLLAPSED TOOLBAR ===
document.querySelectorAll(".seg-btn[data-density]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".seg-btn[data-density]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const mode = btn.dataset.density;
        if (mode === "tips" && window.showAllTipsView) window.showAllTipsView();
        else if (mode === "density" && window.showDensityView) window.showDensityView();
        else if (mode === "collapsed" && window.showCollapsedView) window.showCollapsedView();
    });
});

// === COLOR BY TOOLBAR ===
document.querySelectorAll(".seg-btn[data-color]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".seg-btn[data-color]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        if (window.setColorMode) window.setColorMode(btn.dataset.color);
    });
});

// === MAP VIEW TOGGLE (Choropleth / Bubbles) ===
document.querySelectorAll(".seg-btn[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".seg-btn[data-view]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const mode = btn.dataset.view;
        const year = +document.getElementById("yearSlider").value;

        // Determine which map is active
        const activeTab = document.querySelector(".tab.active")?.dataset.tab;
        const containerId = activeTab === "both" ? "map-both" : "map";

        if (!window._mapViewMode) window._mapViewMode = {};
        window._mapViewMode[containerId] = mode;

        if (mode === "bubbles" && window.showBubbles) {
            window.showBubbles(containerId, year);
        } else if (mode === "choropleth" && window.showChoropleth) {
            window.showChoropleth(containerId, year);
        }
    });
});

// === SPEED CONTROLS ===
let playSpeed = 1;
document.querySelectorAll(".speed-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".speed-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        playSpeed = +btn.dataset.speed;
        if (playing) {
            clearInterval(playInterval);
            startPlay();
        }
    });
});

// === RESET ===
document.getElementById("reset-btn").addEventListener("click", () => {
    clearInterval(playInterval);
    playing = false;
    document.getElementById("play-btn").textContent = "▶";
    document.getElementById("yearSlider").value = 2008;
    document.getElementById("yearLabel").textContent = 2008;
    if (window.updateYear) window.updateYear(2008);
});

// === COLLAPSIBLE CONTEXT PANEL ===
const contextPanel = document.getElementById("context-panel");
const collapseBtn = document.getElementById("context-collapse-btn");

if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
        contextPanel.classList.toggle("collapsed");
        collapseBtn.textContent = contextPanel.classList.contains("collapsed") ? "›" : "‹";
    });
}

// === TIMELINE / PLAY ===
const playBtn = document.getElementById("play-btn");
const yearSlider = document.getElementById("yearSlider");
let playing = false;
let playInterval = null;

function startPlay() {
    const baseInterval = 800;
    playInterval = setInterval(() => {
        let year = +yearSlider.value
        if (year >= 2026) {
            clearInterval(playInterval);
            playing = false;
            playBtn.textContent = "▶";
            return;
        }
        year++
        yearSlider.value = year
        document.getElementById("yearLabel").textContent = year
        if (window.updateYear){
            window.updateYear(year);
        }
    }, baseInterval / playSpeed);
}

playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.textContent = playing ? "⏸" : "▶";
    if (playing) {
        startPlay();
    } else {
        clearInterval(playInterval);
    }
});

yearSlider.addEventListener("input", function () {
    document.getElementById("yearLabel").textContent = this.value;
    if (window.updateYear) window.updateYear(+this.value);
});