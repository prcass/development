
// Wikipedia Rankings Integration Script
// Generated: 2025-07-25T02:01:18.724Z

const wikipediaRankings = {
  "countries": {
    "items": {
      "United States": {
        "name": "United States",
        "code": "US",
        "gdp_nominal": 30507217,
        "human_development_index": 0.938,
        "population": 340.1,
        "co2_emissions": 4682.04
      },
      "China": {
        "name": "China",
        "code": "CHI",
        "gdp_nominal": 19231705,
        "population": 1408.3,
        "co2_emissions": 13259.64
      },
      "Germany": {
        "name": "Germany",
        "code": "GER",
        "gdp_nominal": 4744804,
        "human_development_index": 0.959,
        "population": 83.6,
        "co2_emissions": 582.95
      },
      "India": {
        "name": "India",
        "code": "IND",
        "gdp_nominal": 4187017,
        "population": 1417.5,
        "co2_emissions": 2955.18
      },
      "Japan": {
        "name": "Japan",
        "code": "JAP",
        "gdp_nominal": 4186431,
        "human_development_index": 0.925,
        "population": 123.4,
        "life_expectancy": 84.71,
        "co2_emissions": 944.76
      },
      "United Kingdom": {
        "name": "United Kingdom",
        "code": "UK",
        "gdp_nominal": 3839180,
        "human_development_index": 0.946,
        "population": 68.3,
        "co2_emissions": 302.1
      },
      "France": {
        "name": "France",
        "code": "FRA",
        "gdp_nominal": 3211292,
        "human_development_index": 0.92,
        "population": 68.6,
        "life_expectancy": 83.33,
        "co2_emissions": 282.43
      },
      "Italy": {
        "name": "Italy",
        "code": "ITA",
        "gdp_nominal": 2422855,
        "human_development_index": 0.915,
        "population": 58.9,
        "life_expectancy": 83.72,
        "co2_emissions": 305.49
      },
      "Canada": {
        "name": "Canada",
        "code": "CAN",
        "gdp_nominal": 2225341,
        "human_development_index": 0.939,
        "life_expectancy": 82.63,
        "co2_emissions": 575.01
      },
      "Brazil": {
        "name": "Brazil",
        "code": "BRA",
        "gdp_nominal": 2125958,
        "population": 212.6,
        "co2_emissions": 479.5
      },
      "Russia": {
        "name": "Russia",
        "code": "RUS",
        "gdp_nominal": 2076396,
        "population": 146,
        "co2_emissions": 2069.5
      },
      "Spain": {
        "name": "Spain",
        "code": "SPA",
        "gdp_nominal": 1799511,
        "human_development_index": 0.918,
        "life_expectancy": 83.67,
        "co2_emissions": 217.26
      },
      "South Korea": {
        "name": "South Korea",
        "code": "SK",
        "gdp_nominal": 1790322,
        "human_development_index": 0.937,
        "population": 51.2,
        "life_expectancy": 84.33,
        "co2_emissions": 573.54
      },
      "Australia": {
        "name": "Australia",
        "code": "AUS",
        "gdp_nominal": 1771681,
        "human_development_index": 0.958,
        "life_expectancy": 83.92,
        "co2_emissions": 373.62
      },
      "Mexico": {
        "name": "Mexico",
        "code": "MEX",
        "gdp_nominal": 1692640,
        "population": 130.4,
        "co2_emissions": 487.09
      },
      "Turkey": {
        "name": "Turkey",
        "code": "TUR",
        "gdp_nominal": 1437406,
        "population": 85.7,
        "co2_emissions": 438.32
      },
      "Indonesia": {
        "name": "Indonesia",
        "code": "IND",
        "gdp_nominal": 1429743,
        "population": 284.4,
        "co2_emissions": 674.54
      },
      "Netherlands": {
        "name": "Netherlands",
        "code": "NET",
        "gdp_nominal": 1272011,
        "human_development_index": 0.955,
        "life_expectancy": 82.16
      },
      "Saudi Arabia": {
        "name": "Saudi Arabia",
        "code": "SA",
        "gdp_nominal": 1083749,
        "co2_emissions": 622.91
      },
      "Poland": {
        "name": "Poland",
        "code": "POL",
        "gdp_nominal": 979960,
        "co2_emissions": 286.91
      },
      "Switzerland": {
        "name": "Switzerland",
        "code": "SWI",
        "gdp_nominal": 947125,
        "human_development_index": 0.97,
        "life_expectancy": 83.95
      },
      "Taiwan": {
        "name": "Taiwan",
        "code": "TAI",
        "gdp_nominal": 804889,
        "co2_emissions": 279.85
      },
      "Belgium": {
        "name": "Belgium",
        "code": "BEL",
        "gdp_nominal": 684864,
        "human_development_index": 0.951,
        "life_expectancy": 82.11
      },
      "Argentina": {
        "name": "Argentina",
        "code": "ARG",
        "gdp_nominal": 683533
      },
      "Sweden": {
        "name": "Sweden",
        "code": "SWE",
        "gdp_nominal": 620297,
        "human_development_index": 0.959,
        "life_expectancy": 83.26
      },
      "Ireland": {
        "name": "Ireland",
        "code": "IRE",
        "gdp_nominal": 598840,
        "human_development_index": 0.949,
        "life_expectancy": 82.41
      },
      "Israel": {
        "name": "Israel",
        "code": "ISR",
        "gdp_nominal": 583361,
        "human_development_index": 0.919,
        "life_expectancy": 82.41
      },
      "Singapore": {
        "name": "Singapore",
        "code": "SIN",
        "gdp_nominal": 564774,
        "human_development_index": 0.946,
        "life_expectancy": 83.74
      },
      "UAE": {
        "name": "UAE",
        "code": "UAE",
        "gdp_nominal": 548598,
        "human_development_index": 0.94,
        "life_expectancy": 82.91
      },
      "Thailand": {
        "name": "Thailand",
        "code": "THA",
        "gdp_nominal": 546224,
        "population": 65.9,
        "co2_emissions": 274.16
      },
      "Iceland": {
        "name": "Iceland",
        "code": "ICE",
        "human_development_index": 0.972,
        "life_expectancy": 82.69
      },
      "Norway": {
        "name": "Norway",
        "code": "NOR",
        "human_development_index": 0.97,
        "life_expectancy": 83.31
      },
      "Denmark": {
        "name": "Denmark",
        "code": "DEN",
        "human_development_index": 0.962
      },
      "Hong Kong": {
        "name": "Hong Kong",
        "code": "HK",
        "human_development_index": 0.955,
        "life_expectancy": 85.51
      },
      "Finland": {
        "name": "Finland",
        "code": "FIN",
        "human_development_index": 0.948
      },
      "Liechtenstein": {
        "name": "Liechtenstein",
        "code": "LIE",
        "human_development_index": 0.938
      },
      "New Zealand": {
        "name": "New Zealand",
        "code": "NZ",
        "human_development_index": 0.938,
        "life_expectancy": 82.09
      },
      "Slovenia": {
        "name": "Slovenia",
        "code": "SLO",
        "human_development_index": 0.931
      },
      "Austria": {
        "name": "Austria",
        "code": "AUS",
        "human_development_index": 0.93
      },
      "Malta": {
        "name": "Malta",
        "code": "MAL",
        "human_development_index": 0.924,
        "life_expectancy": 83.3
      },
      "Luxembourg": {
        "name": "Luxembourg",
        "code": "LUX",
        "human_development_index": 0.922,
        "life_expectancy": 82.23
      },
      "Czechia": {
        "name": "Czechia",
        "code": "CZE",
        "human_development_index": 0.915
      },
      "Pakistan": {
        "name": "Pakistan",
        "code": "PAK",
        "population": 241.5
      },
      "Nigeria": {
        "name": "Nigeria",
        "code": "NIG",
        "population": 223.8
      },
      "Bangladesh": {
        "name": "Bangladesh",
        "code": "BAN",
        "population": 169.8
      },
      "Philippines": {
        "name": "Philippines",
        "code": "PHI",
        "population": 114.1
      },
      "Democratic Republic of the Congo": {
        "name": "Democratic Republic of the Congo",
        "code": "DRO",
        "population": 112.8
      },
      "Ethiopia": {
        "name": "Ethiopia",
        "code": "ETH",
        "population": 111.7
      },
      "Egypt": {
        "name": "Egypt",
        "code": "EGY",
        "population": 107.3,
        "co2_emissions": 249.33
      },
      "Vietnam": {
        "name": "Vietnam",
        "code": "VIE",
        "population": 101.3,
        "co2_emissions": 372.95
      },
      "Iran": {
        "name": "Iran",
        "code": "IRA",
        "population": 86,
        "co2_emissions": 778.8
      },
      "Tanzania": {
        "name": "Tanzania",
        "code": "TAN",
        "population": 68.2
      },
      "South Africa": {
        "name": "South Africa",
        "code": "SA",
        "population": 63,
        "co2_emissions": 397.37
      },
      "Kenya": {
        "name": "Kenya",
        "code": "KEN",
        "population": 53.3
      },
      "Colombia": {
        "name": "Colombia",
        "code": "COL",
        "population": 52.7
      },
      "Sudan": {
        "name": "Sudan",
        "code": "SUD",
        "population": 51.7
      },
      "Myanmar": {
        "name": "Myanmar",
        "code": "MYA",
        "population": 51.3
      },
      "French Polynesia": {
        "name": "French Polynesia",
        "code": "FP",
        "life_expectancy": 84.07
      },
      "Andorra": {
        "name": "Andorra",
        "code": "AND",
        "life_expectancy": 84.04
      },
      "Réunion": {
        "name": "Réunion",
        "code": "RUN",
        "life_expectancy": 83.55
      },
      "Guernsey": {
        "name": "Guernsey",
        "code": "GUE",
        "life_expectancy": 83.27
      },
      "Macau": {
        "name": "Macau",
        "code": "MAC",
        "life_expectancy": 83.08
      },
      "Martinique": {
        "name": "Martinique",
        "code": "MAR",
        "life_expectancy": 82.56
      },
      "Qatar": {
        "name": "Qatar",
        "code": "QAT",
        "life_expectancy": 82.37
      },
      "Portugal": {
        "name": "Portugal",
        "code": "POR",
        "life_expectancy": 82.36
      },
      "Bermuda": {
        "name": "Bermuda",
        "code": "BER",
        "life_expectancy": 82.31
      },
      "Malaysia": {
        "name": "Malaysia",
        "code": "MAL",
        "co2_emissions": 283.32
      },
      "Kazakhstan": {
        "name": "Kazakhstan",
        "code": "KAZ",
        "co2_emissions": 239.87
      }
    },
    "prompts": [
      {
        "label": "<div style=\"text-align: center; padding: 20px;\">\n                <div style=\"font-weight: bold; font-size: 18px; color: #2c3e50; margin-bottom: 10px;\">\n                    Challenge 001: GDP (Nominal)\n                </div>\n                <div style=\"font-size: 14px; color: #7f8c8d; margin-bottom: 15px;\">\n                    Rank countries from HIGHEST to LOWEST\n                </div>\n                <div style=\"font-size: 12px; color: #95a5a6;\">\n                    Source: IMF 2025 | https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)\n                </div>\n            </div>",
        "challenge": "gdp_nominal",
        "direction": "desc"
      },
      {
        "label": "<div style=\"text-align: center; padding: 20px;\">\n                <div style=\"font-weight: bold; font-size: 18px; color: #2c3e50; margin-bottom: 10px;\">\n                    Challenge 002: Human Development Index\n                </div>\n                <div style=\"font-size: 14px; color: #7f8c8d; margin-bottom: 15px;\">\n                    Rank countries from HIGHEST to LOWEST\n                </div>\n                <div style=\"font-size: 12px; color: #95a5a6;\">\n                    Source: UN 2023 | https://en.wikipedia.org/wiki/List_of_countries_by_Human_Development_Index\n                </div>\n            </div>",
        "challenge": "human_development_index",
        "direction": "desc"
      },
      {
        "label": "<div style=\"text-align: center; padding: 20px;\">\n                <div style=\"font-weight: bold; font-size: 18px; color: #2c3e50; margin-bottom: 10px;\">\n                    Challenge 003: Population (Millions)\n                </div>\n                <div style=\"font-size: 14px; color: #7f8c8d; margin-bottom: 15px;\">\n                    Rank countries from HIGHEST to LOWEST\n                </div>\n                <div style=\"font-size: 12px; color: #95a5a6;\">\n                    Source: UN 2024 | https://en.wikipedia.org/wiki/List_of_countries_and_dependencies_by_population\n                </div>\n            </div>",
        "challenge": "population",
        "direction": "desc"
      },
      {
        "label": "<div style=\"text-align: center; padding: 20px;\">\n                <div style=\"font-weight: bold; font-size: 18px; color: #2c3e50; margin-bottom: 10px;\">\n                    Challenge 004: Life Expectancy (Years)\n                </div>\n                <div style=\"font-size: 14px; color: #7f8c8d; margin-bottom: 15px;\">\n                    Rank countries from HIGHEST to LOWEST\n                </div>\n                <div style=\"font-size: 12px; color: #95a5a6;\">\n                    Source: UN 2023 | https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy\n                </div>\n            </div>",
        "challenge": "life_expectancy",
        "direction": "desc"
      },
      {
        "label": "<div style=\"text-align: center; padding: 20px;\">\n                <div style=\"font-weight: bold; font-size: 18px; color: #2c3e50; margin-bottom: 10px;\">\n                    Challenge 005: CO2 Emissions (Million Tons)\n                </div>\n                <div style=\"font-size: 14px; color: #7f8c8d; margin-bottom: 15px;\">\n                    Rank countries from HIGHEST to LOWEST\n                </div>\n                <div style=\"font-size: 12px; color: #95a5a6;\">\n                    Source: Global Carbon Atlas 2023 | https://en.wikipedia.org/wiki/List_of_countries_by_carbon_dioxide_emissions\n                </div>\n            </div>",
        "challenge": "co2_emissions",
        "direction": "desc"
      }
    ]
  }
};

