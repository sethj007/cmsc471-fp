// === DIMENSIONS ===
const width = 2500;
const height = 800;
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

const location_country ={'Wisconsin': 'United States of America', 'Pennsylvania': 'United States of America', 'Alaska': 'United States of America', 'Michigan': 'United States of America', 'Texas': 'United States of America', 'Washington': 'United States of America', 'Wyoming': 'United States of America', 'Minnesota': 'United States of America', 'Hawaii': 'United States of America', 'Nevada': 'United States of America', 'Ohio': 'United States of America', 'Montana': 'United States of America', 'Arizona': 'United States of America', 'Delaware': 'United States of America', 'Florida': 'United States of America', 'Iowa': 'United States of America', 'Idaho': 'United States of America', 'Kansas': 'United States of America', 'Maryland': 'United States of America', 'Nebraska': 'United States of America', 'Virginia': 'United States of America', 'California': 'United States of America', 'Utah': 'United States of America', 'Indiana': 'United States of America', 'Vermont': 'United States of America', 'Oregon': 'United States of America', 'Maine': 'United States of America', 'Massachusetts': 'United States of America', 'Kentucky': 'United States of America', 'Oklahoma': 'United States of America', 'Colorado': 'United States of America', 'Mississippi': 'United States of America', 'Guam': 'United States of America', 'Bermuda': 'Bermuda', 'Ontario': 'Canada', 'Georgia': 'United States of America', 'Peru': 'Peru', 'Valparaiso': 'Chile', 'Santiago': 'Chile', 'Uruguay': 'Uruguay', 'Ecuador': 'Ecuador', 'Colombia': 'Colombia', 'Suriname': 'Suriname', 'Valdivia': 'Chile', 'Talca': 'Chile', 'Argentina': 'Argentina', 'Paraguay': 'Paraguay', 'Tocantins': 'Brazil', 'Bolivia': 'Bolivia', 'Trinidad': 'Trinidad and Tobago', 'Guyane': 'France', 'Venezuela': 'Venezuela', 'Para': 'Brazil', 'Brazil': 'Brazil', 'SantaCatarina': 'Brazil', 'PuertoMontt': 'Chile', 'VinaDelMar': 'Chile', 'Parana': 'Brazil', 'Paraiba': 'Brazil', 'Tucuman': 'Argentina', 'Roraima': 'Brazil', 'Pernambuco': 'Brazil', 'Goias': 'Brazil', 'Temuco': 'Chile', 'Concepcion': 'Chile', 'Rancagua': 'Chile', 'Arica': 'Chile', 'Chile': 'Chile', 'Guyana': 'Guyana', 'Guatemala': 'Guatemala', 'Honduras': 'Honduras', 'Martinique': 'France', 'Vina': 'Chile', 'Netherlands': 'Netherlands', 'Norway': 'Norway', 'Switzerland': 'Switzerland', 'Finland': 'Finland', 'Austria': 'Austria', 'Ukraine': 'Ukraine', 'Iceland': 'Iceland', 'Ireland': 'Ireland', 'Bulgaria': 'Bulgaria', 'Estonia': 'Estonia', 'Romania': 'Romania', 'Stockholm': 'Sweden', 'England': 'United Kingdom', 'Denmark': 'Denmark', 'Slovenia': 'Slovenia', 'Luxembourg': 'Luxembourg', 'Sweden': 'Sweden', 'Belgium': 'Belgium', 'Serbia': 'Serbia', 'Spain': 'Spain', 'Greece': 'Greece', 'Albania': 'Albania', 'Croatia': 'Croatia', 'Hungary': 'Hungary', 'Moldova': 'Moldova', 'Latvia': 'Latvia', 'Macedonia': 'North Macedonia', 'Lithuania': 'Lithuania', 'Poland': 'Poland', 'Portugal': 'Portugal', 'France': 'France', 'Lisbon': 'Portugal', 'Bretagne': 'France', 'Toulon': 'France', 'Madrid': 'Spain', 'Catalonia': 'Spain', 'Scotland': 'United Kingdom', 'Thuringen': 'Germany', 'Wrexham': 'United Kingdom', 'Montenegro': 'Montenegro', 'Kosovo': 'Kosovo', 'Slovakia': 'Slovakia', 'Poprad': 'Slovakia', 'Sturovo': 'Slovakia', 'Trnava': 'Slovakia', 'Iasi': 'Romania', 'Constanta': 'Romania', 'Maramures': 'Romania', 'Romania_SV': 'Romania', 'Vologda': 'Russia', 'Moscow': 'Russia', 'Yekaterinburg': 'Russia', 'Vladivostok': 'Russia', 'Stavropol': 'Russia', 'Kyiv': 'Ukraine', 'Tyumen': 'Russia', 'Voronezh': 'Russia', 'Vladimir': 'Russia', 'Yakutia': 'Russia', 'Tula': 'Russia', 'Khakassia': 'Russia', 'Orenburg': 'Russia', 'Ordu': 'Turkey', 'Zonguldak': 'Turkey', 'Germany': 'Germany', 'Hessen': 'Germany', 'Bremen': 'Germany', 'Sachsen': 'Germany', 'Rome': 'Italy', 'Parma': 'Italy', 'Palermo': 'Italy', 'Trieste': 'Italy', 'Ancona': 'Italy', 'Veneto': 'Italy', 'Pordenone': 'Italy', 'Trapani': 'Italy', 'Paris': 'France', 'Lyon': 'France', 'Grenoble': 'France', 'Rennes': 'France', 'Moulins': 'France', 'Picardie': 'France', 'Glasgow': 'United Kingdom', 'Swansea': 'United Kingdom', 'Tenby': 'United Kingdom', 'Ystrad': 'United Kingdom', 'Mold': 'United Kingdom', 'Ystad': 'Sweden', 'Visby': 'Sweden', 'Vaxjo': 'Sweden', 'Trollhattan': 'Sweden', 'Vasteras': 'Sweden', 'Uppsala': 'Sweden', 'Murcia': 'Spain', 'Navarra': 'Spain', 'Zamora': 'Spain', 'Valencia': 'Spain', 'LaRioja': 'Spain', 'Leon': 'Spain', 'Galicia': 'Spain', 'Valladolid': 'Spain', 'Athens': 'Greece', 'Heraklion': 'Greece', 'Malta': 'Malta', 'Yokohama': 'Japan', 'Vietnam': 'Vietnam', 'HongKong': 'China', 'SriLanka': 'Sri Lanka', 'Bangladesh': 'Bangladesh', 'Singapore': 'Singapore', 'Maldives': 'Maldives', 'Tokyo': 'Japan', 'India': 'India', 'Bhutan': 'Bhutan', 'Lao': 'Laos', 'Thailand': 'Thailand', 'Taiwan': 'Taiwan', 'Nepal': 'Nepal', 'Philippines': 'Philippines', 'Bahrain': 'Bahrain', 'Zhejiang-Shangcheng': 'China', 'Zhejiang-Nanhu': 'China', 'SuratThani': 'Thailand', 'Yamaguchi': 'Japan', 'Cambodia': 'Cambodia', 'Kanagawa': 'Japan', 'Yunnan-Wenshan': 'China', 'Yokosuka': 'Japan', 'Saitama': 'Japan', 'Nonthaburi': 'Thailand', 'Shanghai': 'China', 'Wuhan': 'China', 'Seoul': 'South Korea', 'Pakistan': 'Pakistan', 'Afghanistan': 'Afghanistan', 'SaudiArabia': 'Saudi Arabia', 'AbuDhabi': 'United Arab Emirates', 'Abudhabi': 'United Arab Emirates', 'Oman': 'Oman', 'Lebanon': 'Lebanon', 'Ulaanbaatar': 'Mongolia', 'Kazakhstan': 'Kazakhstan', 'Choibalsan': 'Mongolia', 'Zamyn-Uud': 'Mongolia', 'Uvs': 'Mongolia', 'Zavkhan': 'Mongolia', 'Brunei': 'Brunei', 'Indonesia': 'Indonesia', 'Myanmar': 'Myanmar', 'Yangon': 'Myanmar', 'Phuket': 'Thailand', 'Yasothon': 'Thailand', 'Trang': 'Thailand', 'Lopburi': 'Thailand', 'Chanthaburi': 'Thailand', 'Loei': 'Thailand', 'Ranong': 'Thailand', 'ChonBuri': 'Thailand', 'Mahasarakham': 'Thailand', 'Nakhonphanom': 'Thailand', 'ChiangRai': 'Thailand', 'Tehran': 'Iran', 'Varamin': 'Iran', 'Kuwait': 'Kuwait', 'Qatar': 'Qatar', 'SouthKorea': 'South Korea', 'Ulsan': 'South Korea', 'Kobe': 'Japan', 'Beijing': 'China', 'Tianjin-Hexi': 'China', 'Tianjin-Nankai': 'China', 'Sichuan-Gaoxin': 'China', 'Sichuan-Qingyang': 'China', 'Sichuan-Ziliujing': 'China', 'Sichuan-Jinjiang': 'China', 'Yunnan-Linxiang': 'China', 'Yunnan-Xianggelila': 'China', 'Yunnan-Zhaoyang': 'China', 'Yunnan-Zhenxiong': 'China', 'Yunnan-Chuxiong': 'China', 'Yunnan-Gucheng': 'China', 'Yunnan-Qilin': 'China', 'Yunnan-Xishan': 'China', 'Zhejiang-Haishu': 'China', 'Zhejiang-Nanxun': 'China', 'Zhejiang-Yongkang': 'China', 'Zhejiang-yongkang': 'China', 'Zhejiang-NH': 'China', 'Zhejiang-Tongxiang': 'China', 'Zhejiang-Yiwu': 'China', 'Zhejiang-Xihu': 'China', 'Zhejiang-Jiaojiang': 'China', 'Zhejiang-Xiuzhou': 'China', 'Zhejiang-Lucheng': 'China', 'Jiangxi-Donghu': 'China', 'Jiangxi-Zhushan': 'China', 'Jilin-Ningjiang': 'China', 'Guangxi': 'China', 'Guangxi-Fangcheng': 'China', 'Guangxi-Longzhou': 'China', 'Guangdong-Zhongshan': 'China', 'Guangdong-Zhenjiang': 'China', 'Hunan-yanfeng': 'China', 'Henan-Shihe': 'China', 'Fujian-Xinluo': 'China', 'Fujian-Pinghe': 'China', 'Fujian-Yanping': 'China', 'Anhui-Jinan': 'China', 'Guizhou-Nanming': 'China', 'Shaanxi-Hanbin': 'China', 'Xinjiang-Changji': 'China', 'Qinghai-Tongren': 'China', 'Beijing-Huairou': 'China', 'Beijing-Chaoyang': 'China', 'Shanghai-Putuo': 'China', 'Shanghai-Fengxian': 'China', 'Sapporo': 'Japan', 'Sendai': 'Japan', 'Sendai-H': 'Japan', 'Yamagata': 'Japan', 'Yamanashi': 'Japan', 'Wakayama': 'Japan', 'Wakayama-C': 'Japan', 'Shizuoka': 'Japan', 'Shizuoka-C': 'Japan', 'Miyazaki': 'Japan', 'Miyagi': 'Japan', 'Nagano': 'Japan', 'Okinawa': 'Japan', 'Kitakyushu': 'Japan', 'Kawasaki': 'Japan', 'Toyama': 'Japan', 'Tochigi': 'Japan', 'Odisha': 'India', 'Anantnag': 'India', 'Sidon': 'Lebanon', 'Zahle': 'Lebanon', 'Zgharta': 'Lebanon', 'Muscat': 'Oman', 'Salalah': 'Oman', 'Sharjah': 'United Arab Emirates', 'Fujairah': 'United Arab Emirates', 'Uaq': 'United Arab Emirates', 'Turkmenistan': 'Turkmenistan', 'Zhetysu': 'Kazakhstan', 'SouthAfrica': 'South Africa', 'Zambia': 'Zambia', 'Togo': 'Togo', 'Kenya': 'Kenya', 'Ghana': 'Ghana', 'Niger': 'Niger', 'Mali': 'Mali', 'Uganda': 'Uganda', 'Mozambique': 'Mozambique', 'Tunisia': 'Tunisia', 'BurkinaFaso': 'Burkina Faso', 'Congo': 'Dem. Rep. Congo', 'Cameroon': 'Cameroon', 'Nigeria': 'Nigeria', 'Ethiopia': 'Ethiopia', 'Tanzania': 'Tanzania', 'Madagascar': 'Madagascar', 'Antananarivo': 'Madagascar', 'Tsaralalana': 'Madagascar', 'Tanger': 'Morocco', 'Yaounde': 'Cameroon', 'Johannesburg': 'South Africa', 'Southafrica': 'South Africa', 'South-Africa': 'South Africa', 'Mayotte': 'France', 'Reunion': 'France', 'Victoria': 'Australia', 'Wellington': 'New Zealand', 'Sydney': 'Australia', 'Darwin': 'Australia', 'Brisbane': 'Australia', 'Perth': 'Australia', 'Tasmania': 'Australia', 'Townsville': 'Australia', 'Canberra': 'Australia', 'Newcastle': 'Australia', 'Christchurch': 'New Zealand', 'Waikato': 'New Zealand', 'Wairarapa': 'New Zealand', 'Canterbury': 'New Zealand', 'Fiji': 'Fiji', 'Papeete': 'France', 'Samoa': 'Samoa', 'NorthCarolina': 'United States of America', 'NewJersey': 'United States of America', 'NewMexico': 'United States of America', 'SouthDakota': 'United States of America', 'NorthDakota': 'United States of America', 'SouthCarolina': 'United States of America', 'RhodeIsland': 'United States of America', 'DistrictOfColumbia': 'United States of America', 'SaoPaulo': 'Brazil', 'Saopaulo': 'Brazil', 'MinasGerais': 'Brazil', 'RioGrandedoNorte': 'Brazil', 'RioGrandeDoNorte': 'Brazil', 'RioGrandedoSul': 'Brazil', 'AltoHospicio': 'Chile', 'StPetersburg': 'Russia', 'YoshkarOla': 'Russia', 'VelikyNovgorod': 'Russia', 'CzechRepublic': 'Czech Republic', 'FrancheComte': 'France', 'NorthernIreland': 'United Kingdom', 'UnitedKingdom': 'United Kingdom', 'BosniaHerzegovina': 'Bosnia and Herzegovina', 'BanskaBystrica': 'Slovakia', 'SchleswigHolstein': 'Germany', 'StEtienne': 'France', 'ValencianCommunity': 'Spain', 'Srinigar': 'India', 'TimorLeste': 'Timor-Leste', 'PhraNakhonSiAyutthaya': 'Thailand', 'Yunnan-Mengliandaizulahuzuwazuzizhi': 'China', 'Zhejiang-Wuxin': 'China', 'Zhejiang-TX': 'China', 'Zhejiang-Zhangxing': 'China', 'Hainan-Baotinglizumiaozuzizhi': 'China', 'Guizhou-Yilongxin': 'China', 'WuhanQiaokou': 'China', 'MountLebanon': 'Lebanon', 'RasAlKhaimah': 'United Arab Emirates', 'UmmAlQuwain': 'United Arab Emirates', 'CoteDIvoire': "Côte d'Ivoire", 'NosyBe': 'Madagascar', 'SouthAustralia': 'Australia', 'WesternAustralia': 'Australia', 'NorthernTerritory': 'Australia', 'NewZealand': 'New Zealand', 'SouthAuckland': 'New Zealand', 'Southauckland': 'New Zealand', 'NewCaledonia': 'France', 'SolomonIslands': 'Solomon Islands'} 
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

