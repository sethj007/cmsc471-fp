// === COLOR SCALE ===
const colorScale = d3.scaleSequentialLog()
    .interpolator(d3.interpolateBlues);

// === LOAD DATA ===
Promise.all([
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
    d3.csv("data/VIW_FNT.csv")
]).then(([world, fluData]) => {

    // Aggregate AH3 by ISO3 and year
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
        862: "VEN", 704: "VNM", 887: "YEM", 894: "ZMB", 716: "ZWE", 466: "MLI", 288: "GHA",
        854: "BFA", 562: "NER", 174: "COM", 450: "MDG", 454: "MWI", 882: "WSM", 760: "SYR",
        51: "ARM", 31: "AZE", 112: "BLR", 268: "GEO", 417: "KGZ", 496: "MNG", 762: "TJK",
        795: "TKM", 860: "UZB",
    };

    // === BUILD MAP ===
    function buildMap() {
        const container = document.getElementById("map-sticky");
        const w = container.clientWidth;

        // NaturalEarth aspect ratio is roughly 1.97:1
        const h = Math.round(w / 1.97);

        // Update container height to match
        container.style.height = h + "px";
        document.getElementById("scroll-section").style.height = h + "px";
        document.getElementById("scroll-panels").style.height = h + "px";
        document.querySelectorAll(".scroll-panel").forEach(p => p.style.minHeight = h + "px");

        d3.select("#map").selectAll("*").remove();

        const svg = d3.select("#map")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        const projection = d3.geoNaturalEarth1()
            .fitExtent([[0, 0], [w, h]], { type: "Sphere" })
            .scale(210);

        // Shift map left to reduce left whitespace
        const t = projection.translate();
        projection.translate([t[0] - 30, t[1]]);

        const path = d3.geoPath().projection(projection);

        svg.selectAll(".country")
            .data(countries.features)
            .join("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .attr("fill", d => {
                const iso3 = idToISO3[+d.id];
                const val = byCountryYear[`${iso3}-2010`] || 0;
                return val > 0 ? colorScale(val) : "#c0c0c0";
            });

        // === MAP LEGEND ===
        const legendWidth = 180;
        const legendHeight = 10;
        const legendX = 10;
        const legendY = h - 55;

        // Gradient bar
        const defs = svg.append("defs");
        const linearGradient = defs.append("linearGradient")
            .attr("id", "map-legend-gradient");

        linearGradient.selectAll("stop")
            .data([
                { offset: "0%", color: d3.interpolateBlues(0.1) },
                { offset: "100%", color: d3.interpolateBlues(1) }
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
            .style("fill", "url(#map-legend-gradient)");

        svg.append("text")
            .attr("x", legendX)
            .attr("y", legendY + legendHeight + 12)
            .attr("font-size", "10px")
            .attr("fill", "#666")
            .text("Fewer");

        svg.append("text")
            .attr("x", legendX + legendWidth)
            .attr("y", legendY + legendHeight + 12)
            .attr("font-size", "10px")
            .attr("fill", "#666")
            .attr("text-anchor", "end")
            .text("More");

        // No data indicator
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

        window._mapPath = path;
        window._mapSvg = svg;
        window._idToISO3 = idToISO3;
        window._byCountryYear = byCountryYear;
    }

    buildMap();

    // Redraw on resize
    const resizeObserver = new ResizeObserver(() => {
        buildMap();
        if (window.updateYear) window.updateYear(+document.getElementById("yearSlider").value);
    });
    resizeObserver.observe(document.getElementById("map-sticky"));

    // === UPDATE FUNCTION ===
    window.updateYear = function (year) {
        year = +year;
        d3.select("#yearLabel").text(year);
        document.getElementById("yearSlider").value = year;
        if (window._mapSvg) {
            window._mapSvg.selectAll(".country")
                .attr("fill", d => {
                    const iso3 = window._idToISO3[+d.id];
                    const val = window._byCountryYear[`${iso3}-${year}`] || 0;
                    return val > 0 ? colorScale(val) : "#c0c0c0";
                });
        }
        if (window.updateTree) window.updateTree(year);
    };

    d3.select("#yearSlider").on("input", function () {
        window.updateYear(+this.value);
    });
});