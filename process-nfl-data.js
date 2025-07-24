// Process NFL data table and add teams to sports dataset
const fs = require('fs');

// NFL data extracted from the table (current franchises only)
const nflTeams = [
    {
        name: "Arizona Cardinals",
        code: "002",
        league: "NFL",
        all_time_wins: 593,
        championship_count: 2, // NFL Championships
        playoff_appearances: 11,
        originalCode: "ARIZONA_CARDS"
    },
    {
        name: "Atlanta Falcons", 
        code: "003",
        league: "NFL",
        all_time_wins: 398,
        championship_count: 0,
        playoff_appearances: 14,
        originalCode: "ATLANTA_FALCONS"
    },
    {
        name: "Baltimore Ravens",
        code: "004", 
        league: "NFL",
        all_time_wins: 268,
        championship_count: 2, // Super Bowls
        playoff_appearances: 16,
        originalCode: "BALTIMORE_RAVENS"
    },
    {
        name: "Buffalo Bills",
        code: "005",
        league: "NFL", 
        all_time_wins: 486,
        championship_count: 2, // AFL Championships
        playoff_appearances: 24,
        originalCode: "BUFFALO_BILLS"
    },
    {
        name: "Carolina Panthers",
        code: "006",
        league: "NFL",
        all_time_wins: 219,
        championship_count: 0,
        playoff_appearances: 8,
        originalCode: "CAROLINA_PANTHERS"
    },
    {
        name: "Chicago Bears",
        code: "007",
        league: "NFL",
        all_time_wins: 798,
        championship_count: 9, // NFL Championships + 1 Super Bowl
        playoff_appearances: 27,
        originalCode: "CHICAGO_BEARS"
    },
    {
        name: "Cincinnati Bengals",
        code: "008",
        league: "NFL",
        all_time_wins: 403,
        championship_count: 0,
        playoff_appearances: 16,
        originalCode: "CINCINNATI_BENGALS"
    },
    {
        name: "Cleveland Browns",
        code: "009",
        league: "NFL",
        all_time_wins: 562,
        championship_count: 8, // NFL Championships
        playoff_appearances: 30,
        originalCode: "CLEVELAND_BROWNS"
    },
    // Dallas Cowboys already added as 001
    {
        name: "Denver Broncos",
        code: "010",
        league: "NFL",
        all_time_wins: 518,
        championship_count: 3, // Super Bowls
        playoff_appearances: 23,
        originalCode: "DENVER_BRONCOS"
    },
    {
        name: "Detroit Lions",
        code: "011",
        league: "NFL",
        all_time_wins: 606,
        championship_count: 4, // NFL Championships
        playoff_appearances: 19,
        originalCode: "DETROIT_LIONS"
    },
    {
        name: "Green Bay Packers",
        code: "012",
        league: "NFL",
        all_time_wins: 810,
        championship_count: 13, // NFL Championships + Super Bowls
        playoff_appearances: 37,
        originalCode: "GREEN_BAY_PACKERS"
    },
    // Continue with remaining teams...
];

// Add placeholder data for fields we don't have yet
const addPlaceholderData = (team) => {
    return {
        ...team,
        stadium_capacity: 70000, // Average NFL stadium capacity
        team_value: 3.5, // Average NFL team value in billions
        hall_of_fame_players: 15, // Placeholder
        annual_revenue: 400.0, // Placeholder in millions
        payroll_total: 240.0, // Approximate salary cap
        player_salaries_avg: 4.5, // Placeholder
        season_wins: 8, // Placeholder for average season
        social_media_followers: 5.0, // Placeholder in millions
        home_attendance: 95.0 // Placeholder percentage
    };
};

console.log('Processing NFL data...');
console.log('Sample team data:');
console.log(JSON.stringify(addPlaceholderData(nflTeams[0]), null, 2));