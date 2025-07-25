
// Wikipedia Rankings Integration Script
// Generated: 2025-07-25T02:00:38.195Z

const wikipediaRankings = {
  "countries": {
    "items": {
      "United States": {
        "name": "United States",
        "code": "US",
        "gdp_nominal": 30507217,
        "human_development_index": 0.938
      },
      "China": {
        "name": "China",
        "code": "CHI",
        "gdp_nominal": 19231705
      },
      "Germany": {
        "name": "Germany",
        "code": "GER",
        "gdp_nominal": 4744804,
        "human_development_index": 0.959
      },
      "India": {
        "name": "India",
        "code": "IND",
        "gdp_nominal": 4187017
      },
      "Japan": {
        "name": "Japan",
        "code": "JAP",
        "gdp_nominal": 4186431,
        "human_development_index": 0.925
      },
      "United Kingdom": {
        "name": "United Kingdom",
        "code": "UK",
        "gdp_nominal": 3839180,
        "human_development_index": 0.946
      },
      "France": {
        "name": "France",
        "code": "FRA",
        "gdp_nominal": 3211292,
        "human_development_index": 0.92
      },
      "Italy": {
        "name": "Italy",
        "code": "ITA",
        "gdp_nominal": 2422855,
        "human_development_index": 0.915
      },
      "Canada": {
        "name": "Canada",
        "code": "CAN",
        "gdp_nominal": 2225341,
        "human_development_index": 0.939
      },
      "Brazil": {
        "name": "Brazil",
        "code": "BRA",
        "gdp_nominal": 2125958
      },
      "Russia": {
        "name": "Russia",
        "code": "RUS",
        "gdp_nominal": 2076396
      },
      "Spain": {
        "name": "Spain",
        "code": "SPA",
        "gdp_nominal": 1799511,
        "human_development_index": 0.918
      },
      "South Korea": {
        "name": "South Korea",
        "code": "SK",
        "gdp_nominal": 1790322,
        "human_development_index": 0.937
      },
      "Australia": {
        "name": "Australia",
        "code": "AUS",
        "gdp_nominal": 1771681,
        "human_development_index": 0.958
      },
      "Mexico": {
        "name": "Mexico",
        "code": "MEX",
        "gdp_nominal": 1692640
      },
      "Turkey": {
        "name": "Turkey",
        "code": "TUR",
        "gdp_nominal": 1437406
      },
      "Indonesia": {
        "name": "Indonesia",
        "code": "IND",
        "gdp_nominal": 1429743
      },
      "Netherlands": {
        "name": "Netherlands",
        "code": "NET",
        "gdp_nominal": 1272011,
        "human_development_index": 0.955
      },
      "Saudi Arabia": {
        "name": "Saudi Arabia",
        "code": "SA",
        "gdp_nominal": 1083749
      },
      "Poland": {
        "name": "Poland",
        "code": "POL",
        "gdp_nominal": 979960
      },
      "Switzerland": {
        "name": "Switzerland",
        "code": "SWI",
        "gdp_nominal": 947125,
        "human_development_index": 0.97
      },
      "Taiwan": {
        "name": "Taiwan",
        "code": "TAI",
        "gdp_nominal": 804889
      },
      "Belgium": {
        "name": "Belgium",
        "code": "BEL",
        "gdp_nominal": 684864,
        "human_development_index": 0.951
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
        "human_development_index": 0.959
      },
      "Ireland": {
        "name": "Ireland",
        "code": "IRE",
        "gdp_nominal": 598840,
        "human_development_index": 0.949
      },
      "Israel": {
        "name": "Israel",
        "code": "ISR",
        "gdp_nominal": 583361,
        "human_development_index": 0.919
      },
      "Singapore": {
        "name": "Singapore",
        "code": "SIN",
        "gdp_nominal": 564774,
        "human_development_index": 0.946
      },
      "UAE": {
        "name": "UAE",
        "code": "UAE",
        "gdp_nominal": 548598,
        "human_development_index": 0.94
      },
      "Thailand": {
        "name": "Thailand",
        "code": "THA",
        "gdp_nominal": 546224
      },
      "Iceland": {
        "name": "Iceland",
        "code": "ICE",
        "human_development_index": 0.972
      },
      "Norway": {
        "name": "Norway",
        "code": "NOR",
        "human_development_index": 0.97
      },
      "Denmark": {
        "name": "Denmark",
        "code": "DEN",
        "human_development_index": 0.962
      },
      "Hong Kong": {
        "name": "Hong Kong",
        "code": "HK",
        "human_development_index": 0.955
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
        "human_development_index": 0.938
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
        "human_development_index": 0.924
      },
      "Luxembourg": {
        "name": "Luxembourg",
        "code": "LUX",
        "human_development_index": 0.922
      },
      "Czechia": {
        "name": "Czechia",
        "code": "CZE",
        "human_development_index": 0.915
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
