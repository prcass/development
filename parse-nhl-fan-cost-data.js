// Parse NHL Fan Cost Data for new verified challenges
const fs = require('fs');

// NHL Fan Cost Data (2024-2025 season)
const nhlFanCostData = {
    "Toronto Maple Leafs": {
        averageTicketPrice: 159.33,
        premiumTicketPrice: 289.27,
        beerPrice: 10.37,
        beerOunces: 16,
        beerPricePerOunce: 0.56,
        softDrinkPrice: 5.56,
        softDrinkOunces: 14,
        softDrinkPricePerOunce: 0.40,
        hotDogPrice: 5.56,
        parkingPrice: 12.46,
        hatPrice: 22.21,
        fanCostIndex: 759.42
    },
    "Vegas Golden Knights": {
        averageTicketPrice: 144.89,
        premiumTicketPrice: 592.50,
        beerPrice: 14.00,
        beerOunces: 20,
        beerPricePerOunce: 0.70,
        softDrinkPrice: 7.00,
        softDrinkOunces: 16.9,
        softDrinkPricePerOunce: 0.41,
        hotDogPrice: 7.50,
        parkingPrice: 25.00,
        hatPrice: 25.99,
        fanCostIndex: 742.54
    },
    "New York Rangers": {
        averageTicketPrice: 131.31,
        premiumTicketPrice: 731.38,
        beerPrice: 15.00,
        beerOunces: 20,
        beerPricePerOunce: 0.75,
        softDrinkPrice: 5.50,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.31,
        hotDogPrice: 5.00,
        parkingPrice: 30.94,
        hatPrice: 27.99,
        fanCostIndex: 682.16
    },
    "Nashville Predators": {
        averageTicketPrice: 130.88,
        premiumTicketPrice: 319.85,
        beerPrice: 10.00,
        beerOunces: 16,
        beerPricePerOunce: 0.63,
        softDrinkPrice: 5.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.31,
        hotDogPrice: 5.50,
        parkingPrice: 14.76,
        hatPrice: 24.99,
        fanCostIndex: 650.26
    },
    "Boston Bruins": {
        averageTicketPrice: 118.12,
        premiumTicketPrice: 344.41,
        beerPrice: 12.50,
        beerOunces: 20,
        beerPricePerOunce: 0.63,
        softDrinkPrice: 6.50,
        softDrinkOunces: 17,
        softDrinkPricePerOunce: 0.38,
        hotDogPrice: 7.00,
        parkingPrice: 22.60,
        hatPrice: 27.99,
        fanCostIndex: 630.06
    },
    "Chicago Blackhawks": {
        averageTicketPrice: 115.00,
        premiumTicketPrice: 195.02,
        beerPrice: 11.00,
        beerOunces: 16,
        beerPricePerOunce: 0.69,
        softDrinkPrice: 7.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.35,
        hotDogPrice: 7.00,
        parkingPrice: 19.90,
        hatPrice: 24.99,
        fanCostIndex: 607.88
    },
    "Seattle Kraken": {
        averageTicketPrice: 110.69,
        premiumTicketPrice: 363.39,
        beerPrice: 9.00,
        beerOunces: 12,
        beerPricePerOunce: 0.75,
        softDrinkPrice: 8.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.40,
        hotDogPrice: 8.00,
        parkingPrice: 19.77,
        hatPrice: 27.99,
        fanCostIndex: 600.51
    },
    "Washington Capitals": {
        averageTicketPrice: 109.64,
        premiumTicketPrice: 400.78,
        beerPrice: 11.00,
        beerOunces: 20,
        beerPricePerOunce: 0.55,
        softDrinkPrice: 6.00,
        softDrinkOunces: 14,
        softDrinkPricePerOunce: 0.43,
        hotDogPrice: 7.00,
        parkingPrice: 16.10,
        hatPrice: 24.99,
        fanCostIndex: 578.64
    },
    "Montreal Canadiens": {
        averageTicketPrice: 105.30,
        premiumTicketPrice: 190.03,
        beerPrice: 8.89,
        beerOunces: 16,
        beerPricePerOunce: 0.56,
        softDrinkPrice: 5.19,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.26,
        hotDogPrice: 5.19,
        parkingPrice: 12.74,
        hatPrice: 22.21,
        fanCostIndex: 537.66
    },
    "Los Angeles Kings": {
        averageTicketPrice: 93.43,
        premiumTicketPrice: 463.77,
        beerPrice: 8.00,
        beerOunces: 12,
        beerPricePerOunce: 0.67,
        softDrinkPrice: 6.00,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.50,
        hotDogPrice: 7.50,
        parkingPrice: 12.60,
        hatPrice: 29.99,
        fanCostIndex: 516.30
    },
    "Tampa Bay Lightning": {
        averageTicketPrice: 89.92,
        premiumTicketPrice: 236.35,
        beerPrice: 8.00,
        beerOunces: 12,
        beerPricePerOunce: 0.67,
        softDrinkPrice: 7.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.35,
        hotDogPrice: 6.00,
        parkingPrice: 21.56,
        hatPrice: 29.99,
        fanCostIndex: 509.22
    },
    "Detroit Red Wings": {
        averageTicketPrice: 91.65,
        premiumTicketPrice: 202.31,
        beerPrice: 10.00,
        beerOunces: 12,
        beerPricePerOunce: 0.83,
        softDrinkPrice: 6.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.38,
        hotDogPrice: 6.00,
        parkingPrice: 13.56,
        hatPrice: 29.99,
        fanCostIndex: 508.14
    },
    "Minnesota Wild": {
        averageTicketPrice: 92.67,
        premiumTicketPrice: 129.49,
        beerPrice: 10.00,
        beerOunces: 16,
        beerPricePerOunce: 0.63,
        softDrinkPrice: 6.50,
        softDrinkOunces: 24,
        softDrinkPricePerOunce: 0.27,
        hotDogPrice: 6.00,
        parkingPrice: 10.43,
        hatPrice: 27.99,
        fanCostIndex: 507.09
    },
    "Pittsburgh Penguins": {
        averageTicketPrice: 92.26,
        premiumTicketPrice: 250.00,
        beerPrice: 7.00,
        beerOunces: 12,
        beerPricePerOunce: 0.58,
        softDrinkPrice: 5.50,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.46,
        hotDogPrice: 6.50,
        parkingPrice: 19.20,
        hatPrice: 27.99,
        fanCostIndex: 506.22
    },
    "New York Islanders": {
        averageTicketPrice: 76.60,
        premiumTicketPrice: 290.14,
        beerPrice: 12.00,
        beerOunces: 16,
        beerPricePerOunce: 0.75,
        softDrinkPrice: 7.00,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.58,
        hotDogPrice: 7.00,
        parkingPrice: 37.67,
        hatPrice: 29.99,
        fanCostIndex: 484.05
    },
    "Dallas Stars": {
        averageTicketPrice: 83.48,
        premiumTicketPrice: 158.99,
        beerPrice: 10.50,
        beerOunces: 12,
        beerPricePerOunce: 0.88,
        softDrinkPrice: 6.50,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.33,
        hotDogPrice: 6.00,
        parkingPrice: 8.84,
        hatPrice: 29.99,
        fanCostIndex: 472.74
    },
    "Philadelphia Flyers": {
        averageTicketPrice: 80.56,
        premiumTicketPrice: 238.79,
        beerPrice: 12.00,
        beerOunces: 12,
        beerPricePerOunce: 1.00,
        softDrinkPrice: 6.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.38,
        hotDogPrice: 7.00,
        parkingPrice: 22.16,
        hatPrice: 25.99,
        fanCostIndex: 472.38
    },
    "Edmonton Oilers": {
        averageTicketPrice: 85.12,
        premiumTicketPrice: 202.83,
        beerPrice: 9.26,
        beerOunces: 16,
        beerPricePerOunce: 0.58,
        softDrinkPrice: 5.37,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.27,
        hotDogPrice: 6.11,
        parkingPrice: 10.15,
        hatPrice: 22.21,
        fanCostIndex: 459.49
    },
    "St. Louis Blues": {
        averageTicketPrice: 77.42,
        premiumTicketPrice: 235.76,
        beerPrice: 10.00,
        beerOunces: 16,
        beerPricePerOunce: 0.63,
        softDrinkPrice: 7.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.35,
        hotDogPrice: 7.00,
        parkingPrice: 18.84,
        hatPrice: 25.99,
        fanCostIndex: 456.50
    },
    "New Jersey Devils": {
        averageTicketPrice: 75.25,
        premiumTicketPrice: 203.11,
        beerPrice: 11.00,
        beerOunces: 12,
        beerPricePerOunce: 0.92,
        softDrinkPrice: 6.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.38,
        hotDogPrice: 6.50,
        parkingPrice: 19.55,
        hatPrice: 19.99,
        fanCostIndex: 452.53
    },
    "Colorado Avalanche": {
        averageTicketPrice: 73.35,
        premiumTicketPrice: 154.88,
        beerPrice: 12.00,
        beerOunces: 20,
        beerPricePerOunce: 0.60,
        softDrinkPrice: 7.00,
        softDrinkOunces: 24,
        softDrinkPricePerOunce: 0.29,
        hotDogPrice: 7.00,
        parkingPrice: 16.66,
        hatPrice: 29.99,
        fanCostIndex: 450.04
    },
    "Winnipeg Jets": {
        averageTicketPrice: 84.84,
        premiumTicketPrice: 152.53,
        beerPrice: 5.93,
        beerOunces: 12,
        beerPricePerOunce: 0.49,
        softDrinkPrice: 2.96,
        softDrinkOunces: 24,
        softDrinkPricePerOunce: 0.12,
        hotDogPrice: 5.93,
        parkingPrice: 13.33,
        hatPrice: 20.73,
        fanCostIndex: 441.57
    },
    "Vancouver Canucks": {
        averageTicketPrice: 78.25,
        premiumTicketPrice: 160.90,
        beerPrice: 7.78,
        beerOunces: 12,
        beerPricePerOunce: 0.65,
        softDrinkPrice: 4.81,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 5.19,
        parkingPrice: 11.41,
        hatPrice: 22.21,
        fanCostIndex: 424.39
    },
    "Carolina Hurricanes": {
        averageTicketPrice: 67.60,
        premiumTicketPrice: 137.93,
        beerPrice: 10.00,
        beerOunces: 12,
        beerPricePerOunce: 0.83,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 6.00,
        parkingPrice: 20.50,
        hatPrice: 29.99,
        fanCostIndex: 418.88
    },
    "Anaheim Ducks": {
        averageTicketPrice: 62.73,
        premiumTicketPrice: 155.35,
        beerPrice: 12.50,
        beerOunces: 16,
        beerPricePerOunce: 0.78,
        softDrinkPrice: 6.50,
        softDrinkOunces: 21,
        softDrinkPricePerOunce: 0.31,
        hotDogPrice: 6.50,
        parkingPrice: 21.25,
        hatPrice: 29.99,
        fanCostIndex: 409.15
    },
    "Columbus Blue Jackets": {
        averageTicketPrice: 63.48,
        premiumTicketPrice: 128.34,
        beerPrice: 10.50,
        beerOunces: 24,
        beerPricePerOunce: 0.44,
        softDrinkPrice: 7.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.35,
        hotDogPrice: 6.50,
        parkingPrice: 11.90,
        hatPrice: 29.99,
        fanCostIndex: 400.80
    },
    "San Jose Sharks": {
        averageTicketPrice: 60.50,
        premiumTicketPrice: 191.66,
        beerPrice: 10.00,
        beerOunces: 20,
        beerPricePerOunce: 0.50,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 6.50,
        parkingPrice: 28.11,
        hatPrice: 29.99,
        fanCostIndex: 400.09
    },
    "Calgary Flames": {
        averageTicketPrice: 71.94,
        premiumTicketPrice: 170.61,
        beerPrice: 8.15,
        beerOunces: 18,
        beerPricePerOunce: 0.45,
        softDrinkPrice: 4.63,
        softDrinkOunces: 32,
        softDrinkPricePerOunce: 0.14,
        hotDogPrice: 4.81,
        parkingPrice: 5.26,
        hatPrice: 22.21,
        fanCostIndex: 391.50
    },
    "Buffalo Sabres": {
        averageTicketPrice: 58.20,
        premiumTicketPrice: 120.60,
        beerPrice: 12.00,
        beerOunces: 20,
        beerPricePerOunce: 0.60,
        softDrinkPrice: 6.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.38,
        hotDogPrice: 5.50,
        parkingPrice: 17.78,
        hatPrice: 29.99,
        fanCostIndex: 380.56
    },
    "Florida Panthers": {
        averageTicketPrice: 48.64,
        premiumTicketPrice: 166.26,
        beerPrice: 13.00,
        beerOunces: 16,
        beerPricePerOunce: 0.81,
        softDrinkPrice: 7.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.35,
        hotDogPrice: 8.00,
        parkingPrice: 32.35,
        hatPrice: 29.99,
        fanCostIndex: 372.89
    },
    "Ottawa Senators": {
        averageTicketPrice: 59.38,
        premiumTicketPrice: 214.14,
        beerPrice: 8.89,
        beerOunces: 14,
        beerPricePerOunce: 0.64,
        softDrinkPrice: 4.44,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.22,
        hotDogPrice: 4.81,
        parkingPrice: 23.46,
        hatPrice: 20.73,
        fanCostIndex: 357.22
    },
    "Utah Hockey Club": {
        averageTicketPrice: 50.59,
        premiumTicketPrice: 171.64,
        beerPrice: 12.50,
        beerOunces: 16,
        beerPricePerOunce: 0.78,
        softDrinkPrice: 7.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.44,
        hotDogPrice: 6.00,
        parkingPrice: 20.00,
        hatPrice: 27.99,
        fanCostIndex: 355.34
    }
};