const cladeDefinitions = [
    { name: "3C", startYear: 2008, endYear: 2013, color: "#888888" },
    { name: "3C.2a", startYear: 2014, endYear: 2015, color: "#e41a1c" },
    { name: "3C.3a", startYear: 2015, endYear: 2018, color: "#ff7f00" },
    { name: "3C.2a1", startYear: 2016, endYear: 2019, color: "#4daf4a" },
    { name: "3C.2a1b", startYear: 2019, endYear: 2022, color: "#377eb8" },
    { name: "2a.1b.2a", startYear: 2022, endYear: 2024, color: "#984ea3" },
    { name: "2a.1b.2b", startYear: 2024, endYear: 2027, color: "#a65628" },
];

function getCladeForLeaf(leaf) {
    const year = extractYear(leaf.data.name);
    if (!year) return { name: "Unknown", color: "#cccccc" };
    for (const clade of cladeDefinitions) {
        if (year >= clade.startYear && year < clade.endYear) return clade;
    }
    return { name: "Unknown", color: "#cccccc" };
}

function parseNewick(s) {
    let ancestors = [], tree = {}, tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        switch (token) {
            case '(': { let st = {}; tree.children = tree.children || []; tree.children.push(st); ancestors.push(tree); tree = st; break; }
            case ',': { let sb = {}; ancestors[ancestors.length - 1].children = ancestors[ancestors.length - 1].children || []; ancestors[ancestors.length - 1].children.push(sb); tree = sb; break; }
            case ')': tree = ancestors.pop(); break;
            case ':': break;
            default: {
                let prev = tokens[i - 1];
                if (prev == ')' || prev == '(' || prev == ',') tree.name = token;
                else if (prev == ':') tree.length = parseFloat(token);
            }
        }
    }
    return tree;
}

