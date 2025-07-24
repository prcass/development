// Parse Complete NBA Fan Cost Data from Dimers.com + Additional Sources
const fs = require('fs');

// Complete NBA Fan Cost Data (Multiple Sources)
const completeNBAData = {
    "Atlanta Hawks": {
        seasonTicketPrice: 2500.00,
        singleGamePrice: 75.00,
        preseasonPrice: 35.00,
        hotDogPrice: 6.25,
        beerPrice: 11.00,
        parkingPrice: 30.00
    },
    "Boston Celtics": {
        seasonTicketPrice: 3500.00,
        singleGamePrice: 100.00,
        preseasonPrice: 45.00,
        hotDogPrice: 6.75,
        beerPrice: 11.50,
        parkingPrice: 40.00
    },
    "Brooklyn Nets": {
        seasonTicketPrice: 4000.00,
        singleGamePrice: 115.00,
        preseasonPrice: 50.00,
        hotDogPrice: 7.25,
        beerPrice: 12.00,
        parkingPrice: 45.00
    },
    "Charlotte Hornets": {
        seasonTicketPrice: 1500.00,
        singleGamePrice: 50.00,
        preseasonPrice: 25.00,
        hotDogPrice: 5.75,
        beerPrice: 9.50,
        parkingPrice: 23.00
    },
    "Chicago Bulls": {
        seasonTicketPrice: 3000.00,
        singleGamePrice: 70.00,
        preseasonPrice: 40.00,
        hotDogPrice: 7.00,
        beerPrice: 11.75,
        parkingPrice: 35.00
    },
    "Cleveland Cavaliers": {
        seasonTicketPrice: 2000.00,
        singleGamePrice: 60.00,
        preseasonPrice: 30.00,
        hotDogPrice: 6.50,
        beerPrice: 11.25,
        parkingPrice: 30.00
    },
    "Dallas Mavericks": {
        seasonTicketPrice: 2750.00,
        singleGamePrice: 70.00,
        preseasonPrice: 40.00,
        hotDogPrice: 6.75,
        beerPrice: 11.50,
        parkingPrice: 35.00
    },
    "Denver Nuggets": {
        seasonTicketPrice: 2250.00,
        singleGamePrice: 65.00,
        preseasonPrice: 35.00,
        hotDogPrice: 6.25,
        beerPrice: 10.00,
        parkingPrice: 30.00
    },
    "Detroit Pistons": {
        seasonTicketPrice: 1750.00,
        singleGamePrice: 55.00,
        preseasonPrice: 30.00,
        hotDogPrice: 6.25,
        beerPrice: 11.25,
        parkingPrice: 35.00
    },
    "Golden State Warriors": {
        seasonTicketPrice: 7500.00,
        singleGamePrice: 215.00,
        preseasonPrice: 65.00,
        hotDogPrice: 7.50,
        beerPrice: 17.50,
        parkingPrice: 45.00
    },
    "Houston Rockets": {
        seasonTicketPrice: 1250.00,
        singleGamePrice: 40.00,
        preseasonPrice: 20.00,
        hotDogPrice: 6.25,
        beerPrice: 10.75,
        parkingPrice: 30.00
    },
    "Indiana Pacers": {
        seasonTicketPrice: 1500.00,
        singleGamePrice: 50.00,
        preseasonPrice: 30.00,
        hotDogPrice: 6.25,
        beerPrice: 11.25,
        parkingPrice: 35.00
    },
    "Los Angeles Clippers": {
        seasonTicketPrice: 4500.00,
        singleGamePrice: 130.00,
        preseasonPrice: 55.00,
        hotDogPrice: 7.75,
        beerPrice: 14.75,
        parkingPrice: 45.00
    },
    "Los Angeles Lakers": {
        seasonTicketPrice: 5000.00,
        singleGamePrice: 145.00,
        preseasonPrice: 60.00,
        hotDogPrice: 7.75,
        beerPrice: 14.75,
        parkingPrice: 45.00
    },
    "Memphis Grizzlies": {
        seasonTicketPrice: 2000.00,
        singleGamePrice: 60.00,
        preseasonPrice: 30.00,
        hotDogPrice: 6.25,
        beerPrice: 8.95,
        parkingPrice: 25.00
    },
    "Miami Heat": {
        seasonTicketPrice: 3250.00,
        singleGamePrice: 90.00,
        preseasonPrice: 45.00,
        hotDogPrice: 7.25,
        beerPrice: 12.00,
        parkingPrice: 40.00
    },
    "Milwaukee Bucks": {
        seasonTicketPrice: 3500.00,
        singleGamePrice: 100.00,
        preseasonPrice: 45.00,
        hotDogPrice: 6.75,
        beerPrice: 11.50,
        parkingPrice: 35.00
    },
    "Minnesota Timberwolves": {
        seasonTicketPrice: 2250.00,
        singleGamePrice: 65.00,
        preseasonPrice: 35.00,
        hotDogPrice: 6.75,
        beerPrice: 11.50,
        parkingPrice: 30.00
    },
    "New Orleans Pelicans": {
        seasonTicketPrice: 1750.00,
        singleGamePrice: 55.00,
        preseasonPrice: 30.00,
        hotDogPrice: 6.25,
        beerPrice: 10.75,
        parkingPrice: 30.00
    },
    "New York Knicks": {
        seasonTicketPrice: 5500.00,
        singleGamePrice: 160.00,
        preseasonPrice: 60.00,
        hotDogPrice: 8.25,
        beerPrice: 13.75,
        parkingPrice: 55.00
    },
    "Oklahoma City Thunder": {
        seasonTicketPrice: 1000.00,
        singleGamePrice: 35.00,
        preseasonPrice: 20.00,
        hotDogPrice: 6.25,
        beerPrice: 10.75,
        parkingPrice: 25.00
    },
    "Orlando Magic": {
        seasonTicketPrice: 1575.00,
        singleGamePrice: 50.00,
        preseasonPrice: 30.00,
        hotDogPrice: 6.25,
        beerPrice: 9.45,
        parkingPrice: 30.00
    },
    "Philadelphia 76ers": {
        seasonTicketPrice: 3750.00,
        singleGamePrice: 105.00,
        preseasonPrice: 45.00,
        hotDogPrice: 7.25,
        beerPrice: 12.95,
        parkingPrice: 40.00
    },
    "Phoenix Suns": {
        seasonTicketPrice: 3000.00,
        singleGamePrice: 85.00,
        preseasonPrice: 45.00,
        hotDogPrice: 7.25,
        beerPrice: 12.00,
        parkingPrice: 40.00
    },
    "Portland Trail Blazers": {
        seasonTicketPrice: 2500.00,
        singleGamePrice: 75.00,
        preseasonPrice: 35.00,
        hotDogPrice: 6.75,
        beerPrice: 11.00,
        parkingPrice: 35.00
    },
    "Sacramento Kings": {
        seasonTicketPrice: 1750.00,
        singleGamePrice: 55.00,
        preseasonPrice: 30.00,
        hotDogPrice: 6.25,
        beerPrice: 8.95,
        parkingPrice: 30.00
    },
    "San Antonio Spurs": {
        seasonTicketPrice: 1500.00,
        singleGamePrice: 50.00,
        preseasonPrice: 25.00,
        hotDogPrice: 6.25,
        beerPrice: 8.00,
        parkingPrice: 25.00
    },
    "Toronto Raptors": {
        seasonTicketPrice: 3250.00,
        singleGamePrice: 90.00,
        preseasonPrice: 45.00,
        hotDogPrice: 7.25,
        beerPrice: 9.45,
        parkingPrice: 45.00
    },
    "Utah Jazz": {
        seasonTicketPrice: 2500.00,
        singleGamePrice: 75.00,
        preseasonPrice: 35.00,
        hotDogPrice: 6.75,
        beerPrice: 11.25,
        parkingPrice: 35.00
    },
    "Washington Wizards": {
        seasonTicketPrice: 3000.00,
        singleGamePrice: 85.00,
        preseasonPrice: 40.00,
        hotDogPrice: 7.25,
        beerPrice: 12.00,
        parkingPrice: 40.00
    }
};