// Function to integrate with existing game data
function integrateWikipediaRankings() {
    if (typeof window !== 'undefined' && window.GAME_DATA) {
        // Add new countries that don't exist
        Object.keys(wikipediaRankings.countries.items).forEach(countryName => {
            const countryData = wikipediaRankings.countries.items[countryName];
            if (!window.GAME_DATA.categories.countries.items[countryName]) {
                window.GAME_DATA.categories.countries.items[countryName] = countryData;
                console.log('Added new country:', countryName);
            } else {
                // Add new properties to existing countries
                Object.keys(countryData).forEach(prop => {
                    if (prop !== 'name' && prop !== 'code') {
                        window.GAME_DATA.categories.countries.items[countryName][prop] = countryData[prop];
                    }
                });
            }
        });
        
        // Add new challenges/prompts
        wikipediaRankings.countries.prompts.forEach(prompt => {
            window.GAME_DATA.categories.countries.prompts.push(prompt);
        });
        
        console.log(`✅ Integrated ${Object.keys(wikipediaRankings.countries.items).length} countries and ${wikipediaRankings.countries.prompts.length} challenges`);
    }
}

// Auto-integrate if in browser environment
if (typeof window !== 'undefined') {
    integrateWikipediaRankings();
}

// Export for Node.js
if (typeof module !== 'undefined') {
    module.exports = { wikipediaRankings, integrateWikipediaRankings };
}
