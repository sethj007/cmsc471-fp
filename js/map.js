// =============================================================================
// map.js — H3N2 Global Choropleth / Bubble Map
//
// Renders an interactive world map showing H3N2 influenza case counts by
// country and year.  Supports two display modes:
//   • Choropleth — countries filled with a YlOrRd color scale by case count
//   • Bubbles    — proportional circles centered on each country's centroid
//
// Also cross-highlights with the phylogenetic tree in tree.js.
// Depends on: D3 v7, TopoJSON, world-atlas (countries-110m.json), VIW_FNT.csv
// =============================================================================

// === COLOR SCALE ===
// Log scale so that countries with small counts are still visually distinct
// from neighbors with zero cases. Range runs from pale yellow to dark red.
const colorScale = d3.scaleSequentialLog()
    .interpolator(d3.interpolateYlOrRd);

// Tracks the current display mode ("choropleth" | "bubbles") for each
// map container by its DOM id. Updated by the toolbar toggle in scroll.js.
window._mapViewMode = {};

// =============================================================================
// Load world topology and flu surveillance data in parallel, then build
// all map-related functions once both are available.
// =============================================================================
Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
    d3.csv("data/VIW_FNT.csv")
]).then(([world, fluData]) => {

    // === AGGREGATE CASE COUNTS ===
    // Roll up AH3 (H3N2) case counts from the surveillance CSV into a flat
    // lookup object keyed by "ISO3-YEAR" (e.g. "USA-2015").
    const byCountryYear = {};
    fluData.forEach(d => {
        const year = +d.ISO_YEAR;
        const code = d.COUNTRY_CODE;
        const val = +d.AH3 || 0;
        // Skip rows with missing country, missing year, or zero cases
        if (!code || !year || val === 0) return;
        const key = `${code}-${year}`;
        byCountryYear[key] = (byCountryYear[key] || 0) + val;
    });

    // Calibrate the color scale domain to the global maximum case count
    const maxVal = d3.max(Object.values(byCountryYear));
    colorScale.domain([1, maxVal]);

    // Convert TopoJSON topology to GeoJSON feature collection
    const countries = topojson.feature(world, world.objects.countries);

    // === NUMERIC ID → ISO 3166-1 ALPHA-3 LOOKUP ===
    // The world-atlas TopoJSON encodes countries with numeric IDs (ISO 3166-1
    // numeric). This map converts those to alpha-3 codes used in VIW_FNT.csv.
    const idToISO3 = {
        4:"AFG",8:"ALB",12:"DZA",24:"AGO",32:"ARG",36:"AUS",40:"AUT",50:"BGD",
        56:"BEL",64:"BTN",68:"BOL",76:"BRA",100:"BGR",116:"KHM",120:"CMR",
        124:"CAN",152:"CHL",156:"CHN",170:"COL",188:"CRI",191:"HRV",192:"CUB",
        203:"CZE",208:"DNK",218:"ECU",818:"EGY",222:"SLV",231:"ETH",246:"FIN",
        250:"FRA",266:"GAB",276:"DEU",288:"GHA",300:"GRC",320:"GTM",332:"HTI",
        340:"HND",348:"HUN",356:"IND",360:"IDN",364:"IRN",368:"IRQ",372:"IRL",
        376:"ISR",380:"ITA",388:"JAM",392:"JPN",400:"JOR",398:"KAZ",404:"KEN",
        408:"PRK",410:"KOR",414:"KWT",418:"LAO",422:"LBN",430:"LBR",434:"LBY",
        440:"LTU",442:"LUX",484:"MEX",496:"MNG",504:"MAR",508:"MOZ",524:"NPL",
        528:"NLD",540:"NCL",554:"NZL",558:"NIC",566:"NGA",578:"NOR",586:"PAK",
        591:"PAN",604:"PER",608:"PHL",616:"POL",620:"PRT",630:"PRI",634:"QAT",
        642:"ROU",643:"RUS",682:"SAU",686:"SEN",694:"SLE",703:"SVK",705:"SVN",
        706:"SOM",710:"ZAF",724:"ESP",144:"LKA",736:"SDN",752:"SWE",756:"CHE",
        760:"SYR",762:"TJK",764:"THA",768:"TGO",780:"TTO",788:"TUN",792:"TUR",
        800:"UGA",804:"UKR",784:"ARE",826:"GBR",840:"USA",858:"URY",860:"UZB",
        862:"VEN",704:"VNM",887:"YEM",894:"ZMB",716:"ZWE",466:"MLI",
        854:"BFA",562:"NER",174:"COM",450:"MDG",454:"MWI",882:"WSM",
        51:"ARM",31:"AZE",112:"BLR",268:"GEO",417:"KGZ",795:"TKM",
    };

    // ==========================================================================
    // buildMap — creates (or recreates) the SVG world map inside a container.
    // Called on initial load and whenever the container is resized.
    // ==========================================================================

    /**
     * Builds the choropleth map SVG from scratch inside the specified container.
     * Clears any existing SVG first, then draws country paths, attaches hover
     * tooltips, and appends a colour legend.
     * Also resets the view-mode toggle to "choropleth".
     *
     * @param {string} [containerId="map"] - ID of the DOM element to render into.
     */
    window.buildMap = function(containerId = "map") {
        const containerEl = document.getElementById(containerId);
        if (!containerEl) return;

        const w = containerEl.clientWidth;
        const h = containerEl.clientHeight;
        // Guard: don't render into a zero-size container (e.g. hidden tab)
        if (!w || !h) return;

        // Clear any previously rendered map in this container
        d3.select(`#${containerId}`).selectAll("*").remove();

        const svg = d3.select(`#${containerId}`)
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        // Natural Earth projection scaled to fill the container
        const projection = d3.geoNaturalEarth1()
            .fitExtent([[0, 0], [w, h]], { type: "Sphere" });

        // Shift the projection slightly left to leave room for the legend
        const t = projection.translate();
        projection.translate([t[0] - 20, t[1]]);

        const path = d3.geoPath().projection(projection);
        const currentYear = +document.getElementById("yearSlider").value || 2010;

        // === DRAW COUNTRY PATHS ===
        svg.selectAll(".country")
            .data(countries.features)
            .join("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            // Fill with case-count color, or neutral grey if no data for this year
            .attr("fill", d => {
                const iso3 = idToISO3[+d.id];
                const val = byCountryYear[`${iso3}-${currentYear}`] || 0;
                return val > 0 ? colorScale(val) : "#c0c0c0";
            })
            // Tooltip on hover — shows country name, year, and case count
            .on("mouseover", function(event, d) {
                const iso3 = idToISO3[+d.id];
                const year = +document.getElementById("yearSlider").value;
                const val = byCountryYear[`${iso3}-${year}`] || 0;
                const countryName = d.properties?.name || iso3 || "Unknown";
                d3.select("#tooltip")
                    .style("display", "block")
                    .html(`
                        <div style="font-weight:bold;margin-bottom:4px;">${countryName}</div>
                        <div>📅 Year: ${year}</div>
                        <div>🦠 H3N2 cases: ${val > 0 ? val.toLocaleString() : "No data"}</div>
                    `);
                // Highlight border on hover
                d3.select(this).attr("stroke", "#333").attr("stroke-width", 1.5);
            })
            .on("mousemove", function(event) {
                // Track cursor for tooltip repositioning
                d3.select("#tooltip")
                    .style("left", (event.clientX + 12) + "px")
                    .style("top", (event.clientY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select("#tooltip").style("display", "none");
                // Restore default border style
                d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.5);
            });

        // === MAP LEGEND ===
        // A horizontal gradient bar at the bottom-left of the SVG with log-scale
        // tick labels, plus a small grey swatch for "No data".
        const legendWidth = 180;
        const legendHeight = 10;
        const legendX = 10;
        const legendY = h - 55;

        // Define a linear gradient for the legend bar using the same color stops
        // as the YlOrRd interpolator.
        const defs = svg.append("defs");
        const linearGradient = defs.append("linearGradient")
            .attr("id", `map-legend-gradient-${containerId}`);

        linearGradient.selectAll("stop")
            .data([
                { offset: "0%",   color: d3.interpolateYlOrRd(0.05) },
                { offset: "25%",  color: d3.interpolateYlOrRd(0.3)  },
                { offset: "60%",  color: d3.interpolateYlOrRd(0.65) },
                { offset: "100%", color: d3.interpolateYlOrRd(1)    }
            ])
            .join("stop")
            .attr("offset", d => d.offset)
            .attr("stop-color", d => d.color);

        svg.append("text")
            .attr("x", legendX)
            .attr("y", legendY - 6)
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("fill", "#333")
            .text("H3N2 Cases Reported");

        svg.append("rect")
            .attr("x", legendX)
            .attr("y", legendY)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .attr("rx", 3)
            .style("fill", `url(#map-legend-gradient-${containerId})`);

        // Log-scale axis below the gradient bar, with human-readable tick labels
        const legendScale = d3.scaleLog()
            .domain([1, maxVal])
            .range([0, legendWidth]);

        const tickValues = [1, 10, 100, 1000, 10000, 100000];
        const legendAxis = d3.axisBottom(legendScale)
            .tickValues(tickValues)
            .tickFormat(d => d >= 1000 ? d3.format(".0s")(d) : d) // e.g. "10k" for 10000
            .tickSize(4);

        svg.append("g")
            .attr("transform", `translate(${legendX}, ${legendY + legendHeight})`)
            .call(legendAxis)
            .call(g => g.select(".domain").remove())    // remove the axis baseline
            .call(g => g.selectAll("text")
                .attr("font-size", "9px")
                .attr("fill", "#666")
            )
            .call(g => g.selectAll("line")
                .attr("stroke", "#666")
            );

        // "No data" swatch — grey square + label
        svg.append("rect")
            .attr("x", legendX)
            .attr("y", legendY + legendHeight + 22)
            .attr("width", 12)
            .attr("height", 12)
            .attr("rx", 2)
            .attr("fill", "#c0c0c0");

        svg.append("text")
            .attr("x", legendX + 16)
            .attr("y", legendY + legendHeight + 32)
            .attr("font-size", "10px")
            .attr("fill", "#666")
            .text("No data");

        // Store map state on window._maps so other functions (showBubbles,
        // showChoropleth, updateYear, tree highlight) can access this instance.
        if (!window._maps) window._maps = {};
        window._maps[containerId] = { svg, path, projection, idToISO3, byCountryYear };

        // Reset to choropleth mode on every (re)build and sync the toolbar button
        window._mapViewMode[containerId] = "choropleth";
        document.querySelectorAll(".seg-btn[data-view]").forEach(b => {
            b.classList.toggle("active", b.dataset.view === "choropleth");
        });
    };

    // ==========================================================================
    // showBubbles — switches the map to proportional-symbol (bubble) mode.
    // Replaces filled country paths with circles scaled by case count.
    // ==========================================================================

    /**
     * Renders proportional circles over each country's geographic centroid,
     * sized by H3N2 case count for the specified year.
     * Country fills are set to transparent so the base map is still legible.
     *
     * @param {string} containerId - ID of the map container.
     * @param {number} [year]      - Year to display; defaults to the slider value.
     */
    window.showBubbles = function(containerId, year) {
        const mapData = window._maps[containerId];
        if (!mapData) return;
        year = year || +document.getElementById("yearSlider").value;

        // Remove any existing bubbles and clear country fill
        mapData.svg.selectAll(".bubble").remove();
        mapData.svg.selectAll(".country")
            .attr("fill", "none")
            .attr("stroke", "#666")
            .attr("stroke-width", 0.3)
            .style("pointer-events", "none"); // disable country hover while in bubble mode

        // Size bubbles using a square-root scale so area is proportional to count
        const bubbleMaxVal = d3.max(Object.values(byCountryYear));
        const bubbleScale = d3.scaleSqrt().domain([0, bubbleMaxVal]).range([0, 40]);

        // Build a data array: one entry per country with data, including its
        // projected centroid position for placement.
        const bubbleData = countries.features
            .map(d => {
                const iso3 = idToISO3[+d.id];
                const val = byCountryYear[`${iso3}-${year}`] || 0;
                if (val === 0) return null; // skip countries with no data
                const geoCenter = d3.geoCentroid(d);
                const centroid = mapData.projection(geoCenter);
                if (!centroid || isNaN(centroid[0])) return null; // skip off-projection centroids
                return { iso3, val, centroid, name: d.properties?.name || iso3 };
            })
            .filter(d => d !== null)
            .sort((a, b) => b.val - a.val); // draw largest bubbles first so small ones appear on top

        mapData.svg.selectAll(".bubble")
            .data(bubbleData)
            .join("circle")
            .attr("class", "bubble")
            .attr("cx", d => d.centroid[0])
            .attr("cy", d => d.centroid[1])
            .attr("r", d => bubbleScale(d.val))
            .attr("fill", "#377eb8")       // blue fill
            .attr("fill-opacity", 0.5)
            .attr("stroke", "#377eb8")
            .attr("stroke-width", 1)
            .on("mouseover", function(event, d) {
                d3.select("#tooltip")
                    .style("display", "block")
                    .html(`
                        <div style="font-weight:bold;margin-bottom:4px;">${d.name}</div>
                        <div>📅 Year: ${year}</div>
                        <div>🦠 H3N2 cases: ${d.val.toLocaleString()}</div>
                    `);
                d3.select(this).attr("fill-opacity", 0.8); // darken on hover
            })
            .on("mousemove", function(event) {
                d3.select("#tooltip")
                    .style("left", (event.clientX + 12) + "px")
                    .style("top", (event.clientY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select("#tooltip").style("display", "none");
                d3.select(this).attr("fill-opacity", 0.5);
            });
    };

    // ==========================================================================
    // showChoropleth — switches the map back to filled-country mode.
    // ==========================================================================

    /**
     * Resets the map to choropleth mode for the given year.
     * Removes any bubble circles and restores country fill colors.
     *
     * @param {string} containerId - ID of the map container.
     * @param {number} [year]      - Year to display; defaults to the slider value.
     */
    window.showChoropleth = function(containerId, year) {
        const mapData = window._maps[containerId];
        if (!mapData) return;
        year = year || +document.getElementById("yearSlider").value;

        mapData.svg.selectAll(".bubble").remove();
        mapData.svg.selectAll(".country")
            .attr("fill", d => {
                const iso3 = mapData.idToISO3[+d.id];
                const val = mapData.byCountryYear[`${iso3}-${year}`] || 0;
                return val > 0 ? colorScale(val) : "#c0c0c0";
            })
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .style("pointer-events", "all"); // re-enable hover events
    };

    // Build the initial map on page load
    window.buildMap("map");

    // === RESIZE OBSERVER ===
    // Rebuilds the map whenever the container size changes (e.g. browser resize,
    // panel collapse). Only rebuilds the map relevant to the currently active tab.
    const resizeObserver = new ResizeObserver(() => {
        const activeTab = document.querySelector(".tab.active")?.dataset.tab;
        if (activeTab === "map") window.buildMap("map");
        if (activeTab === "both") window.buildMap("map-both");
    });
    resizeObserver.observe(document.getElementById("map-container") || document.getElementById("map-view"));

    // ==========================================================================
    // updateYear — syncs the map (and tree) to a new year value.
    // Called by the year slider, the play button, and story-panel navigation.
    // ==========================================================================

    /**
     * Updates all active map instances and the phylogenetic tree to reflect
     * the given year. Also advances the story panel if the year crosses a
     * panel boundary.
     *
     * @param {number} year - Four-digit calendar year.
     */
    window.updateYear = function(year) {
        year = +year;
        d3.select("#yearLabel").text(year);
        document.getElementById("yearSlider").value = year;

        if (window._maps) {
            Object.entries(window._maps).forEach(([id, mapData]) => {
                const mode = window._mapViewMode?.[id] || "choropleth";

                if (mode === "bubbles") {
                    // Rebuild the bubble layer for the new year
                    window.showBubbles(id, year);
                } else {
                    // Update each country's fill color for the new year
                    mapData.svg.selectAll(".country")
                        .attr("fill", d => {
                            const iso3 = mapData.idToISO3[+d.id];
                            const val = mapData.byCountryYear[`${iso3}-${year}`] || 0;
                            return val > 0 ? colorScale(val) : "#c0c0c0";
                        });
                }
            });

            // === STORY PANEL AUTO-ADVANCE ===
            // Find the last story panel whose year is ≤ the current year and
            // activate it if it's not already the current one.
            const panels = document.querySelectorAll(".story-panel");
            let matchIndex = -1;
            panels.forEach((panel, i) => {
                if (+panel.dataset.year <= year) matchIndex = i;
            });
            if (matchIndex !== -1 && matchIndex !== currentStory) {
                currentStory = matchIndex;
                showStory(matchIndex);
            }
        }

        // Keep the tree in sync with the same year
        if (window.updateTree) window.updateTree(year);
    };

    // Wire the year slider to updateYear
    d3.select("#yearSlider").on("input", function() {
        window.updateYear(+this.value);
    });
});

// =============================================================================
// Cross-view highlight functions — called by tree.js on node hover/mouseout
// to dim all other countries and highlight the one matching the hovered strain.
// =============================================================================

/**
 * Dims all countries except the one with the given name, and thickens its
 * border to draw the viewer's eye while the tree node is hovered.
 *
 * @param {string} targetCountry - Country name as stored in GeoJSON properties.
 */
window.highlightMapCountry = function(targetCountry) {
    if (!window._maps) return;
    Object.values(window._maps).forEach(mapData => {
        mapData.svg.selectAll(".country")
            .transition().duration(150)
            .style("opacity", d => d.properties.name === targetCountry ? 1 : 0.1)
            .style("stroke", d => d.properties.name === targetCountry ? "#000" : "#fff");
    });
};

/**
 * Restores all countries to full opacity and default stroke after a tree
 * node hover ends.
 */
window.clearMapHighlight = function() {
    if (!window._maps) return;
    Object.values(window._maps).forEach(mapData => {
        mapData.svg.selectAll(".country")
            .transition().duration(150)
            .style("opacity", 1)
            .style("fill", null)   // revert to the attribute-set fill color
            .style("stroke", "#fff");
    });
};
