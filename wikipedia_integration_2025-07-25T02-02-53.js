
/**
 * Wikipedia Rankings Integration - Generated 2025-07-25T02:02:53.154Z
 * 
 * INSTRUCTIONS:
 * 1. Add the country data updates below to your existing countries section
 * 2. Add the new challenges to your countries prompts array
 * 3. Update any challenge numbering as needed
 */

// =================
// COUNTRY DATA UPDATES
// =================
// Add these properties to existing countries in your data.js:

// United States (USA)
"USA": {
    "name": "United States",
    "code": "USA",
            "gdp_nominal": 30507217,\n            "human_development_index": 0.938,\n            "population": 340.1,\n            "co2_emissions": 4682.04
},\n\n// China (CHN)
"CHN": {
    "name": "China",
    "code": "CHN",
            "gdp_nominal": 19231705,\n            "population": 1408.3,\n            "co2_emissions": 13259.64
},\n\n// Germany (001)
"001": {
    "name": "Germany",
    "code": "001",
            "gdp_nominal": 4744804,\n            "human_development_index": 0.959,\n            "population": 83.6,\n            "co2_emissions": 582.95
},\n\n// India (IND)
"IND": {
    "name": "India",
    "code": "IND",
            "gdp_nominal": 4187017,\n            "population": 1417.5,\n            "co2_emissions": 2955.18
},\n\n// Japan (JPN)
"JPN": {
    "name": "Japan",
    "code": "JPN",
            "gdp_nominal": 4186431,\n            "human_development_index": 0.925,\n            "population": 123.4,\n            "life_expectancy": 84.71,\n            "co2_emissions": 944.76
},\n\n// United Kingdom (GBR)
"GBR": {
    "name": "United Kingdom",
    "code": "GBR",
            "gdp_nominal": 3839180,\n            "human_development_index": 0.946,\n            "population": 68.3,\n            "co2_emissions": 302.1
},\n\n// France (FRA)
"FRA": {
    "name": "France",
    "code": "FRA",
            "gdp_nominal": 3211292,\n            "human_development_index": 0.92,\n            "population": 68.6,\n            "life_expectancy": 83.33,\n            "co2_emissions": 282.43
},\n\n// Italy (ITA)
"ITA": {
    "name": "Italy",
    "code": "ITA",
            "gdp_nominal": 2422855,\n            "human_development_index": 0.915,\n            "population": 58.9,\n            "life_expectancy": 83.72,\n            "co2_emissions": 305.49
},\n\n// Canada (CAN)
"CAN": {
    "name": "Canada",
    "code": "CAN",
            "gdp_nominal": 2225341,\n            "human_development_index": 0.939,\n            "life_expectancy": 82.63,\n            "co2_emissions": 575.01
},\n\n// Brazil (BRA)
"BRA": {
    "name": "Brazil",
    "code": "BRA",
            "gdp_nominal": 2125958,\n            "population": 212.6,\n            "co2_emissions": 479.5
},\n\n// Russia (RUS)
"RUS": {
    "name": "Russia",
    "code": "RUS",
            "gdp_nominal": 2076396,\n            "population": 146,\n            "co2_emissions": 2069.5
},\n\n// Spain (ESP)
"ESP": {
    "name": "Spain",
    "code": "ESP",
            "gdp_nominal": 1799511,\n            "human_development_index": 0.918,\n            "life_expectancy": 83.67,\n            "co2_emissions": 217.26
},\n\n// South Korea (KOR)
"KOR": {
    "name": "South Korea",
    "code": "KOR",
            "gdp_nominal": 1790322,\n            "human_development_index": 0.937,\n            "population": 51.2,\n            "life_expectancy": 84.33,\n            "co2_emissions": 573.54
},\n\n// Australia (AUS)
"AUS": {
    "name": "Australia",
    "code": "AUS",
            "gdp_nominal": 1771681,\n            "human_development_index": 0.958,\n            "life_expectancy": 83.92,\n            "co2_emissions": 373.62
},\n\n// Mexico (MEX)
"MEX": {
    "name": "Mexico",
    "code": "MEX",
            "gdp_nominal": 1692640,\n            "population": 130.4,\n            "co2_emissions": 487.09
},\n\n// Turkey (TUR)
"TUR": {
    "name": "Turkey",
    "code": "TUR",
            "gdp_nominal": 1437406,\n            "population": 85.7,\n            "co2_emissions": 438.32
},\n\n// Indonesia (IDN)
"IDN": {
    "name": "Indonesia",
    "code": "IDN",
            "gdp_nominal": 1429743,\n            "population": 284.4,\n            "co2_emissions": 674.54
},\n\n// Netherlands (NLD)
"NLD": {
    "name": "Netherlands",
    "code": "NLD",
            "gdp_nominal": 1272011,\n            "human_development_index": 0.955,\n            "life_expectancy": 82.16
},\n\n// Saudi Arabia (SAU)
"SAU": {
    "name": "Saudi Arabia",
    "code": "SAU",
            "gdp_nominal": 1083749,\n            "co2_emissions": 622.91
},\n\n// Poland (POL)
"POL": {
    "name": "Poland",
    "code": "POL",
            "gdp_nominal": 979960,\n            "co2_emissions": 286.91
},\n\n// Switzerland (CHE)
"CHE": {
    "name": "Switzerland",
    "code": "CHE",
            "gdp_nominal": 947125,\n            "human_development_index": 0.97,\n            "life_expectancy": 83.95
},\n\n// Belgium (BEL)
"BEL": {
    "name": "Belgium",
    "code": "BEL",
            "gdp_nominal": 684864,\n            "human_development_index": 0.951,\n            "life_expectancy": 82.11
},\n\n// Sweden (SWE)
"SWE": {
    "name": "Sweden",
    "code": "SWE",
            "gdp_nominal": 620297,\n            "human_development_index": 0.959,\n            "life_expectancy": 83.26
},\n\n// Ireland (IRL)
"IRL": {
    "name": "Ireland",
    "code": "IRL",
            "gdp_nominal": 598840,\n            "human_development_index": 0.949,\n            "life_expectancy": 82.41
},\n\n// Israel (ISR)
"ISR": {
    "name": "Israel",
    "code": "ISR",
            "gdp_nominal": 583361,\n            "human_development_index": 0.919,\n            "life_expectancy": 82.41
},\n\n// Singapore (SGP)
"SGP": {
    "name": "Singapore",
    "code": "SGP",
            "gdp_nominal": 564774,\n            "human_development_index": 0.946,\n            "life_expectancy": 83.74
},\n\n// UAE (ARE)
"ARE": {
    "name": "UAE",
    "code": "ARE",
            "gdp_nominal": 548598,\n            "human_development_index": 0.94,\n            "life_expectancy": 82.91
},\n\n// Thailand (THA)
"THA": {
    "name": "Thailand",
    "code": "THA",
            "gdp_nominal": 546224,\n            "population": 65.9,\n            "co2_emissions": 274.16
},\n\n// Norway (NOR)
"NOR": {
    "name": "Norway",
    "code": "NOR",
            "human_development_index": 0.97,\n            "life_expectancy": 83.31
},\n\n// Denmark (DNK)
"DNK": {
    "name": "Denmark",
    "code": "DNK",
            "human_development_index": 0.962
},\n\n// Hong Kong (HKG)
"HKG": {
    "name": "Hong Kong",
    "code": "HKG",
            "human_development_index": 0.955,\n            "life_expectancy": 85.51
},\n\n// New Zealand (NZL)
"NZL": {
    "name": "New Zealand",
    "code": "NZL",
            "human_development_index": 0.938,\n            "life_expectancy": 82.09
},\n\n// Austria (AUT)
"AUT": {
    "name": "Austria",
    "code": "AUT",
            "human_development_index": 0.93
},\n\n// Pakistan (PAK)
"PAK": {
    "name": "Pakistan",
    "code": "PAK",
            "population": 241.5
},\n\n// Nigeria (NGA)
"NGA": {
    "name": "Nigeria",
    "code": "NGA",
            "population": 223.8
},\n\n// Bangladesh (BGD)
"BGD": {
    "name": "Bangladesh",
    "code": "BGD",
            "population": 169.8
},\n\n// Philippines (PHL)
"PHL": {
    "name": "Philippines",
    "code": "PHL",
            "population": 114.1
},\n\n// Egypt (EGY)
"EGY": {
    "name": "Egypt",
    "code": "EGY",
            "population": 107.3,\n            "co2_emissions": 249.33
},\n\n// Vietnam (VNM)
"VNM": {
    "name": "Vietnam",
    "code": "VNM",
            "population": 101.3,\n            "co2_emissions": 372.95
},\n\n// Iran (IRN)
"IRN": {
    "name": "Iran",
    "code": "IRN",
            "population": 86,\n            "co2_emissions": 778.8
},\n\n// South Africa (ZAF)
"ZAF": {
    "name": "South Africa",
    "code": "ZAF",
            "population": 63,\n            "co2_emissions": 397.37
},\n\n// Malaysia (MYS)
"MYS": {
    "name": "Malaysia",
    "code": "MYS",
            "co2_emissions": 283.32
}

