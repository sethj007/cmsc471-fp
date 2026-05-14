// =============================================================================
// scroll.js — UI Controller (Tabs, Story Panels, Toolbar, Timeline)
//
// Manages all interactive UI elements that sit outside the D3 visualizations:
//   • Tab switching between the Intro, Tree, Map, and Both views
//   • Story panel navigation (prev/next with year sync)
//   • Region legend with click-to-filter behavior
//   • Density / collapsed / tips toolbar toggle
//   • Color-by toolbar toggle
//   • Map view-mode toggle (choropleth ↔ bubbles)
//   • Play/pause and reset for the year timeline slider
//   • Collapsible context panel
//   • Intro CTA and Data button routing
// =============================================================================

// === TABS ===
const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");

// Descriptive text shown in the context panel for each tab
const contextTitles = {
    intro: { title: "Welcome to FluLines", desc: "An interactive exploration of H3N2 influenza evolution and global spread from 2008 to 2026." },
    tree:  { title: "The H3N2 Family Tree", desc: "Explore how H3N2 strains evolved and diverged over time. Each branch represents a lineage; each dot a sequenced sample." },
    map:   { title: "Global H3N2 Activity", desc: "See where H3N2 was circulating year by year. Deeper red = more reported cases." },
    both:  { title: "Evolution Meets Geography", desc: "Watch how evolutionary branching connects to global spread. Both views respond to the timeline below." }
};

// Wire each tab button so clicking it shows the corresponding view panel,
// updates the context text, and triggers any view-specific initialization.
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // Deactivate all tabs, then mark the clicked one active
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.dataset.tab;

        // --- Move the shared tree SVG elements back to their default container ---
        // The tree <svg> and its axis are physically relocated into the "both"
        // container when the split view is active; this block moves them back
        // to the standalone tree container before switching to any other view.
        const treeContainer = document.getElementById("tree-container");
        const treeAxisEl    = document.getElementById("tree-axis");
        const treeEl        = document.getElementById("tree");

        if (treeContainer && !treeContainer.contains(treeEl)) {
            // Reset any CSS transforms applied for the split-view scaling
            treeEl.style.transform = "";
            treeAxisEl.style.transform = "";

            // Restore axis label font sizes to their default
            treeAxisEl.querySelectorAll("text").forEach(t => {
                t.style.fontSize = "11px";
                t.style.fontWeight = "";
            });

            treeContainer.appendChild(treeAxisEl);
            treeContainer.appendChild(treeEl);

            // Reset D3 zoom/pan state so the tree starts centered
            if (window.resetZoom) {
                window.resetZoom();
            }
        }

        // Show only the view panel that matches the clicked tab
        views.forEach(v => {
            v.classList.remove("active");
            if (v.id === `${target}-view`) v.classList.add("active");
        });

        // Update the context panel title and description
        const ctx = contextTitles[target];
        if (ctx) {
            document.getElementById("context-title").textContent = ctx.title;
            document.getElementById("context-desc").textContent  = ctx.desc;
        }

        if (target === "map") {
            // Rebuild the standalone map after a brief delay to allow the
            // container to become visible and acquire its dimensions
            setTimeout(() => window.buildMap("map"), 50);

        } else if (target === "both") {
            // Build the split-view map AND re-parent the tree SVG elements
            // into the "both" layout, scaling them to fit the narrower column.
            setTimeout(() => {
                window.buildMap("map-both");

                const treeBoth = document.getElementById("both-tree");
                treeBoth.innerHTML = "";
                treeBoth.appendChild(treeAxisEl);
                treeBoth.appendChild(treeEl);

                requestAnimationFrame(() => {
                    // Apply a CSS scale transform so the full-width tree fits
                    // into the half-width split-view column.
                    treeEl.style.transform      = `scale(${scale})`;
                    treeEl.style.transformOrigin = "top left";
                    treeAxisEl.style.transform      = `scale(${scale})`;
                    treeAxisEl.style.transformOrigin = "top left";

                    // Reset D3 zoom before applying the custom CSS scale
                    if (window.resetZoom) {
                        window.resetZoom();
                    }

                    // Recompute the scale based on the actual container width
                    const container     = document.getElementById("both-tree-container");
                    const containerWidth = container.clientWidth;
                    const scale = (containerWidth / 2500) * 1.08;

                    // Rebuild the time axis ticks to match the new scale
                    const axisG = d3.select(treeAxisEl).select("g");
                    axisG.call(createXAxis(scale));

                    // Counter-scale the axis text so labels remain legible
                    // despite the parent element being scaled down
                    axisText.forEach(t => {
                        t.style.transform      = `scale(${1 / scale})`;
                        t.style.transformOrigin = "left center";
                    });

                    // Sync the tree to the current slider year
                    const currentYear = +document.getElementById("yearSlider").value;
                    if (window.updateTree) window.updateTree(currentYear);
                });
            }, 100);
        }
    });
});