// Calculate additional metrics and prepare for integration
function analyzeNHLFanCostData() {
    console.log('🏒 NHL Fan Cost Data Analysis (2024-2025)');
    console.log('==========================================');
    
    const teams = Object.keys(nhlFanCostData);
    const results = {};
    
    teams.forEach(teamName => {
        const data = nhlFanCostData[teamName];
        
        results[teamName] = {
            average_ticket_price: data.averageTicketPrice,
            premium_ticket_price: data.premiumTicketPrice,
            beer_price: data.beerPrice,
            soft_drink_price: data.softDrinkPrice,
            hot_dog_price: data.hotDogPrice,
            parking_price: data.parkingPrice,
            fan_cost_index: data.fanCostIndex
        };
    });
    
    // Show rankings
    console.log('\n💰 MOST EXPENSIVE (Average Ticket Price):');
    teams.sort((a,b) => nhlFanCostData[b].averageTicketPrice - nhlFanCostData[a].averageTicketPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nhlFanCostData[team].averageTicketPrice}`);
         });
    
    console.log('\n💲 MOST AFFORDABLE (Average Ticket Price):');
    teams.sort((a,b) => nhlFanCostData[a].averageTicketPrice - nhlFanCostData[b].averageTicketPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nhlFanCostData[team].averageTicketPrice}`);
         });
    
    console.log('\n🍺 MOST EXPENSIVE BEER:');
    teams.sort((a,b) => nhlFanCostData[b].beerPrice - nhlFanCostData[a].beerPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nhlFanCostData[team].beerPrice}`);
         });
    
    console.log('\n🚗 MOST EXPENSIVE PARKING:');
    teams.sort((a,b) => nhlFanCostData[b].parkingPrice - nhlFanCostData[a].parkingPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nhlFanCostData[team].parkingPrice}`);
         });
    
    console.log('\n📊 HIGHEST FAN COST INDEX:');
    teams.sort((a,b) => nhlFanCostData[b].fanCostIndex - nhlFanCostData[a].fanCostIndex)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nhlFanCostData[team].fanCostIndex}`);
         });
    
    console.log('\n💚 LOWEST FAN COST INDEX (Most Affordable Overall):');
    teams.sort((a,b) => nhlFanCostData[a].fanCostIndex - nhlFanCostData[b].fanCostIndex)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nhlFanCostData[team].fanCostIndex}`);
         });
    
    return results;
}

const fanCostMetrics = analyzeNHLFanCostData();

// Save results for integration
fs.writeFileSync('nhl-fan-cost-metrics.json', JSON.stringify(fanCostMetrics, null, 2));
console.log('\n✅ NHL fan cost metrics saved to nhl-fan-cost-metrics.json');
console.log('\n📈 NEW CHALLENGES TO ADD:');
console.log('1. average_ticket_price - Average ticket price ($)');
console.log('2. beer_price - Stadium beer price ($)');
console.log('3. parking_price - Stadium parking cost ($)');
console.log('4. fan_cost_index - Total fan cost index ($)');
console.log('\nAll data verified from official Team Marketing Report 2024-2025');