function computeDepths(node, depth = 0) {
    node.depth = depth + (node.length || 0);
    if (node.children) node.children.forEach(child => computeDepths(child, node.depth));
}

function extractYear(name) {
    if (!name) return null;
    const match = name.match(/\/(\d{4})(?:-egg)?$/);
    return match ? parseInt(match[1]) : null;
}

function drawTree(newickData) {
    const parsed = parseNewick(newickData);
    computeDepths(parsed);
    const root = d3.hierarchy(parsed, d => d.children);

    const xScale = d3.scaleLinear().domain([ROOT_OFFSET, MAX_DEPTH]).range([0, innerWidth]);
    const leaves = root.leaves();
    const yScale = d3.scaleLinear().domain([0, leaves.length - 1]).range([0, innerHeight]);
    leaves.forEach((leaf, i) => { leaf.data._y = yScale(i); });

    function assignY(node) {
        if (!node.children) return node.data._y;
        node.data._y = d3.mean(node.children, c => assignY(c));
        return node.data._y;
    }
    assignY(root);

    const getX = d => xScale(d.data.depth);
    const getY = d => d.data._y;

    let currentRevealX = innerWidth;
    let activeRegions = new Set(["North America", "South America", "Europe", "Asia", "Africa", "Oceania"]);
    let colorMode = "region";
    let treeViewMode = "tips";

    // === SVG + ZOOM SETUP ===
    const svgRoot = d3.select("#tree")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("cursor", "grab");

    const svg = svgRoot.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const zoom = d3.zoom()
        .scaleExtent([0.5, 8])
        .translateExtent([
        [-200, -Infinity],
        [width*3, Infinity]
        ])
        
         .on("zoom", (event) => {
        svg.attr("transform",
            `translate(${event.transform.x + margin.left},${event.transform.y + margin.top}) scale(${event.transform.k})`
        );

        const rescaledX = event.transform.rescaleX(xScale);
        const zoomedAxis = d3.axisTop(rescaledX)
            .tickValues(d3.range(ROOT_OFFSET, MAX_DEPTH, 1))
            .tickFormat(d => Math.round(ROOT_YEAR + (d - ROOT_OFFSET)));
        axisG.call(zoomedAxis);
        axisG.selectAll("text").attr("font-size", "11px");
    });

    svgRoot.call(zoom);

    window.resetZoom = function () {
        svgRoot.transition().duration(400).call(zoom.transform, d3.zoomIdentity);
    };

    // Prevent container scroll from interfering with zoom
    const treeContainer = document.getElementById("tree-container");
    if (treeContainer) {
        treeContainer.addEventListener("wheel", function (e) {
            e.preventDefault();
        }, { passive: false });
    }

    function getLinkColor(d) {
        const lv = d.target.leaves ? d.target.leaves() : [];
        if (lv.length === 0) return "#ccc";
        if (colorMode === "clade") {
            const cc = {};
            lv.forEach(l => { const c = getCladeForLeaf(l).name; cc[c] = (cc[c] || 0) + 1; });
            const dom = Object.entries(cc).sort((a, b) => b[1] - a[1])[0][0];
            const cl = cladeDefinitions.find(c => c.name === dom);
            return cl ? cl.color : "#ccc";
        }
        const rc = {};
        lv.forEach(l => { const r = getRegion(l.data.name); rc[r] = (rc[r] || 0) + 1; });
        const dom = Object.entries(rc).sort((a, b) => b[1] - a[1])[0][0];
        return regionColors[dom] || "#ccc";
    }

    function getNodeColor(d) {
        if (colorMode === "clade") return getCladeForLeaf(d).color;
        return regionColors[getRegion(d.data.name)] || regionColors["Unknown"];
    }

    svg.selectAll(".link")
        .data(root.links())
        .join("path")
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke-width", 0.8)
        .attr("stroke", d => getLinkColor(d))
        .attr("d", d => `M${getX(d.source)},${getY(d.source)} H${getX(d.target)} V${getY(d.target)}`);

    const node = svg.selectAll(".node")
        .data(root.descendants().filter(d => !d.children))
        .join("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${getX(d)},${getY(d)})`);

    node.append("circle")
        .attr("r", 5)
        .attr("fill", d => getNodeColor(d))
        .on("mouseover", function (event, d) {
            if (!d.data.name || !activeRegions.has(getRegion(d.data.name))) return;
            const region = getRegion(d.data.name);
            const year = extractYear(d.data.name);
            const clade = getCladeForLeaf(d);
            const locationMatch = d.data.name.match(/^A\/([^\/]+)\//);
            const location = locationMatch ? locationMatch[1] : "Unknown";
            d3.select("#tooltip").style("display", "block").html(`
                <div style="font-weight:bold;margin-bottom:4px;">H3N2 Influenza Sample</div>
                <div>📍 Collected in: ${location}</div>
                <div>🌍 Region: ${region}</div>
                <div>📅 Year: ${year || "Unknown"}</div>
                <div>🧬 Strain: ${d.data.name}</div>
                <div>🌿 Clade: ${clade.name}</div>
            `);
            d3.select(this).attr("r", 7).attr("stroke", "black").attr("stroke-width", 1.5);
            const countryName = location_country[location];
            if (countryName && window.highlightMapCountry) window.highlightMapCountry(countryName);
        })
        .on("mousemove", function (event) {
            d3.select("#tooltip").style("left", (event.clientX + 12) + "px").style("top", (event.clientY - 28) + "px");
        })
        .on("mouseout", function (event, d) {
            if (!activeRegions.has(getRegion(d.data.name))) return;
            d3.select("#tooltip").style("display", "none");
            d3.select(this).attr("r", 5).attr("stroke", "none");
            if (window.clearMapHighlight) window.clearMapHighlight();
        });

    const sweepLine = svg.append("line")
        .attr("class", "sweep-line")
        .attr("x1", innerWidth).attr("x2", innerWidth)
        .attr("y1", 0).attr("y2", innerHeight)
        .attr("stroke", "#333").attr("stroke-width", 1.5)
        .attr("stroke-dasharray", "6,4").attr("opacity", 0.6);

    const axisSvg = d3.select("#tree-axis").attr("width", width).attr("height", 40);
    const xAxisTop = d3.axisTop(xScale)
        .tickValues(d3.range(ROOT_OFFSET, MAX_DEPTH, 1))
        .tickFormat(d => Math.round(ROOT_YEAR + (d - ROOT_OFFSET)));


    const axisG = axisSvg.append("g")
        .attr("transform", `translate(${margin.left}, 35)`)
        .call(xAxisTop);
    axisG.selectAll("text").attr("font-size", "11px");

    function applyFilters(transition = true) {
        const t = transition ? d3.transition().duration(400).ease(d3.easeCubicInOut) : null;
        const nodes = d3.selectAll(".node circle");
        const links = d3.selectAll(".link");
        (transition ? nodes.transition(t) : nodes).attr("opacity", d => {
            if (!activeRegions.has(getRegion(d.data.name))) return 0;
            return getX(d) <= currentRevealX ? 1 : 0;
        });
        (transition ? links.transition(t) : links).attr("opacity", d => {
            const lv = d.target.leaves ? d.target.leaves() : [];
            const hasActive = lv.some(l => activeRegions.has(getRegion(l.data.name)));
            if (!hasActive) return 0;
            const sx = getX(d.source), tx = getX(d.target);
            if (tx <= currentRevealX) return 1;
            if (sx >= currentRevealX) return 0;
            return 0.5;
        });
    }

    // === DENSITY VIEW with legend ===
    window.showDensityView = function () {
        treeViewMode = "density";
        svg.selectAll(".link").style("display", "none");
        svg.selectAll(".node").style("display", "none");
        sweepLine.style("display", "none");
        svg.selectAll(".density-overlay").remove();
        svg.selectAll(".clade-group").remove();

        const visibleLeaves = root.leaves().filter(leaf => getX(leaf) <= currentRevealX);
        if (visibleLeaves.length === 0) return;

        const binCountX = 60, binCountY = 40;
        const cellW = innerWidth / binCountX;
        const cellH = innerHeight / binCountY;

        const grid = Array.from({ length: binCountX }, () => Array(binCountY).fill(0));
        const gridLeaves = Array.from({ length: binCountX }, () => Array.from({ length: binCountY }, () => []));

        visibleLeaves.forEach(leaf => {
            const x = getX(leaf), y = getY(leaf);
            const xi = Math.min(Math.floor(x / cellW), binCountX - 1);
            const yi = Math.min(Math.floor(y / cellH), binCountY - 1);
            grid[xi][yi]++;
            gridLeaves[xi][yi].push(leaf);
        });

        const maxCount = Math.max(...grid.flat());
        if (maxCount === 0) return;

        const densityColor = d3.scaleSequential().domain([0, maxCount]).interpolator(d3.interpolateYlOrRd);
        const densityGroup = svg.append("g").attr("class", "density-overlay");

        for (let xi = 0; xi < binCountX; xi++) {
            for (let yi = 0; yi < binCountY; yi++) {
                const count = grid[xi][yi];
                if (count === 0) continue;
                const cellLeaves = gridLeaves[xi][yi];
                const regionCounts = {};
                cellLeaves.forEach(l => { const r = getRegion(l.data.name); regionCounts[r] = (regionCounts[r] || 0) + 1; });
                const topRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0];
                const yearMin = d3.min(cellLeaves, l => extractYear(l.data.name));
                const yearMax = d3.max(cellLeaves, l => extractYear(l.data.name));

                densityGroup.append("rect")
                    .attr("class", "density-cell")
                    .attr("x", xi * cellW).attr("y", yi * cellH)
                    .attr("width", cellW - 1).attr("height", cellH - 1)
                    .attr("rx", 2)
                    .attr("fill", densityColor(count))
                    .attr("opacity", 0.9)
                    .on("mouseover", function (event) {
                        d3.select("#tooltip").style("display", "block").html(`
                            <div style="font-weight:bold;margin-bottom:4px;">Strain Cluster</div>
                            <div>🧬 Strains in cell: <strong>${count}</strong></div>
                            <div>📅 Years sampled: ${yearMin}–${yearMax}</div>
                            <div>🌍 Top region: ${topRegion[0]} (${topRegion[1]} strains)</div>
                        `);
                    })
                    .on("mousemove", function (event) {
                        d3.select("#tooltip").style("left", (event.clientX + 12) + "px").style("top", (event.clientY - 28) + "px");
                    })
                    .on("mouseout", function () { d3.select("#tooltip").style("display", "none"); });
            }
        }

        // === DENSITY LEGEND ===
        const legendW = 160, legendH = 10;
        const legendX = innerWidth - legendW - 10;
        const legendY = innerHeight - 65;

        const defs = densityGroup.append("defs");
        const grad = defs.append("linearGradient").attr("id", "density-legend-grad");
        [0, 0.25, 0.5, 0.75, 1].forEach(t => {
            grad.append("stop").attr("offset", `${t * 100}%`).attr("stop-color", d3.interpolateYlOrRd(t));
        });

        // show both legends
        document.getElementById("density-legend").style.display = "block";
        document.getElementById("density-legend-both").style.display = "block";
        const mid = Math.round(maxCount / 2);
        document.getElementById("density-legend-mid").textContent = mid;
        document.getElementById("density-legend-mid-both").textContent = mid;
        document.getElementById("region-legend").style.display = "none";
        document.getElementById("region-legend-both").style.display = "none";
    };

    // === COLLAPSED VIEW ===
    window.showCollapsedView = function () {
        treeViewMode = "collapsed";
        svg.selectAll(".link").style("display", "none");
        svg.selectAll(".node").style("display", "none");
        sweepLine.style("display", "none");
        svg.selectAll(".density-overlay").remove();
        svg.selectAll(".clade-group").remove();

        const visibleLeaves = root.leaves().filter(leaf => getX(leaf) <= currentRevealX);
        document.getElementById("density-legend").style.display = "none";
        document.getElementById("density-legend-both").style.display = "none";
        document.getElementById("region-legend").style.display = "block";
        document.getElementById("region-legend-both").style.display = "block";

        cladeDefinitions.forEach(clade => {
            const cladeLeaves = visibleLeaves.filter(leaf => {
                const year = extractYear(leaf.data.name);
                return year >= clade.startYear && year < clade.endYear;
            });
            if (cladeLeaves.length === 0) return;

            const xValues = cladeLeaves.map(getX), yValues = cladeLeaves.map(getY);
            const xMin = Math.min(...xValues), xMax = Math.max(...xValues);
            const yMin = Math.min(...yValues), yMax = Math.max(...yValues);
            const yMid = (yMin + yMax) / 2;

            const regionCounts = {};
            cladeLeaves.forEach(l => { const r = getRegion(l.data.name); regionCounts[r] = (regionCounts[r] || 0) + 1; });
            const topRegions = Object.entries(regionCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([r, n]) => `${r}: ${n}`).join(", ");

            const g = svg.append("g").attr("class", "clade-group");
            const points = [[xMin, yMid], [xMax, yMin], [xMax, yMax]].map(p => p.join(",")).join(" ");

            g.append("polygon").attr("points", points)
                .attr("fill", clade.color).attr("opacity", 0.7)
                .attr("stroke", clade.color).attr("stroke-width", 1)
                .on("mouseover", function (event) {
                    d3.select("#tooltip").style("display", "block").html(`
                        <div style="font-weight:bold;margin-bottom:4px;">${clade.name}</div>
                        <div>🧬 Strains: ${cladeLeaves.length}</div>
                        <div>📅 Years: ${clade.startYear}–${clade.endYear - 1}</div>
                        <div>🌍 Top regions: ${topRegions}</div>
                    `);
                })
                .on("mousemove", function (event) {
                    d3.select("#tooltip").style("left", (event.clientX + 12) + "px").style("top", (event.clientY - 28) + "px");
                })
                .on("mouseout", function () { d3.select("#tooltip").style("display", "none"); });

            g.append("text").attr("x", xMax + 8).attr("y", yMid + 4)
                .attr("font-size", "11px").attr("font-weight", "bold").attr("fill", clade.color)
                .text(`${clade.name} (n=${cladeLeaves.length})`);
        });
    };

    window.showAllTipsView = function () {
        treeViewMode = "tips";
        svg.selectAll(".density-overlay").remove();
        svg.selectAll(".clade-group").remove();
        svg.selectAll(".link").style("display", null);
        svg.selectAll(".node").style("display", null);
        sweepLine.style("display", null);
        const currentYear = +document.getElementById("yearSlider").value;
        if (window.updateTree) window.updateTree(currentYear);
        document.getElementById("density-legend").style.display = "none";
        document.getElementById("density-legend-both").style.display = "none";
        document.getElementById("region-legend").style.display = "block";
        document.getElementById("region-legend-both").style.display = "block";
    };

    window.setColorMode = function (mode) {
        colorMode = mode;
        d3.selectAll(".node circle").attr("fill", d => getNodeColor(d));
        d3.selectAll(".link").attr("stroke", d => getLinkColor(d));
    };

    window.updateTree = function (year) {
        year = +year;
        const depth = ROOT_OFFSET + (year - ROOT_YEAR);
        currentRevealX = xScale(Math.min(depth, MAX_DEPTH));
        if (treeViewMode === "tips") {
            sweepLine.transition().duration(600).ease(d3.easeCubicInOut)
                .attr("x1", currentRevealX).attr("x2", currentRevealX);
            applyFilters(true);
        } else if (treeViewMode === "density") {
            window.showDensityView();
        } else if (treeViewMode === "collapsed") {
            window.showCollapsedView();
        }
    };

    window.applyRegionFilter = function (regions) {
        activeRegions = regions;
        applyFilters(true);
    };
}

d3.text("data/nextstrain_seasonal-flu_h3n2_ha_12y_timetree.nwk").then(data => { drawTree(data); });