// =================
// NEW CHALLENGES
// =================
// Add these to your countries.prompts array:

{
    "challenge": "gdp_nominal",
    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>GDP Nominal (Wikipedia)</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Million USD</div><div style='font-size: 0.85em; color: #666'>(Wikipedia 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
},\n\n{
    "challenge": "population",
    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Population (Wikipedia)</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Millions</div><div style='font-size: 0.85em; color: #666'>(Wikipedia 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
},\n\n{
    "challenge": "life_expectancy",
    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Life Expectancy (Wikipedia)</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Years</div><div style='font-size: 0.85em; color: #666'>(Wikipedia 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
},\n\n{
    "challenge": "co2_emissions",
    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>CO2 Emissions (Wikipedia)</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Million Tons</div><div style='font-size: 0.85em; color: #666'>(Wikipedia 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
},\n\n{
    "challenge": "human_development_index",
    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Human Development Index (Wikipedia)</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Index (0-1)</div><div style='font-size: 0.85em; color: #666'>(Wikipedia 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
}

// =================
// SAMPLE INTEGRATION CODE
// =================
// Use this template to add to your data.js:

/*
// In your countries section, add these properties to existing countries:
"USA": {
    // ... existing properties ...
    "gdp_nominal": 30507217,
    "population": 340.1,
    "life_expectancy": N/A
},

// In your countries.prompts array, add:
{
    "challenge": "gdp_nominal",
    "label": "Challenge: GDP (Nominal) - Rank highest to lowest"
}
*/

// =================
// VERIFICATION
// =================
// After integration, verify these countries have the new data:
// USA: United States\n// CHN: China\n// 001: Germany\n// IND: India\n// JPN: Japan\n// GBR: United Kingdom\n// FRA: France\n// ITA: Italy\n// CAN: Canada\n// BRA: Brazil
