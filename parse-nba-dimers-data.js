// Parse NBA Fan Cost Data from Dimers.com (different format)
const fs = require('fs');

// NBA Fan Cost Data from Dimers.com
const nbaDimersData = {
    "Atlanta Hawks": {
        seasonTicketPrice: 2500.00,
        singleGamePrice: 75.00,
        preseasonPrice: 35.00
    },
    "Boston Celtics": {
        seasonTicketPrice: 3500.00,
        singleGamePrice: 100.00,
        preseasonPrice: 45.00
    },
    "Brooklyn Nets": {
        seasonTicketPrice: 4000.00,
        singleGamePrice: 115.00,
        preseasonPrice: 50.00
    },
    "Charlotte Hornets": {
        seasonTicketPrice: 1500.00,
        singleGamePrice: 50.00,
        preseasonPrice: 25.00
    },
    "Chicago Bulls": {
        seasonTicketPrice: 3000.00,
        singleGamePrice: 70.00,
        preseasonPrice: 40.00
    },
    "Cleveland Cavaliers": {
        seasonTicketPrice: 2000.00,
        singleGamePrice: 60.00,
        preseasonPrice: 30.00
    },
    "Dallas Mavericks": {
        seasonTicketPrice: 2750.00,
        singleGamePrice: 70.00,
        preseasonPrice: 40.00
    },
    "Denver Nuggets": {
        seasonTicketPrice: 2250.00,
        singleGamePrice: 65.00,
        preseasonPrice: 35.00
    },
    "Detroit Pistons": {
        seasonTicketPrice: 1750.00,
        singleGamePrice: 55.00,
        preseasonPrice: 30.00
    },
    "Golden State Warriors": {
        seasonTicketPrice: 7500.00,
        singleGamePrice: 215.00,
        preseasonPrice: 65.00
    },
    "Houston Rockets": {
        seasonTicketPrice: 1250.00,
        singleGamePrice: 40.00,
        preseasonPrice: 20.00
    },
    "Indiana Pacers": {
        seasonTicketPrice: 1500.00,
        singleGamePrice: 50.00,
        preseasonPrice: 30.00
    },
    "Los Angeles Clippers": {
        seasonTicketPrice: 4500.00,
        singleGamePrice: 130.00,
        preseasonPrice: 55.00
    },
    "Los Angeles Lakers": {
        seasonTicketPrice: 5000.00,
        singleGamePrice: 145.00,
        preseasonPrice: 60.00
    },
    "Memphis Grizzlies": {
        seasonTicketPrice: 2000.00,
        singleGamePrice: 60.00,
        preseasonPrice: 30.00
    },
    "Miami Heat": {
        seasonTicketPrice: 3250.00,
        singleGamePrice: 90.00,
        preseasonPrice: 45.00
    },
    "Milwaukee Bucks": {
        seasonTicketPrice: 3500.00,
        singleGamePrice: 100.00,
        preseasonPrice: 45.00
    },
    "Minnesota Timberwolves": {
        seasonTicketPrice: 2250.00,
        singleGamePrice: 65.00,
        preseasonPrice: 35.00
    },
    "New Orleans Pelicans": {
        seasonTicketPrice: 1750.00,
        singleGamePrice: 55.00,
        preseasonPrice: 30.00
    },
    "New York Knicks": {
        seasonTicketPrice: 5500.00,
        singleGamePrice: 160.00,
        preseasonPrice: 60.00
    },
    "Oklahoma City Thunder": {
        seasonTicketPrice: 1000.00,
        singleGamePrice: 35.00,
        preseasonPrice: 20.00
    },
    "Orlando Magic": {
        seasonTicketPrice: 1575.00,
        singleGamePrice: 50.00,
        preseasonPrice: 30.00
    },
    "Philadelphia 76ers": {
        seasonTicketPrice: 3750.00,
        singleGamePrice: 105.00,
        preseasonPrice: 45.00
    },
    "Phoenix Suns": {
        seasonTicketPrice: 3000.00,
        singleGamePrice: 85.00,
        preseasonPrice: 45.00
    },
    "Portland Trail Blazers": {
        seasonTicketPrice: 2500.00,
        singleGamePrice: 75.00,
        preseasonPrice: 35.00
    },
    "Sacramento Kings": {
        seasonTicketPrice: 1750.00,
        singleGamePrice: 55.00,
        preseasonPrice: 30.00
    },
    "San Antonio Spurs": {
        seasonTicketPrice: 1500.00,
        singleGamePrice: 50.00,
        preseasonPrice: 25.00
    },
    "Toronto Raptors": {
        seasonTicketPrice: 3250.00,
        singleGamePrice: 90.00,
        preseasonPrice: 45.00
    },
    "Utah Jazz": {
        seasonTicketPrice: 2500.00,
        singleGamePrice: 75.00,
        preseasonPrice: 35.00
    },
    "Washington Wizards": {
        seasonTicketPrice: 3000.00,
        singleGamePrice: 85.00,
        preseasonPrice: 40.00
    }
};