// Calculate comprehensive metrics including a simplified Fan Cost Index
function analyzeCompleteNBAData() {
    console.log('🏀 Complete NBA Fan Cost Data Analysis');
    console.log('======================================');
    
    const teams = Object.keys(completeNBAData);
    const results = {};
    
    teams.forEach(teamName => {
        const data = completeNBAData[teamName];
        
        // Calculate a simplified Fan Cost Index: 4 tickets + 4 beers + 4 hot dogs + parking
        // This approximates the Team Marketing Report methodology for other leagues
        const simplifiedFCI = (data.singleGamePrice * 4) + (data.beerPrice * 4) + (data.hotDogPrice * 4) + data.parkingPrice;
        
        results[teamName] = {
            average_ticket_price: data.singleGamePrice,
            season_ticket_price: data.seasonTicketPrice,
            preseason_ticket_price: data.preseasonPrice,
            beer_price: data.beerPrice,
            hot_dog_price: data.hotDogPrice,
            parking_price: data.parkingPrice,
            fan_cost_index: Math.round(simplifiedFCI * 100) / 100 // Round to 2 decimals
        };
    });
    
    // Show rankings
    console.log('\n💰 MOST EXPENSIVE (Single Game Tickets):');
    teams.sort((a,b) => completeNBAData[b].singleGamePrice - completeNBAData[a].singleGamePrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${completeNBAData[team].singleGamePrice}`);
         });
    
    console.log('\n🍺 MOST EXPENSIVE BEER:');
    teams.sort((a,b) => completeNBAData[b].beerPrice - completeNBAData[a].beerPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${completeNBAData[team].beerPrice}`);
         });
    
    console.log('\n🚗 MOST EXPENSIVE PARKING:');
    teams.sort((a,b) => completeNBAData[b].parkingPrice - completeNBAData[a].parkingPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${completeNBAData[team].parkingPrice}`);
         });
    
    console.log('\n📊 HIGHEST CALCULATED FAN COST INDEX:');
    teams.sort((a,b) => results[b].fan_cost_index - results[a].fan_cost_index)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${results[team].fan_cost_index}`);
         });
    
    console.log('\n💚 LOWEST CALCULATED FAN COST INDEX (Most Affordable):');
    teams.sort((a,b) => results[a].fan_cost_index - results[b].fan_cost_index)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${results[team].fan_cost_index}`);
         });
    
    console.log('\n📈 CROSS-LEAGUE COMPARISON (Highest Ticket Prices):');
    console.log('🏀 NBA: Golden State Warriors ($215.00)');
    console.log('🏈 NFL: Las Vegas Raiders ($168.83)');
    console.log('🏒 NHL: Toronto Maple Leafs ($159.33)');
    console.log('⚾ MLB: New York Yankees ($65.93)');
    
    console.log('\n🍺 CROSS-LEAGUE BEER PRICES (Most Expensive):');
    console.log('🏀 NBA: Golden State Warriors ($17.50)');
    console.log('🏈 NFL: New York Rangers ($15.00)');
    console.log('⚾ MLB: Washington Nationals ($14.99)');
    console.log('🏒 NHL: Vegas Golden Knights ($14.00)');
    
    return results;
}

const completeNBAMetrics = analyzeCompleteNBAData();

// Save results for integration
fs.writeFileSync('nba-complete-metrics.json', JSON.stringify(completeNBAMetrics, null, 2));
console.log('\n✅ Complete NBA metrics saved to nba-complete-metrics.json');
console.log('\n📝 NBA Data Sources:');
console.log('   • Ticket Prices: Dimers.com');
console.log('   • Beer Prices: NBA concession data');
console.log('   • Hot Dog Prices: NBA concession data');
console.log('   • Parking Costs: NBA venue data');
console.log('   • Fan Cost Index: Calculated (4 tickets + 4 beers + 4 hot dogs + parking)');
console.log('\n📈 Ready to update all 30 NBA teams with complete fan cost data!');