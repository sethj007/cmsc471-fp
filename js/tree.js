// === DIMENSIONS ===
const width = 2500;
const height = 1500;
const margin = { top: 20, right: 220, bottom: 40, left: 20 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const ROOT_YEAR = 2008;
const ROOT_OFFSET = 0.846;
const MAX_DEPTH = 18.584;

// === REGION MAPPING ===
const regionMap = {
    "Wisconsin": "North America", "Pennsylvania": "North America", "Alaska": "North America",
    "Michigan": "North America", "Texas": "North America", "Washington": "North America",
    "Wyoming": "North America", "NewYork": "North America", "Minnesota": "North America",
    "Hawaii": "North America", "Nevada": "North America", "Ohio": "North America",
    "Montana": "North America", "NorthCarolina": "North America", "Arizona": "North America",
    "Delaware": "North America", "Florida": "North America", "Iowa": "North America",
    "Idaho": "North America", "Kansas": "North America", "Maryland": "North America",
    "Nebraska": "North America", "NewJersey": "North America", "NewMexico": "North America",
    "Virginia": "North America", "California": "North America", "Utah": "North America",
    "Indiana": "North America", "Vermont": "North America", "Oregon": "North America",
    "Maine": "North America", "Massachusetts": "North America", "Kentucky": "North America",
    "Oklahoma": "North America", "SouthDakota": "North America", "NorthDakota": "North America",
    "SouthCarolina": "North America", "RhodeIsland": "North America", "Colorado": "North America",
    "Mississippi": "North America", "DistrictOfColumbia": "North America",
    "PuertoRico": "North America", "Guam": "North America", "Bermuda": "North America",
    "Ontario": "North America", "Georgia": "North America",
    "Peru": "South America", "Valparaiso": "South America", "Santiago": "South America",
    "Uruguay": "South America", "SaoPaulo": "South America", "Ecuador": "South America",
    "Colombia": "South America", "Suriname": "South America", "Valdivia": "South America",
    "Talca": "South America", "Argentina": "South America", "Paraguay": "South America",
    "Tocantins": "South America", "Bolivia": "South America", "Trinidad": "South America",
    "Guyane": "South America", "Venezuela": "South America", "Para": "South America",
    "Brazil": "South America", "SantaCatarina": "South America", "PuertoMontt": "South America",
    "VinaDelMar": "South America", "MinasGerais": "South America", "Parana": "South America",
    "Paraiba": "South America", "Tucuman": "South America", "RioGrandedoNorte": "South America",
    "RioGrandeDoNorte": "South America", "RioGrandedoSul": "South America",
    "Roraima": "South America", "Pernambuco": "South America", "Goias": "South America",
    "Temuco": "South America", "Concepcion": "South America", "AltoHospicio": "South America",
    "Rancagua": "South America", "Arica": "South America", "Chile": "South America",
    "Guyana": "South America", "Guatemala": "South America", "Honduras": "South America",
    "Martinique": "South America", "Saopaulo": "South America", "Vina": "South America",
    "Netherlands": "Europe", "Norway": "Europe", "Switzerland": "Europe", "Finland": "Europe",
    "Austria": "Europe", "Ukraine": "Europe", "Iceland": "Europe", "Ireland": "Europe",
    "Bulgaria": "Europe", "Estonia": "Europe", "StPetersburg": "Europe", "Romania": "Europe",
    "Stockholm": "Europe", "England": "Europe", "Denmark": "Europe", "Slovenia": "Europe",
    "Luxembourg": "Europe", "Sweden": "Europe", "Belgium": "Europe", "Serbia": "Europe",
    "Spain": "Europe", "Greece": "Europe", "Albania": "Europe", "Croatia": "Europe",
    "Hungary": "Europe", "Moldova": "Europe", "Latvia": "Europe", "Macedonia": "Europe",
    "CzechRepublic": "Europe", "Lithuania": "Europe", "Poland": "Europe", "Portugal": "Europe",
    "France": "Europe", "FrancheComte": "Europe", "Lisbon": "Europe", "Bretagne": "Europe",
    "Toulon": "Europe", "Madrid": "Europe", "Catalonia": "Europe", "Scotland": "Europe",
    "NorthernIreland": "Europe", "UnitedKingdom": "Europe", "Thuringen": "Europe",
    "Wrexham": "Europe", "Montenegro": "Europe", "BosniaHerzegovina": "Europe",
    "Kosovo": "Europe", "Slovakia": "Europe", "Poprad": "Europe", "Sturovo": "Europe",
    "BanskaBystrica": "Europe", "Trnava": "Europe", "Iasi": "Europe", "Constanta": "Europe",
    "Maramures": "Europe", "Romania_SV": "Europe", "Vologda": "Europe", "Moscow": "Europe",
    "Yekaterinburg": "Europe", "Vladivostok": "Europe", "Stavropol": "Europe",
    "YoshkarOla": "Europe", "Kyiv": "Europe", "Tyumen": "Europe", "Voronezh": "Europe",
    "VelikyNovgorod": "Europe", "Vladimir": "Europe", "Yakutia": "Europe", "Tula": "Europe",
    "Khakassia": "Europe", "Orenburg": "Europe", "Ordu": "Europe", "Zonguldak": "Europe",
    "Germany": "Europe", "Hessen": "Europe", "Bremen": "Europe", "Sachsen": "Europe",
    "SchleswigHolstein": "Europe", "Rome": "Europe", "Parma": "Europe", "Palermo": "Europe",
    "Trieste": "Europe", "Ancona": "Europe", "Veneto": "Europe", "Pordenone": "Europe",
    "Trapani": "Europe", "Paris": "Europe", "Lyon": "Europe", "Grenoble": "Europe",
    "Rennes": "Europe", "Moulins": "Europe", "StEtienne": "Europe", "Picardie": "Europe",
    "Glasgow": "Europe", "Swansea": "Europe", "Tenby": "Europe", "Ystrad": "Europe",
    "Mold": "Europe", "Ystad": "Europe", "Visby": "Europe",
    "Vaxjo": "Europe", "Trollhattan": "Europe", "Vasteras": "Europe", "Uppsala": "Europe",
    "Murcia": "Europe", "Navarra": "Europe", "Zamora": "Europe", "Valencia": "Europe",
    "ValencianCommunity": "Europe", "LaRioja": "Europe", "Leon": "Europe", "Galicia": "Europe",
    "Valladolid": "Europe", "Athens": "Europe", "Heraklion": "Europe", "Malta": "Europe",
    "Yokohama": "Asia", "Vietnam": "Asia", "HongKong": "Asia", "SriLanka": "Asia",
    "Bangladesh": "Asia", "Singapore": "Asia", "Maldives": "Asia", "Tokyo": "Asia",
    "India": "Asia", "Bhutan": "Asia", "Lao": "Asia", "Thailand": "Asia", "Taiwan": "Asia",
    "Nepal": "Asia", "Philippines": "Asia", "Bahrain": "Asia", "Zhejiang-Shangcheng": "Asia",
    "Zhejiang-Nanhu": "Asia", "SuratThani": "Asia", "Yamaguchi": "Asia", "Cambodia": "Asia",
    "Kanagawa": "Asia", "Yunnan-Wenshan": "Asia", "Yokosuka": "Asia", "Saitama": "Asia",
    "Nonthaburi": "Asia", "Shanghai": "Asia", "Wuhan": "Asia", "Seoul": "Asia",
    "Pakistan": "Asia", "Afghanistan": "Asia", "Srinigar": "Asia", "SaudiArabia": "Asia",
    "AbuDhabi": "Asia", "Abudhabi": "Asia", "Oman": "Asia", "Lebanon": "Asia",
    "Ulaanbaatar": "Asia", "Kazakhstan": "Asia", "Choibalsan": "Asia", "Zamyn-Uud": "Asia",
    "Uvs": "Asia", "Zavkhan": "Asia", "TimorLeste": "Asia", "Brunei": "Asia",
    "Indonesia": "Asia", "Myanmar": "Asia", "Yangon": "Asia", "Phuket": "Asia",
    "Yasothon": "Asia", "Trang": "Asia", "Lopburi": "Asia", "Chanthaburi": "Asia",
    "Loei": "Asia", "Ranong": "Asia", "ChonBuri": "Asia", "Mahasarakham": "Asia",
    "Nakhonphanom": "Asia", "ChiangRai": "Asia", "PhraNakhonSiAyutthaya": "Asia",
    "Tehran": "Asia", "Varamin": "Asia", "Kuwait": "Asia", "Qatar": "Asia",
    "SouthKorea": "Asia", "Ulsan": "Asia", "Kobe": "Asia",
    "Beijing": "Asia", "Tianjin-Hexi": "Asia", "Tianjin-Nankai": "Asia",
    "Sichuan-Gaoxin": "Asia", "Sichuan-Qingyang": "Asia", "Sichuan-Ziliujing": "Asia",
    "Sichuan-Jinjiang": "Asia", "Yunnan-Linxiang": "Asia", "Yunnan-Xianggelila": "Asia",
    "Yunnan-Zhaoyang": "Asia", "Yunnan-Zhenxiong": "Asia", "Yunnan-Chuxiong": "Asia",
    "Yunnan-Gucheng": "Asia", "Yunnan-Qilin": "Asia", "Yunnan-Xishan": "Asia",
    "Yunnan-Mengliandaizulahuzuwazuzizhi": "Asia", "Zhejiang-Haishu": "Asia",
    "Zhejiang-Nanxun": "Asia", "Zhejiang-Wuxin": "Asia", "Zhejiang-Yongkang": "Asia",
    "Zhejiang-yongkang": "Asia", "Zhejiang-NH": "Asia", "Zhejiang-TX": "Asia",
    "Zhejiang-Tongxiang": "Asia", "Zhejiang-Yiwu": "Asia", "Zhejiang-Zhangxing": "Asia",
    "Zhejiang-Xihu": "Asia", "Zhejiang-Jiaojiang": "Asia", "Zhejiang-Xiuzhou": "Asia",
    "Zhejiang-Lucheng": "Asia", "Jiangxi-Donghu": "Asia", "Jiangxi-Zhushan": "Asia",
    "Jilin-Ningjiang": "Asia", "Guangxi": "Asia", "Guangxi-Fangcheng": "Asia",
    "Guangxi-Longzhou": "Asia", "Guangdong-Zhongshan": "Asia", "Guangdong-Zhenjiang": "Asia",
    "Hunan-yanfeng": "Asia", "Hainan-Baotinglizumiaozuzizhi": "Asia", "Henan-Shihe": "Asia",
    "Fujian-Xinluo": "Asia", "Fujian-Pinghe": "Asia", "Fujian-Yanping": "Asia",
    "Anhui-Jinan": "Asia", "Guizhou-Yilongxin": "Asia", "Guizhou-Nanming": "Asia",
    "Shaanxi-Hanbin": "Asia", "Xinjiang-Changji": "Asia", "Qinghai-Tongren": "Asia",
    "Beijing-Huairou": "Asia", "Beijing-Chaoyang": "Asia", "Shanghai-Putuo": "Asia",
    "Shanghai-Fengxian": "Asia", "WuhanQiaokou": "Asia", "Sapporo": "Asia",
    "Sendai": "Asia", "Sendai-H": "Asia", "Yamagata": "Asia", "Yamanashi": "Asia",
    "Wakayama": "Asia", "Wakayama-C": "Asia", "Shizuoka": "Asia", "Shizuoka-C": "Asia",
    "Miyazaki": "Asia", "Miyagi": "Asia", "Nagano": "Asia", "Okinawa": "Asia",
    "Kitakyushu": "Asia", "Kawasaki": "Asia", "Toyama": "Asia", "Tochigi": "Asia",
    "Odisha": "Asia", "Anantnag": "Asia", "Sidon": "Asia",
    "Zahle": "Asia", "Zgharta": "Asia", "MountLebanon": "Asia", "Muscat": "Asia",
    "Salalah": "Asia", "RasAlKhaimah": "Asia", "Sharjah": "Asia", "Fujairah": "Asia",
    "UmmAlQuwain": "Asia", "Uaq": "Asia", "Turkmenistan": "Asia", "Zhetysu": "Asia",
    "SouthAfrica": "Africa", "Zambia": "Africa", "Togo": "Africa", "Kenya": "Africa",
    "Ghana": "Africa", "Niger": "Africa", "Mali": "Africa", "Uganda": "Africa",
    "Mozambique": "Africa", "Tunisia": "Africa", "BurkinaFaso": "Africa",
    "CoteDIvoire": "Africa", "Congo": "Africa", "Cameroon": "Africa", "Nigeria": "Africa",
    "Ethiopia": "Africa", "Tanzania": "Africa", "Madagascar": "Africa",
    "Antananarivo": "Africa", "NosyBe": "Africa", "Tsaralalana": "Africa",
    "Tanger": "Africa", "Yaounde": "Africa", "Johannesburg": "Africa",
    "Southafrica": "Africa", "South-Africa": "Africa", "Mayotte": "Africa",
    "Reunion": "Africa",
    "Victoria": "Oceania", "Wellington": "Oceania", "Sydney": "Oceania",
    "Darwin": "Oceania", "Brisbane": "Oceania", "Perth": "Oceania",
    "SouthAustralia": "Oceania", "Tasmania": "Oceania", "WesternAustralia": "Oceania",
    "Townsville": "Oceania", "Canberra": "Oceania", "Newcastle": "Oceania",
    "NewZealand": "Oceania", "Christchurch": "Oceania", "SouthAuckland": "Oceania",
    "Southauckland": "Oceania", "Waikato": "Oceania", "Wairarapa": "Oceania",
    "Canterbury": "Oceania", "NorthernTerritory": "Oceania", "NewCaledonia": "Oceania",
    "Fiji": "Oceania", "Papeete": "Oceania", "SolomonIslands": "Oceania", "Samoa": "Oceania",
};

const regionColors = {
    "North America": "#e41a1c",
    "South America": "#ff7f00",
    "Europe": "#4daf4a",
    "Asia": "#377eb8",
    "Africa": "#984ea3",
    "Oceania": "#a65628",
    "Unknown": "#cccccc"
};

function getRegion(name) {
    if (!name) return "Unknown";
    const match = name.match(/^A\/([^\/]+)\//);
    if (!match) return "Unknown";
    return regionMap[match[1]] || "Unknown";
}

// === NEWICK PARSER ===
function parseNewick(s) {
    let ancestors = [];
    let tree = {};
    let tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        switch (token) {
            case '(':
                let subtree = {};
                tree.children = tree.children || [];
                tree.children.push(subtree);
                ancestors.push(tree);
                tree = subtree;
                break;
            case ',':
                let sibling = {};
                ancestors[ancestors.length - 1].children = ancestors[ancestors.length - 1].children || [];
                ancestors[ancestors.length - 1].children.push(sibling);
                tree = sibling;
                break;
            case ')':
                tree = ancestors.pop();
                break;
            case ':':
                break;
            default:
                let prev = tokens[i - 1];
                if (prev == ')' || prev == '(' || prev == ',') {
                    tree.name = token;
                } else if (prev == ':') {
                    tree.length = parseFloat(token);
                }
        }
    }
    return tree;
}

// === COMPUTE CUMULATIVE DEPTH ===
function computeDepths(node, depth = 0) {
    node.depth = depth + (node.length || 0);
    if (node.children) {
        node.children.forEach(child => computeDepths(child, node.depth));
    }
}

// === EXTRACT YEAR FROM STRAIN NAME ===
function extractYear(name) {
    if (!name) return null;
    const match = name.match(/\/(\d{4})(?:-egg)?$/);
    return match ? parseInt(match[1]) : null;
}

// === DRAW TREE ===
function drawTree(newickData) {
    const parsed = parseNewick(newickData);
    computeDepths(parsed);

    const root = d3.hierarchy(parsed, d => d.children);

    const xScale = d3.scaleLinear()
        .domain([ROOT_OFFSET, MAX_DEPTH])
        .range([0, innerWidth]);

    const leaves = root.leaves();
    const yScale = d3.scaleLinear()
        .domain([0, leaves.length - 1])
        .range([0, innerHeight]);

    leaves.forEach((leaf, i) => {
        leaf.data._y = yScale(i);
    });

    function assignY(node) {
        if (!node.children) return node.data._y;
        node.data._y = d3.mean(node.children, c => assignY(c));
        return node.data._y;
    }
    assignY(root);

    const getX = d => xScale(d.data.depth);
    const getY = d => d.data._y;

    // Track current reveal state
    let currentRevealX = innerWidth;
    let activeRegions = new Set(["North America", "South America", "Europe", "Asia", "Africa", "Oceania"]);

    // === SVG SETUP ===
    const svg = d3.select("#tree")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // === DRAW LINKS ===
    svg.selectAll(".link")
        .data(root.links())
        .join("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke-width", 0.8)
        .attr("stroke", d => {
            const leaves = d.target.leaves ? d.target.leaves() : [];
            if (leaves.length === 0) return "#ccc";
            const regionCounts = {};
            leaves.forEach(leaf => {
                const r = getRegion(leaf.data.name);
                regionCounts[r] = (regionCounts[r] || 0) + 1;
            });
            const dominant = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0][0];
            return regionColors[dominant] || "#ccc";
        })
        .attr("d", d => `M${getX(d.source)},${getY(d.source)} H${getX(d.target)} V${getY(d.target)}`);

    // === DRAW NODES (leaves only) ===
    const node = svg.selectAll(".node")
        .data(root.descendants().filter(d => !d.children))
        .join("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${getX(d)},${getY(d)})`);

    node.append("circle")
        .attr("r", 5)
        .attr("fill", d => regionColors[getRegion(d.data.name)] || regionColors["Unknown"])
        .on("mouseover", function (event, d) {
            if (!d.data.name) return;
            const region = getRegion(d.data.name);
            const year = extractYear(d.data.name);
            const locationMatch = d.data.name.match(/^A\/([^\/]+)\//);
            const location = locationMatch ? locationMatch[1] : "Unknown";
            d3.select("#tooltip")
                .style("display", "block")
                .html(`
                    <div style="font-weight:bold; margin-bottom:4px;">H3N2 Influenza Sample</div>
                    <div>📍 Collected in: ${location}</div>
                    <div>🌍 Region: ${region}</div>
                    <div>📅 Year: ${year || "Unknown"}</div>
                    <div>🧬 Strain: ${d.data.name}</div>
                `);
            d3.select(this).attr("r", 7).attr("stroke", "black").attr("stroke-width", 1.5);
        })
        .on("mousemove", function (event) {
            d3.select("#tooltip")
                .style("left", (event.clientX + 12) + "px")
                .style("top", (event.clientY - 28) + "px");
        })
        .on("mouseout", function () {
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("r", 5).attr("stroke", "none");
        });

    // === SWEEP LINE ===
    const sweepLine = svg.append("line")
        .attr("class", "sweep-line")
        .attr("x1", innerWidth).attr("x2", innerWidth)
        .attr("y1", 0).attr("y2", innerHeight)
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "6,4")
        .attr("opacity", 0.6);

    // === TOP AXIS ===
    const axisSvg = d3.select("#tree-axis")
        .attr("width", width)
        .attr("height", 40);

    const xAxisTop = d3.axisTop(xScale)
        .tickValues(d3.range(ROOT_OFFSET, MAX_DEPTH, 1))
        .tickFormat(d => Math.round(ROOT_YEAR + (d - ROOT_OFFSET)));

    axisSvg.append("g")
        .attr("transform", `translate(${margin.left}, 35)`)
        .call(xAxisTop)
        .selectAll("text")
        .attr("font-size", "11px");

    // === SHARED RENDER FUNCTION ===
    function applyFilters(transition = true) {
        const t = transition ? d3.transition().duration(400).ease(d3.easeCubicInOut) : null;

        const nodes = d3.selectAll(".node circle");
        const links = d3.selectAll(".link");

        (transition ? nodes.transition(t) : nodes)
            .attr("opacity", d => {
                if (!activeRegions.has(getRegion(d.data.name))) return 0;
                return getX(d) <= currentRevealX ? 1 : 0;
            });

        (transition ? links.transition(t) : links)
            .attr("opacity", d => {
                const leaves = d.target.leaves ? d.target.leaves() : [];
                const hasActive = leaves.some(leaf => activeRegions.has(getRegion(leaf.data.name)));
                if (!hasActive) return 0;
                const sourceX = getX(d.source);
                const targetX = getX(d.target);
                if (targetX <= currentRevealX) return 1;
                if (sourceX >= currentRevealX) return 0;
                return 0.5;
            });
    }

    // === LEGEND ===
    const regions = [
        { label: "North America", color: "#e41a1c" },
        { label: "South America", color: "#ff7f00" },
        { label: "Europe", color: "#4daf4a" },
        { label: "Asia", color: "#377eb8" },
        { label: "Africa", color: "#984ea3" },
        { label: "Oceania", color: "#a65628" },
    ];

    const legendDiv = d3.select("#tree-section").append("div")
        .attr("class", "legend-div")
        .style("position", "absolute")
        .style("top", "-30px")
        .style("right", "20px")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "10px 14px")
        .style("border-radius", "6px")
        .style("font-size", "13px")
        .style("z-index", "1000")
        .style("box-shadow", "0 2px 6px rgba(0,0,0,0.15)");

    legendDiv.append("div")
        .style("font-weight", "bold")
        .style("margin-bottom", "8px")
        .style("font-size", "11px")
        .style("color", "#888")
        .text("CLICK TO FILTER");

    regions.forEach(r => {
        const row = legendDiv.append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("margin-bottom", "6px")
            .style("cursor", "pointer")
            .style("user-select", "none")
            .on("click", function () {
                if (activeRegions.has(r.label)) {
                    activeRegions.delete(r.label);
                    d3.select(this).style("opacity", 0.35);
                } else {
                    activeRegions.add(r.label);
                    d3.select(this).style("opacity", 1);
                }
                applyFilters(true);
            });

        row.append("div")
            .style("width", "12px")
            .style("height", "12px")
            .style("border-radius", "50%")
            .style("background", r.color)
            .style("margin-right", "8px")
            .style("flex-shrink", "0");

        row.append("span").text(r.label);
    });

    // === EXPOSE TREE UPDATE FUNCTION ===
    window.updateTree = function (year) {
        year = +year;
        const depth = ROOT_OFFSET + (year - ROOT_YEAR);
        currentRevealX = xScale(Math.min(depth, MAX_DEPTH));

        sweepLine
            .transition().duration(600).ease(d3.easeCubicInOut)
            .attr("x1", currentRevealX)
            .attr("x2", currentRevealX);

        applyFilters(true);
    };
}

// === LOAD AND RENDER ===
d3.text("data/nextstrain_seasonal-flu_h3n2_ha_12y_timetree.nwk").then(data => {
    drawTree(data);
});