// Calculate additional metrics and prepare for integration
function analyzeNBADimersData() {
    console.log('🏀 NBA Fan Cost Data Analysis (Dimers.com)');
    console.log('==========================================');
    
    const teams = Object.keys(nbaDimersData);
    const results = {};
    
    teams.forEach(teamName => {
        const data = nbaDimersData[teamName];
        
        results[teamName] = {
            // Use single game price as the "average_ticket_price" to match other leagues
            average_ticket_price: data.singleGamePrice,
            season_ticket_price: data.seasonTicketPrice,
            preseason_ticket_price: data.preseasonPrice,
            // Set NBA-specific fields - no beer/parking data from Dimers, so set to 0
            beer_price: 0,
            parking_price: 0,
            fan_cost_index: 0 // No comprehensive FCI from Dimers
        };
    });
    
    // Show rankings
    console.log('\n💰 MOST EXPENSIVE (Single Game Tickets):');
    teams.sort((a,b) => nbaDimersData[b].singleGamePrice - nbaDimersData[a].singleGamePrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nbaDimersData[team].singleGamePrice}`);
         });
    
    console.log('\n💲 MOST AFFORDABLE (Single Game Tickets):');
    teams.sort((a,b) => nbaDimersData[a].singleGamePrice - nbaDimersData[b].singleGamePrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nbaDimersData[team].singleGamePrice}`);
         });
    
    console.log('\n🎫 MOST EXPENSIVE (Season Tickets):');
    teams.sort((a,b) => nbaDimersData[b].seasonTicketPrice - nbaDimersData[a].seasonTicketPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nbaDimersData[team].seasonTicketPrice.toLocaleString()}`);
         });
    
    console.log('\n💚 MOST AFFORDABLE (Season Tickets):');
    teams.sort((a,b) => nbaDimersData[a].seasonTicketPrice - nbaDimersData[b].seasonTicketPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nbaDimersData[team].seasonTicketPrice.toLocaleString()}`);
         });
    
    console.log('\n📊 PRICE COMPARISON:');
    console.log('🏀 NBA vs Other Leagues (Single Game Tickets):');
    console.log(`Highest NBA: Golden State Warriors ($${nbaDimersData["Golden State Warriors"].singleGamePrice})`);
    console.log('🏈 Highest NFL: Las Vegas Raiders ($168.83)');
    console.log('🏒 Highest NHL: Toronto Maple Leafs ($159.33)');
    console.log('⚾ Highest MLB: New York Yankees ($65.93)');
    
    return results;
}

const nbaDimersMetrics = analyzeNBADimersData();

// Save results for integration
fs.writeFileSync('nba-dimers-metrics.json', JSON.stringify(nbaDimersMetrics, null, 2));
console.log('\n✅ NBA Dimers metrics saved to nba-dimers-metrics.json');
console.log('\n📝 Note: Dimers.com format different from Team Marketing Report');
console.log('   • Has: Single game, Season, Preseason ticket prices');
console.log('   • Missing: Beer prices, parking, comprehensive Fan Cost Index');
console.log('   • Will use single game price as "average_ticket_price" for consistency');
console.log('\n📈 Ready to update NBA teams with Dimers.com ticket pricing data');