// =============================================================================
// STORY PANELS
// Sequentially narrated panels that each map to a specific year. Navigated
// via prev/next buttons; also auto-advances when the year slider crosses a
// panel's year boundary (see updateYear in map.js).
// =============================================================================

const storyPanels  = document.querySelectorAll(".story-panel");
const storyCounter = document.getElementById("story-counter");
let currentStory = 0; // index of the currently displayed panel

/**
 * Displays a story panel by index, updates the counter, and syncs the year
 * slider + map/tree to that panel's data-year attribute.
 *
 * @param {number} index - Zero-based index into storyPanels.
 */
function showStory(index) {
    storyPanels.forEach(p => p.classList.remove("active"));
    storyPanels[index].classList.add("active");
    storyCounter.textContent = `${index + 1} / ${storyPanels.length}`;

    // Drive the year slider and all visualizations to the panel's year
    const year = +storyPanels[index].dataset.year;
    document.getElementById("yearSlider").value = year;
    document.getElementById("yearLabel").textContent = year;
    if (window.updateYear) window.updateYear(year);
}

// Previous / next story panel buttons
document.getElementById("story-prev").addEventListener("click", () => {
    if (currentStory > 0) { currentStory--; showStory(currentStory); }
});
document.getElementById("story-next").addEventListener("click", () => {
    if (currentStory < storyPanels.length - 1) { currentStory++; showStory(currentStory); }
});

// =============================================================================
// REGION LEGEND
// Clicking a legend item toggles that region's visibility in the tree.
// The same set of regions is rendered in both the tree-only and split-view
// containers, sharing the same activeRegions Set.
// =============================================================================

const legendContainer = document.getElementById("legend-items");

// Color palette — must match regionColors in tree.js
const legendRegions = {
    "North America": "#e41a1c", "South America": "#ff7f00", "Europe": "#4daf4a",
    "Asia": "#377eb8", "Africa": "#984ea3", "Oceania": "#a65628",
};

// All regions start visible
const activeRegions = new Set(Object.keys(legendRegions));

/**
 * Creates a coloured-dot legend item for a region and appends it to a container.
 * Clicking the item toggles the region in/out of activeRegions and fires
 * applyRegionFilter (defined in tree.js) to update node/link visibility.
 *
 * @param {string} region - Region label string.
 * @param {string} color  - Hex color for the dot.
 * @param {Element} container - DOM element to append the item to.
 */
function buildLegendItem(region, color, container) {
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `<div class="legend-dot" style="background:${color}"></div><span>${region}</span>`;
    item.addEventListener("click", () => {
        if (activeRegions.has(region)) {
            activeRegions.delete(region);
            item.classList.add("inactive");   // visual dim
        } else {
            activeRegions.add(region);
            item.classList.remove("inactive");
        }
        if (window.applyRegionFilter) window.applyRegionFilter(activeRegions);
    });
    container.appendChild(item);
}

// Populate legend in the tree-only panel
Object.entries(legendRegions).forEach(([region, color]) => {
    buildLegendItem(region, color, legendContainer);
});

// Populate legend in the split (both) panel — same logic, separate DOM nodes
const legendContainerBoth = document.getElementById("legend-items-both");
Object.entries(legendRegions).forEach(([region, color]) => {
    buildLegendItem(region, color, legendContainerBoth);
});

// =============================================================================
// INTRO CTA BUTTONS
// =============================================================================

/**
 * Activates the Tree tab, mirroring a tab click.
 * Used by the "Explore the Tree" button(s) on the intro screen.
 */
function switchToTree() {
    tabs.forEach(t => t.classList.remove("active"));
    document.querySelector(".tab[data-tab='tree']").classList.add("active");
    views.forEach(v => v.classList.remove("active"));
    document.getElementById("tree-view").classList.add("active");
    document.getElementById("context-title").textContent = contextTitles.tree.title;
    document.getElementById("context-desc").textContent  = contextTitles.tree.desc;
}

document.getElementById("intro-start-btn")?.addEventListener("click", switchToTree);
document.getElementById("intro-end-btn")?.addEventListener("click", switchToTree);

// "Data" button — switches to the intro tab and smooth-scrolls to the data
// section so the user can read about sources and methodology.
document.getElementById("btn-data")?.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    document.querySelector(".tab[data-tab='intro']").classList.add("active");
    views.forEach(v => v.classList.remove("active"));
    document.getElementById("intro-view").classList.add("active");
    document.getElementById("context-title").textContent = contextTitles.intro.title;
    document.getElementById("context-desc").textContent  = contextTitles.intro.desc;
    setTimeout(() => {
        const target = document.getElementById("intro-data-section");
        if (target) target.scrollIntoView({ behavior: "smooth" });
    }, 50);
});

