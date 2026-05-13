// === COLOR SCALE ===
const colorScale = d3.scaleSequentialLog()
    .interpolator(d3.interpolateYlOrRd);

// === LOAD DATA ===
Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
    d3.csv("data/VIW_FNT.csv")
]).then(([world, fluData]) => {

    const byCountryYear = {};
    fluData.forEach(d => {
        const year = +d.ISO_YEAR;
        const code = d.COUNTRY_CODE;
        const val = +d.AH3 || 0;
        if (!code || !year || val === 0) return;
        const key = `${code}-${year}`;
        byCountryYear[key] = (byCountryYear[key] || 0) + val;
    });

    const maxVal = d3.max(Object.values(byCountryYear));
    colorScale.domain([1, maxVal]);

    const countries = topojson.feature(world, world.objects.countries);

    const idToISO3 = {
        4: "AFG", 8: "ALB", 12: "DZA", 24: "AGO", 32: "ARG", 36: "AUS", 40: "AUT", 50: "BGD",
        56: "BEL", 64: "BTN", 68: "BOL", 76: "BRA", 100: "BGR", 116: "KHM", 120: "CMR",
        124: "CAN", 152: "CHL", 156: "CHN", 170: "COL", 188: "CRI", 191: "HRV", 192: "CUB",
        203: "CZE", 208: "DNK", 218: "ECU", 818: "EGY", 222: "SLV", 231: "ETH", 246: "FIN",
        250: "FRA", 266: "GAB", 276: "DEU", 288: "GHA", 300: "GRC", 320: "GTM", 332: "HTI",
        340: "HND", 348: "HUN", 356: "IND", 360: "IDN", 364: "IRN", 368: "IRQ", 372: "IRL",
        376: "ISR", 380: "ITA", 388: "JAM", 392: "JPN", 400: "JOR", 398: "KAZ", 404: "KEN",
        408: "PRK", 410: "KOR", 414: "KWT", 418: "LAO", 422: "LBN", 430: "LBR", 434: "LBY",
        440: "LTU", 442: "LUX", 484: "MEX", 496: "MNG", 504: "MAR", 508: "MOZ", 524: "NPL",
        528: "NLD", 540: "NCL", 554: "NZL", 558: "NIC", 566: "NGA", 578: "NOR", 586: "PAK",
        591: "PAN", 604: "PER", 608: "PHL", 616: "POL", 620: "PRT", 630: "PRI", 634: "QAT",
        642: "ROU", 643: "RUS", 682: "SAU", 686: "SEN", 694: "SLE", 703: "SVK", 705: "SVN",
        706: "SOM", 710: "ZAF", 724: "ESP", 144: "LKA", 736: "SDN", 752: "SWE", 756: "CHE",
        760: "SYR", 762: "TJK", 764: "THA", 768: "TGO", 780: "TTO", 788: "TUN", 792: "TUR",
        800: "UGA", 804: "UKR", 784: "ARE", 826: "GBR", 840: "USA", 858: "URY", 860: "UZB",
        862: "VEN", 704: "VNM", 887: "YEM", 894: "ZMB", 716: "ZWE", 466: "MLI",
        854: "BFA", 562: "NER", 174: "COM", 450: "MDG", 454: "MWI", 882: "WSM",
        51: "ARM", 31: "AZE", 112: "BLR", 268: "GEO", 417: "KGZ", 795: "TKM",
    };

    // === BUILD MAP ===
    window.buildMap = function (containerId = "map") {
        // Get the correct container based on which tab is active
        const containerEl = document.getElementById(containerId);
        if (!containerEl) return;

        const w = containerEl.clientWidth;
        const h = containerEl.clientHeight;
        if (!w || !h) return;

        // Clear previous map
        d3.select(`#${containerId}`).selectAll("*").remove();

        const svg = d3.select(`#${containerId}`)
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        const projection = d3.geoNaturalEarth1()
            .fitExtent([[0, 0], [w, h]], { type: "Sphere" });

        const t = projection.translate();
        projection.translate([t[0] - 20, t[1]]);

        const path = d3.geoPath().projection(projection);

        const currentYear = +document.getElementById("yearSlider").value || 2010;

        svg.selectAll(".country")
            .data(countries.features)
            .join("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .attr("fill", d => {
                const iso3 = idToISO3[+d.id];
                const val = byCountryYear[`${iso3}-${currentYear}`] || 0;
                return val > 0 ? colorScale(val) : "#c0c0c0";
            })
            .on("mouseover", function (event, d) {
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
                d3.select(this).attr("stroke", "#333").attr("stroke-width", 1.5);
            })
            .on("mousemove", function (event) {
                d3.select("#tooltip")
                    .style("left", (event.clientX + 12) + "px")
                    .style("top", (event.clientY - 28) + "px");
            })
            .on("mouseout", function (event, d) {
                d3.select("#tooltip").style("display", "none");
                d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.5);
            });

        // === MAP LEGEND ===
        const legendWidth = 180;
        const legendHeight = 10;
        const legendX = 10;
        const legendY = h - 55;

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

        const legendScale = d3.scaleLog()
            .domain([1, maxVal])
            .range([0, legendWidth]);

        const tickValues = [1, 10, 100, 1000, 10000, 100000]
        const legendAxis = d3.axisBottom(legendScale)
            .tickValues(tickValues)
            .tickFormat(d => d >= 1000 ? d3.format(".0s")(d) : d)
            .tickSize(4);

        svg.append("g")
            .attr("transform", `translate(${legendX}, ${legendY + legendHeight})`)
            .call(legendAxis)
            .call(g => g.select(".domain").remove())   
            .call(g => g.selectAll("text")
                .attr("font-size", "9px")
                .attr("fill", "#666")
            )
            .call(g=> g.selectAll("line")
                .attr("stroke", "#666")
            );
          
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

        // Store references keyed by containerId
        if (!window._maps) window._maps = {};
        window._maps[containerId] = { svg, path, idToISO3, byCountryYear };
    };

    // Build map initially for map-viet w
    window.buildMap("map");

    // Resize observer on map container
    const resizeObserver = new ResizeObserver(() => {
        const activeTab = document.querySelector(".tab.active")?.dataset.tab;
        if (activeTab === "map") window.buildMap("map");
        if (activeTab === "both") window.buildMap("map-both");
    });
    resizeObserver.observe(document.getElementById("map-view"));

    // === UPDATE FUNCTION ===
    window.updateYear = function (year) {
        year = +year;
        d3.select("#yearLabel").text(year);
        document.getElementById("yearSlider").value = year;

        // Update all active maps
        if (window._maps) {
            Object.entries(window._maps).forEach(([id, mapData]) => {
                mapData.svg.selectAll(".country")
                    .attr("fill", d => {
                        const iso3 = mapData.idToISO3[+d.id];
                        const val = mapData.byCountryYear[`${iso3}-${year}`] || 0;
                        return val > 0 ? colorScale(val) : "#c0c0c0";
                    });
            });
        //match the story to the current year
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

        if (window.updateTree) window.updateTree(year);
    };

    d3.select("#yearSlider").on("input", function () {
        window.updateYear(+this.value);
    });
});