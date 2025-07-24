// Extracted NBA data from Sports Reference table
// Columns: Franchise,Lg,From,To,Yrs,G,W,L,W/L%,Plyfs,Div,Conf,Champ
// Using the main franchise entries (first line for each team)

const nbaExtractedData = [
    { 
        name: "Atlanta Hawks", 
        winning_percentage: 0.493, 
        division_titles: 12, 
        playoff_appearances: 49,  // "Plyfs" column
        championships: 1         // "Champ" column
    },
    
    { 
        name: "Boston Celtics", 
        winning_percentage: 0.596, 
        division_titles: 35, 
        playoff_appearances: 62,
        championships: 18
    },
    
    { 
        name: "Brooklyn Nets", 
        winning_percentage: 0.438, 
        division_titles: 5, 
        playoff_appearances: 31,
        championships: 2
    },
    
    { 
        name: "Charlotte Hornets", 
        winning_percentage: 0.427, 
        division_titles: 0, 
        playoff_appearances: 10,
        championships: 0
    },
    
    { 
        name: "Chicago Bulls", 
        winning_percentage: 0.509, 
        division_titles: 9, 
        playoff_appearances: 36,
        championships: 6
    },
    
    { 
        name: "Cleveland Cavaliers", 
        winning_percentage: 0.473, 
        division_titles: 8, 
        playoff_appearances: 25,
        championships: 1
    },
    
    { 
        name: "Dallas Mavericks", 
        winning_percentage: 0.506, 
        division_titles: 5, 
        playoff_appearances: 25,
        championships: 1
    },
    
    { 
        name: "Denver Nuggets", 
        winning_percentage: 0.515, 
        division_titles: 13, 
        playoff_appearances: 40,
        championships: 1
    },
    
    { 
        name: "Detroit Pistons", 
        winning_percentage: 0.472, 
        division_titles: 11, 
        playoff_appearances: 43,
        championships: 3
    },
    
    { 
        name: "Golden State Warriors", 
        winning_percentage: 0.488, 
        division_titles: 12, 
        playoff_appearances: 38,
        championships: 7
    },
    
    { 
        name: "Houston Rockets", 
        winning_percentage: 0.516, 
        division_titles: 9, 
        playoff_appearances: 35,
        championships: 2
    },
    
    { 
        name: "Indiana Pacers", 
        winning_percentage: 0.513, 
        division_titles: 9, 
        playoff_appearances: 38,
        championships: 3
    },
    
    { 
        name: "Los Angeles Clippers", 
        winning_percentage: 0.426, 
        division_titles: 3, 
        playoff_appearances: 19,
        championships: 0
    },
    
    { 
        name: "Los Angeles Lakers", 
        winning_percentage: 0.592, 
        division_titles: 34, 
        playoff_appearances: 65,
        championships: 17
    },
    
    { 
        name: "Memphis Grizzlies", 
        winning_percentage: 0.437, 
        division_titles: 2, 
        playoff_appearances: 14,
        championships: 0
    },
    
    { 
        name: "Miami Heat", 
        winning_percentage: 0.525, 
        division_titles: 16, 
        playoff_appearances: 26,
        championships: 3
    },
    
    { 
        name: "Milwaukee Bucks", 
        winning_percentage: 0.529, 
        division_titles: 19, 
        playoff_appearances: 37,
        championships: 2
    },
    
    { 
        name: "Minnesota Timberwolves", 
        winning_percentage: 0.416, 
        division_titles: 1, 
        playoff_appearances: 13,
        championships: 0
    },
    
    { 
        name: "New Orleans Pelicans", 
        winning_percentage: 0.461, 
        division_titles: 1, 
        playoff_appearances: 9,
        championships: 0
    },
    
    { 
        name: "New York Knicks", 
        winning_percentage: 0.489, 
        division_titles: 8, 
        playoff_appearances: 46,
        championships: 2
    },
    
    { 
        name: "Oklahoma City Thunder", 
        winning_percentage: 0.541, 
        division_titles: 13, 
        playoff_appearances: 34,
        championships: 2
    },
    
    { 
        name: "Orlando Magic", 
        winning_percentage: 0.470, 
        division_titles: 8, 
        playoff_appearances: 18,
        championships: 0
    },
    
    { 
        name: "Philadelphia 76ers", 
        winning_percentage: 0.519, 
        division_titles: 12, 
        playoff_appearances: 54,
        championships: 3
    },
    
    { 
        name: "Phoenix Suns", 
        winning_percentage: 0.535, 
        division_titles: 8, 
        playoff_appearances: 33,
        championships: 0
    },
    
    { 
        name: "Portland Trail Blazers", 
        winning_percentage: 0.524, 
        division_titles: 6, 
        playoff_appearances: 37,
        championships: 1
    },
    
    { 
        name: "Sacramento Kings", 
        winning_percentage: 0.458, 
        division_titles: 6, 
        playoff_appearances: 30,
        championships: 1
    },
    
    { 
        name: "San Antonio Spurs", 
        winning_percentage: 0.579, 
        division_titles: 22, 
        playoff_appearances: 47,
        championships: 5
    },
    
    { 
        name: "Toronto Raptors", 
        winning_percentage: 0.471, 
        division_titles: 7, 
        playoff_appearances: 13,
        championships: 1
    },
    
    { 
        name: "Utah Jazz", 
        winning_percentage: 0.533, 
        division_titles: 11, 
        playoff_appearances: 31,
        championships: 0
    },
    
    { 
        name: "Washington Wizards", 
        winning_percentage: 0.443, 
        division_titles: 8, 
        playoff_appearances: 30,
        championships: 1
    }
];

console.log(`Extracted data for ${nbaExtractedData.length} NBA teams`);
console.log('Data includes: winning_percentage, division_titles, playoff_appearances, championships');

module.exports = nbaExtractedData;