// Extracted MLB data from Sports Reference table
// Columns: Rk,Franchise,From,To,G,W,L,W-L%,G>.500,Divs,Pnnts,WS,Playoffs,Players,HOF#...

const mlbExtractedData = [
    // Row 1: Arizona Diamondbacks
    { 
        name: "Arizona Diamondbacks", 
        winning_percentage: 0.489, 
        division_titles: 5, 
        playoff_appearances: 7,  // "Playoffs" column
        world_series: 1          // "WS" column
    },
    
    // Row 2: Athletics (Oakland Athletics in our data)
    { 
        name: "Oakland Athletics", 
        winning_percentage: 0.486, 
        division_titles: 17, 
        playoff_appearances: 29,
        world_series: 9
    },
    
    // Row 3: Atlanta Braves
    { 
        name: "Atlanta Braves", 
        winning_percentage: 0.503, 
        division_titles: 23, 
        playoff_appearances: 30,
        world_series: 4
    },
    
    // Row 4: Baltimore Orioles
    { 
        name: "Baltimore Orioles", 
        winning_percentage: 0.475, 
        division_titles: 10, 
        playoff_appearances: 16,
        world_series: 3
    },
    
    // Row 5: Boston Red Sox
    { 
        name: "Boston Red Sox", 
        winning_percentage: 0.518, 
        division_titles: 10, 
        playoff_appearances: 25,
        world_series: 9
    },
    
    // Row 6: Chicago Cubs
    { 
        name: "Chicago Cubs", 
        winning_percentage: 0.513, 
        division_titles: 8, 
        playoff_appearances: 21,
        world_series: 3
    },
    
    // Row 7: Chicago White Sox
    { 
        name: "Chicago White Sox", 
        winning_percentage: 0.499, 
        division_titles: 6, 
        playoff_appearances: 11,
        world_series: 3
    },
    
    // Row 8: Cincinnati Reds
    { 
        name: "Cincinnati Reds", 
        winning_percentage: 0.504, 
        division_titles: 10, 
        playoff_appearances: 16,
        world_series: 5
    },
    
    // Row 9: Cleveland Guardians
    { 
        name: "Cleveland Guardians", 
        winning_percentage: 0.512, 
        division_titles: 12, 
        playoff_appearances: 17,
        world_series: 2
    },
    
    // Row 10: Colorado Rockies
    { 
        name: "Colorado Rockies", 
        winning_percentage: 0.458, 
        division_titles: 0, 
        playoff_appearances: 5,
        world_series: 0
    },
    
    // Row 11: Detroit Tigers
    { 
        name: "Detroit Tigers", 
        winning_percentage: 0.503, 
        division_titles: 7, 
        playoff_appearances: 17,
        world_series: 4
    },
    
    // Row 12: Houston Astros
    { 
        name: "Houston Astros", 
        winning_percentage: 0.503, 
        division_titles: 14, 
        playoff_appearances: 18,
        world_series: 2
    },
    
    // Row 13: Kansas City Royals
    { 
        name: "Kansas City Royals", 
        winning_percentage: 0.477, 
        division_titles: 8, 
        playoff_appearances: 10,
        world_series: 2
    },
    
    // Row 14: Los Angeles Angels
    { 
        name: "Los Angeles Angels", 
        winning_percentage: 0.495, 
        division_titles: 9, 
        playoff_appearances: 10,
        world_series: 1
    },
    
    // Row 15: Los Angeles Dodgers
    { 
        name: "Los Angeles Dodgers", 
        winning_percentage: 0.532, 
        division_titles: 22, 
        playoff_appearances: 38,
        world_series: 8
    },
    
    // Row 16: Miami Marlins
    { 
        name: "Miami Marlins", 
        winning_percentage: 0.460, 
        division_titles: 0, 
        playoff_appearances: 4,
        world_series: 2
    },
    
    // Row 17: Milwaukee Brewers
    { 
        name: "Milwaukee Brewers", 
        winning_percentage: 0.489, 
        division_titles: 7, 
        playoff_appearances: 10,
        world_series: 0
    },
    
    // Row 18: Minnesota Twins
    { 
        name: "Minnesota Twins", 
        winning_percentage: 0.482, 
        division_titles: 13, 
        playoff_appearances: 18,
        world_series: 3
    },
    
    // Row 19: New York Mets
    { 
        name: "New York Mets", 
        winning_percentage: 0.484, 
        division_titles: 6, 
        playoff_appearances: 11,
        world_series: 2
    },
    
    // Row 20: New York Yankees
    { 
        name: "New York Yankees", 
        winning_percentage: 0.569, 
        division_titles: 21, 
        playoff_appearances: 59,
        world_series: 27
    },
    
    // Row 21: Philadelphia Phillies
    { 
        name: "Philadelphia Phillies", 
        winning_percentage: 0.474, 
        division_titles: 13, 
        playoff_appearances: 17,
        world_series: 2
    },
    
    // Row 22: Pittsburgh Pirates
    { 
        name: "Pittsburgh Pirates", 
        winning_percentage: 0.500, 
        division_titles: 9, 
        playoff_appearances: 17,
        world_series: 5
    },
    
    // Row 23: San Diego Padres
    { 
        name: "San Diego Padres", 
        winning_percentage: 0.468, 
        division_titles: 5, 
        playoff_appearances: 8,
        world_series: 0
    },
    
    // Row 24: San Francisco Giants
    { 
        name: "San Francisco Giants", 
        winning_percentage: 0.535, 
        division_titles: 9, 
        playoff_appearances: 27,
        world_series: 8
    },
    
    // Row 25: Seattle Mariners
    { 
        name: "Seattle Mariners", 
        winning_percentage: 0.478, 
        division_titles: 3, 
        playoff_appearances: 5,
        world_series: 0
    },
    
    // Row 26: St. Louis Cardinals
    { 
        name: "St. Louis Cardinals", 
        winning_percentage: 0.520, 
        division_titles: 15, 
        playoff_appearances: 32,
        world_series: 11
    },
    
    // Row 27: Tampa Bay Rays
    { 
        name: "Tampa Bay Rays", 
        winning_percentage: 0.490, 
        division_titles: 4, 
        playoff_appearances: 9,
        world_series: 0
    },
    
    // Row 28: Texas Rangers
    { 
        name: "Texas Rangers", 
        winning_percentage: 0.476, 
        division_titles: 7, 
        playoff_appearances: 9,
        world_series: 1
    },
    
    // Row 29: Toronto Blue Jays
    { 
        name: "Toronto Blue Jays", 
        winning_percentage: 0.499, 
        division_titles: 6, 
        playoff_appearances: 10,
        world_series: 2
    },
    
    // Row 30: Washington Nationals
    { 
        name: "Washington Nationals", 
        winning_percentage: 0.482, 
        division_titles: 5, 
        playoff_appearances: 6,
        world_series: 1
    }
];

console.log(`Extracted data for ${mlbExtractedData.length} MLB teams`);
console.log('Data includes: winning_percentage, division_titles, playoff_appearances, world_series');

module.exports = mlbExtractedData;