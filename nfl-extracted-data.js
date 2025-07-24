// Extracted NFL data from Sports Reference table
// Columns: Tm,From,To,W,L,T,W-L%,AV,Passer,Rusher,Receiver,Coaching,Yr plyf,W plyf,L plyf,W-L%,Chmp,SBwl,Conf,Div
// Using the main franchise entries (first line for each team)

const nflExtractedData = [
    { 
        name: "Arizona Cardinals", 
        winning_percentage: 0.422, 
        division_titles: 8, 
        playoff_appearances: 11,  // "Yr plyf" column
        championships: 2,        // "Chmp" column
        super_bowls: 0          // "SBwl" column
    },
    
    { 
        name: "Atlanta Falcons", 
        winning_percentage: 0.438, 
        division_titles: 7, 
        playoff_appearances: 14,
        championships: 0,
        super_bowls: 0
    },
    
    { 
        name: "Baltimore Ravens", 
        winning_percentage: 0.574, 
        division_titles: 8, 
        playoff_appearances: 16,
        championships: 2,
        super_bowls: 2
    },
    
    { 
        name: "Buffalo Bills", 
        winning_percentage: 0.490, 
        division_titles: 16, 
        playoff_appearances: 24,
        championships: 2,
        super_bowls: 0
    },
    
    { 
        name: "Carolina Panthers", 
        winning_percentage: 0.454, 
        division_titles: 6, 
        playoff_appearances: 8,
        championships: 0,
        super_bowls: 0
    },
    
    { 
        name: "Chicago Bears", 
        winning_percentage: 0.553, 
        division_titles: 24, 
        playoff_appearances: 27,
        championships: 9,
        super_bowls: 1
    },
    
    { 
        name: "Cincinnati Bengals", 
        winning_percentage: 0.457, 
        division_titles: 12, 
        playoff_appearances: 16,
        championships: 0,
        super_bowls: 0
    },
    
    { 
        name: "Cleveland Browns", 
        winning_percentage: 0.506, 
        division_titles: 23, 
        playoff_appearances: 30,
        championships: 8,
        super_bowls: 0
    },
    
    { 
        name: "Dallas Cowboys", 
        winning_percentage: 0.574, 
        division_titles: 26, 
        playoff_appearances: 36,
        championships: 5,
        super_bowls: 5
    },
    
    { 
        name: "Denver Broncos", 
        winning_percentage: 0.523, 
        division_titles: 15, 
        playoff_appearances: 23,
        championships: 3,
        super_bowls: 3
    },
    
    { 
        name: "Detroit Lions", 
        winning_percentage: 0.461, 
        division_titles: 10, 
        playoff_appearances: 19,
        championships: 4,
        super_bowls: 0
    },
    
    { 
        name: "Green Bay Packers", 
        winning_percentage: 0.572, 
        division_titles: 31, 
        playoff_appearances: 37,
        championships: 13,
        super_bowls: 4
    },
    
    { 
        name: "Houston Texans", 
        winning_percentage: 0.437, 
        division_titles: 8, 
        playoff_appearances: 8,
        championships: 0,
        super_bowls: 0
    },
    
    { 
        name: "Indianapolis Colts", 
        winning_percentage: 0.525, 
        division_titles: 21, 
        playoff_appearances: 29,
        championships: 4,
        super_bowls: 2
    },
    
    { 
        name: "Jacksonville Jaguars", 
        winning_percentage: 0.417, 
        division_titles: 4, 
        playoff_appearances: 8,
        championships: 0,
        super_bowls: 0
    },
    
    { 
        name: "Kansas City Chiefs", 
        winning_percentage: 0.553, 
        division_titles: 18, 
        playoff_appearances: 27,
        championships: 5,
        super_bowls: 4
    },
    
    { 
        name: "Las Vegas Raiders", 
        winning_percentage: 0.515, 
        division_titles: 16, 
        playoff_appearances: 23,
        championships: 3,
        super_bowls: 3
    },
    
    { 
        name: "Los Angeles Chargers", 
        winning_percentage: 0.499, 
        division_titles: 15, 
        playoff_appearances: 21,
        championships: 1,
        super_bowls: 0
    },
    
    { 
        name: "Los Angeles Rams", 
        winning_percentage: 0.507, 
        division_titles: 22, 
        playoff_appearances: 33,
        championships: 4,
        super_bowls: 2
    },
    
    { 
        name: "Miami Dolphins", 
        winning_percentage: 0.553, 
        division_titles: 14, 
        playoff_appearances: 25,
        championships: 2,
        super_bowls: 2
    },
    
    { 
        name: "Minnesota Vikings", 
        winning_percentage: 0.551, 
        division_titles: 21, 
        playoff_appearances: 32,
        championships: 0,
        super_bowls: 0
    },
    
    { 
        name: "New England Patriots", 
        winning_percentage: 0.550, 
        division_titles: 22, 
        playoff_appearances: 28,
        championships: 6,
        super_bowls: 6
    },
    
    { 
        name: "New Orleans Saints", 
        winning_percentage: 0.465, 
        division_titles: 9, 
        playoff_appearances: 14,
        championships: 1,
        super_bowls: 1
    },
    
    { 
        name: "New York Giants", 
        winning_percentage: 0.522, 
        division_titles: 25, 
        playoff_appearances: 33,
        championships: 8,
        super_bowls: 4
    },
    
    { 
        name: "New York Jets", 
        winning_percentage: 0.437, 
        division_titles: 4, 
        playoff_appearances: 14,
        championships: 1,
        super_bowls: 1
    },
    
    { 
        name: "Philadelphia Eagles", 
        winning_percentage: 0.500, 
        division_titles: 17, 
        playoff_appearances: 31,
        championships: 5,
        super_bowls: 2
    },
    
    { 
        name: "Pittsburgh Steelers", 
        winning_percentage: 0.538, 
        division_titles: 25, 
        playoff_appearances: 35,
        championships: 6,
        super_bowls: 6
    },
    
    { 
        name: "San Francisco 49ers", 
        winning_percentage: 0.545, 
        division_titles: 23, 
        playoff_appearances: 30,
        championships: 5,
        super_bowls: 5
    },
    
    { 
        name: "Seattle Seahawks", 
        winning_percentage: 0.519, 
        division_titles: 11, 
        playoff_appearances: 20,
        championships: 1,
        super_bowls: 1
    },
    
    { 
        name: "Tampa Bay Buccaneers", 
        winning_percentage: 0.410, 
        division_titles: 10, 
        playoff_appearances: 15,
        championships: 2,
        super_bowls: 2
    },
    
    { 
        name: "Tennessee Titans", 
        winning_percentage: 0.482, 
        division_titles: 11, 
        playoff_appearances: 25,
        championships: 2,
        super_bowls: 0
    },
    
    { 
        name: "Washington Commanders", 
        winning_percentage: 0.497, 
        division_titles: 16, 
        playoff_appearances: 26,
        championships: 5,
        super_bowls: 3
    }
];

console.log(`Extracted data for ${nflExtractedData.length} NFL teams`);
console.log('Data includes: winning_percentage, division_titles, playoff_appearances, championships, super_bowls');

module.exports = nflExtractedData;