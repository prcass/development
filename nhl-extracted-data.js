// Extracted NHL data from Sports Reference table
// Columns: Franchise,Lg,From,To,Yrs,GP,W,L,T,OL,PTS,PTS%,Yrs Plyf,Div,Conf,Champ,St Cup
// Using the main franchise entries (first line for each team)

const nhlExtractedData = [
    { 
        name: "Anaheim Ducks", 
        winning_percentage: 0.521, 
        division_titles: 6, 
        playoff_appearances: 14,  // "Yrs Plyf" column
        championships: 1,        // "Champ" column
        stanley_cups: 1         // "St Cup" column
    },
    
    { 
        name: "Boston Bruins", 
        winning_percentage: 0.567, 
        division_titles: 30, 
        playoff_appearances: 77,
        championships: 6,
        stanley_cups: 6
    },
    
    { 
        name: "Buffalo Sabres", 
        winning_percentage: 0.528, 
        division_titles: 6, 
        playoff_appearances: 29,
        championships: 0,
        stanley_cups: 0
    },
    
    { 
        name: "Calgary Flames", 
        winning_percentage: 0.539, 
        division_titles: 8, 
        playoff_appearances: 31,
        championships: 1,
        stanley_cups: 1
    },
    
    { 
        name: "Carolina Hurricanes", 
        winning_percentage: 0.505, 
        division_titles: 7, 
        playoff_appearances: 20,
        championships: 1,
        stanley_cups: 1
    },
    
    { 
        name: "Chicago Blackhawks", 
        winning_percentage: 0.497, 
        division_titles: 17, 
        playoff_appearances: 63,
        championships: 6,
        stanley_cups: 6
    },
    
    { 
        name: "Colorado Avalanche", 
        winning_percentage: 0.540, 
        division_titles: 14, 
        playoff_appearances: 30,
        championships: 3,
        stanley_cups: 3
    },
    
    { 
        name: "Columbus Blue Jackets", 
        winning_percentage: 0.486, 
        division_titles: 0, 
        playoff_appearances: 6,
        championships: 0,
        stanley_cups: 0
    },
    
    { 
        name: "Dallas Stars", 
        winning_percentage: 0.526, 
        division_titles: 11, 
        playoff_appearances: 37,
        championships: 1,
        stanley_cups: 1
    },
    
    { 
        name: "Detroit Red Wings", 
        winning_percentage: 0.530, 
        division_titles: 29, 
        playoff_appearances: 64,
        championships: 11,
        stanley_cups: 11
    },
    
    { 
        name: "Edmonton Oilers", 
        winning_percentage: 0.531, 
        division_titles: 6, 
        playoff_appearances: 27,
        championships: 5,
        stanley_cups: 5
    },
    
    { 
        name: "Florida Panthers", 
        winning_percentage: 0.523, 
        division_titles: 4, 
        playoff_appearances: 11,
        championships: 2,
        stanley_cups: 2
    },
    
    { 
        name: "Los Angeles Kings", 
        winning_percentage: 0.501, 
        division_titles: 1, 
        playoff_appearances: 34,
        championships: 2,
        stanley_cups: 2
    },
    
    { 
        name: "Minnesota Wild", 
        winning_percentage: 0.561, 
        division_titles: 1, 
        playoff_appearances: 14,
        championships: 0,
        stanley_cups: 0
    },
    
    { 
        name: "Montreal Canadiens", 
        winning_percentage: 0.580, 
        division_titles: 37, 
        playoff_appearances: 86,
        championships: 25,
        stanley_cups: 23
    },
    
    { 
        name: "Nashville Predators", 
        winning_percentage: 0.554, 
        division_titles: 2, 
        playoff_appearances: 16,
        championships: 0,
        stanley_cups: 0
    },
    
    { 
        name: "New Jersey Devils", 
        winning_percentage: 0.494, 
        division_titles: 9, 
        playoff_appearances: 25,
        championships: 3,
        stanley_cups: 3
    },
    
    { 
        name: "New York Islanders", 
        winning_percentage: 0.515, 
        division_titles: 6, 
        playoff_appearances: 29,
        championships: 4,
        stanley_cups: 4
    },
    
    { 
        name: "New York Rangers", 
        winning_percentage: 0.519, 
        division_titles: 9, 
        playoff_appearances: 63,
        championships: 4,
        stanley_cups: 4
    },
    
    { 
        name: "Ottawa Senators", 
        winning_percentage: 0.507, 
        division_titles: 4, 
        playoff_appearances: 17,
        championships: 0,
        stanley_cups: 0
    },
    
    { 
        name: "Philadelphia Flyers", 
        winning_percentage: 0.566, 
        division_titles: 16, 
        playoff_appearances: 40,
        championships: 2,
        stanley_cups: 2
    },
    
    { 
        name: "Pittsburgh Penguins", 
        winning_percentage: 0.523, 
        division_titles: 10, 
        playoff_appearances: 37,
        championships: 5,
        stanley_cups: 5
    },
    
    { 
        name: "San Jose Sharks", 
        winning_percentage: 0.511, 
        division_titles: 6, 
        playoff_appearances: 21,
        championships: 0,
        stanley_cups: 0
    },
    
    { 
        name: "Seattle Kraken", 
        winning_percentage: 0.483, 
        division_titles: 0, 
        playoff_appearances: 1,
        championships: 0,
        stanley_cups: 0
    },
    
    { 
        name: "St. Louis Blues", 
        winning_percentage: 0.537, 
        division_titles: 10, 
        playoff_appearances: 46,
        championships: 1,
        stanley_cups: 1
    },
    
    { 
        name: "Tampa Bay Lightning", 
        winning_percentage: 0.523, 
        division_titles: 4, 
        playoff_appearances: 17,
        championships: 3,
        stanley_cups: 3
    },
    
    { 
        name: "Toronto Maple Leafs", 
        winning_percentage: 0.520, 
        division_titles: 10, 
        playoff_appearances: 74,
        championships: 13,
        stanley_cups: 13
    },
    
    { 
        name: "Utah Hockey Club", 
        winning_percentage: 0.543, 
        division_titles: 0, 
        playoff_appearances: 0,
        championships: 0,
        stanley_cups: 0
    },
    
    { 
        name: "Vancouver Canucks", 
        winning_percentage: 0.494, 
        division_titles: 11, 
        playoff_appearances: 29,
        championships: 0,
        stanley_cups: 0
    },
    
    { 
        name: "Vegas Golden Knights", 
        winning_percentage: 0.632, 
        division_titles: 5, 
        playoff_appearances: 7,
        championships: 1,
        stanley_cups: 1
    },
    
    { 
        name: "Washington Capitals", 
        winning_percentage: 0.536, 
        division_titles: 14, 
        playoff_appearances: 34,
        championships: 1,
        stanley_cups: 1
    },
    
    { 
        name: "Winnipeg Jets", 
        winning_percentage: 0.519, 
        division_titles: 2, 
        playoff_appearances: 9,
        championships: 0,
        stanley_cups: 0
    }
];

console.log(`Extracted data for ${nhlExtractedData.length} NHL teams`);
console.log('Data includes: winning_percentage, division_titles, playoff_appearances, championships, stanley_cups');

module.exports = nhlExtractedData;