// =============================================================================
// DENSITY / COLLAPSED TOOLBAR
// Three mutually exclusive view modes for the phylogenetic tree.
// =============================================================================
document.querySelectorAll(".seg-btn[data-density]").forEach(btn => {
    btn.addEventListener("click", () => {
        // Deactivate siblings, activate the clicked button
        document.querySelectorAll(".seg-btn[data-density]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const mode = btn.dataset.density;
        // Dispatch to the appropriate tree-view function defined in tree.js
        if (mode === "tips"      && window.showAllTipsView)   window.showAllTipsView();
        else if (mode === "density"   && window.showDensityView)   window.showDensityView();
        else if (mode === "collapsed" && window.showCollapsedView) window.showCollapsedView();
    });
});

// =============================================================================
// COLOR BY TOOLBAR
// Switches node/link coloring between "region" and "clade" modes.
// =============================================================================
document.querySelectorAll(".seg-btn[data-color]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".seg-btn[data-color]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        if (window.setColorMode) window.setColorMode(btn.dataset.color);
    });
});

// =============================================================================
// MAP VIEW TOGGLE
// Switches between choropleth and bubble map modes for the currently active
// map container (either "map" or "map-both" depending on the active tab).
// =============================================================================
document.querySelectorAll(".seg-btn[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".seg-btn[data-view]").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const mode = btn.dataset.view;
        const year = +document.getElementById("yearSlider").value;

        // Determine which map container is currently visible
        const activeTab   = document.querySelector(".tab.active")?.dataset.tab;
        const containerId = activeTab === "both" ? "map-both" : "map";

        // Persist the mode so updateYear knows how to refresh this container
        if (!window._mapViewMode) window._mapViewMode = {};
        window._mapViewMode[containerId] = mode;

        if (mode === "bubbles"    && window.showBubbles)    window.showBubbles(containerId, year);
        else if (mode === "choropleth" && window.showChoropleth) window.showChoropleth(containerId, year);
    });
});

// =============================================================================
// RESET BUTTON
// Stops playback, resets the year slider to 2008, and resets the tree zoom.
// =============================================================================
document.getElementById("reset-btn").addEventListener("click", () => {
    clearInterval(playInterval);
    playing = false;
    document.getElementById("play-btn").textContent = "▶";
    document.getElementById("yearSlider").value = 2008;
    document.getElementById("yearLabel").textContent = 2008;
    if (window.updateYear) window.updateYear(2008);
    if (window.resetZoom)  window.resetZoom();
});

// =============================================================================
// COLLAPSIBLE CONTEXT PANEL
// The side panel (title + description) can be collapsed to maximize chart space.
// =============================================================================
const contextPanel  = document.getElementById("context-panel");
const collapseBtn   = document.getElementById("context-collapse-btn");
if (collapseBtn) {
    collapseBtn.addEventListener("click", () => {
        contextPanel.classList.toggle("collapsed");
        // Toggle the arrow direction: › when collapsed, ‹ when expanded
        collapseBtn.textContent = contextPanel.classList.contains("collapsed") ? "›" : "‹";
    });
}

// =============================================================================
// TIMELINE / PLAY
// Animates the year slider forward at ~600 ms per year, updating the map and
// tree on each step. Stops automatically when the slider reaches 2026.
// =============================================================================

const playBtn    = document.getElementById("play-btn");
const yearSlider = document.getElementById("yearSlider");
let playing      = false;  // current playback state
let playInterval = null;   // setInterval handle so we can clear it on pause/reset

/**
 * Starts the auto-play interval. Increments the year slider once per 600 ms,
 * calls updateYear each step, and stops at year 2026.
 */
function startPlay() {
    playInterval = setInterval(() => {
        let year = +yearSlider.value;
        if (year >= 2026) {
            // Reached the end — stop playback automatically
            clearInterval(playInterval);
            playing = false;
            playBtn.textContent = "▶";
            return;
        }
        year++;
        yearSlider.value = year;
        document.getElementById("yearLabel").textContent = year;
        if (window.updateYear) window.updateYear(year);
    }, 600);
}

// Toggle play/pause on button click
playBtn.addEventListener("click", () => {
    playing = !playing;
    playBtn.textContent = playing ? "⏸" : "▶";
    if (playing) startPlay();
    else clearInterval(playInterval);
});

// Direct slider interaction — update visualizations immediately when the user
// drags the slider manually (overrides any active playback display).
yearSlider.addEventListener("input", function() {
    document.getElementById("yearLabel").textContent = this.value;
    if (window.updateYear) window.updateYear(+this.value);
});
