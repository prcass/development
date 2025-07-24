// Parse MLB Fan Cost Data from Team Marketing Report 2023
const fs = require('fs');

// MLB Fan Cost Data (Team Marketing Report 2023)
const mlbFanCostData = {
    "Boston Red Sox": {
        averageTicketPrice: 62.94,
        premiumTicketPrice: 208.51,
        beerPrice: 10.50,
        beerOunces: 16,
        beerPricePerOunce: 0.66,
        softDrinkPrice: 6.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.38,
        hotDogPrice: 6.25,
        parkingPrice: 23.40,
        hatPrice: 25.00,
        fanCostIndex: 396.16
    },
    "New York Yankees": {
        averageTicketPrice: 65.93,
        premiumTicketPrice: 407.35,
        beerPrice: 6.00,
        beerOunces: 12,
        beerPricePerOunce: 0.50,
        softDrinkPrice: 3.00,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.25,
        hotDogPrice: 3.00,
        parkingPrice: 30.84,
        hatPrice: 22.99,
        fanCostIndex: 376.54
    },
    "Houston Astros": {
        averageTicketPrice: 62.56,
        premiumTicketPrice: 172.70,
        beerPrice: 7.50,
        beerOunces: 14,
        beerPricePerOunce: 0.54,
        softDrinkPrice: 6.00,
        softDrinkOunces: 21,
        softDrinkPricePerOunce: 0.29,
        hotDogPrice: 6.00,
        parkingPrice: 11.65,
        hatPrice: 21.99,
        fanCostIndex: 368.87
    },
    "Chicago Cubs": {
        averageTicketPrice: 53.62,
        premiumTicketPrice: 253.44,
        beerPrice: 10.49,
        beerOunces: 16,
        beerPricePerOunce: 0.66,
        softDrinkPrice: 5.99,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 6.49,
        parkingPrice: 24.78,
        hatPrice: 20.00,
        fanCostIndex: 350.16
    },
    "Los Angeles Dodgers": {
        averageTicketPrice: 52.76,
        premiumTicketPrice: 187.85,
        beerPrice: 7.00,
        beerOunces: 16,
        beerPricePerOunce: 0.44,
        softDrinkPrice: 6.50,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.33,
        hotDogPrice: 6.50,
        parkingPrice: 12.33,
        hatPrice: 28.00,
        fanCostIndex: 345.37
    },
    "Washington Nationals": {
        averageTicketPrice: 44.78,
        premiumTicketPrice: 247.31,
        beerPrice: 14.99,
        beerOunces: 25,
        beerPricePerOunce: 0.60,
        softDrinkPrice: 6.00,
        softDrinkOunces: 22,
        softDrinkPricePerOunce: 0.27,
        hotDogPrice: 7.00,
        parkingPrice: 25.90,
        hatPrice: 20.00,
        fanCostIndex: 327.00
    },
    "San Francisco Giants": {
        averageTicketPrice: 40.81,
        premiumTicketPrice: 133.13,
        beerPrice: 9.00,
        beerOunces: 14,
        beerPricePerOunce: 0.64,
        softDrinkPrice: 6.50,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.41,
        hotDogPrice: 7.50,
        parkingPrice: 27.50,
        hatPrice: 25.00,
        fanCostIndex: 314.74
    },
    "Texas Rangers": {
        averageTicketPrice: 38.53,
        premiumTicketPrice: 202.83,
        beerPrice: 8.00,
        beerOunces: 16,
        beerPricePerOunce: 0.50,
        softDrinkPrice: 6.50,
        softDrinkOunces: 22,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 7.00,
        parkingPrice: 20.30,
        hatPrice: 19.99,
        fanCostIndex: 284.40
    },
    "St. Louis Cardinals": {
        averageTicketPrice: 38.43,
        premiumTicketPrice: 95.13,
        beerPrice: 5.25,
        beerOunces: 12,
        beerPricePerOunce: 0.44,
        softDrinkPrice: 6.50,
        softDrinkOunces: 21,
        softDrinkPricePerOunce: 0.31,
        hotDogPrice: 5.50,
        parkingPrice: 19.81,
        hatPrice: 25.99,
        fanCostIndex: 284.01
    },
    "Philadelphia Phillies": {
        averageTicketPrice: 37.46,
        premiumTicketPrice: 92.88,
        beerPrice: 7.69,
        beerOunces: 12,
        beerPricePerOunce: 0.64,
        softDrinkPrice: 5.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.25,
        hotDogPrice: 5.00,
        parkingPrice: 24.67,
        hatPrice: 24.99,
        fanCostIndex: 279.87
    },
    "Atlanta Braves": {
        averageTicketPrice: 37.06,
        premiumTicketPrice: 253.99,
        beerPrice: 4.99,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 6.49,
        softDrinkOunces: 22,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 3.99,
        parkingPrice: 19.30,
        hatPrice: 27.99,
        fanCostIndex: 275.42
    },
    "Chicago White Sox": {
        averageTicketPrice: 32.42,
        premiumTicketPrice: 112.18,
        beerPrice: 10.50,
        beerOunces: 16,
        beerPricePerOunce: 0.66,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 5.00,
        parkingPrice: 26.57,
        hatPrice: 25.99,
        fanCostIndex: 273.23
    },
    "San Diego Padres": {
        averageTicketPrice: 33.81,
        premiumTicketPrice: 146.90,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 6.50,
        softDrinkOunces: 22,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 7.75,
        parkingPrice: 18.40,
        hatPrice: 23.99,
        fanCostIndex: 268.62
    },
    "New York Mets": {
        averageTicketPrice: 28.73,
        premiumTicketPrice: 99.03,
        beerPrice: 7.50,
        beerOunces: 12,
        beerPricePerOunce: 0.63,
        softDrinkPrice: 6.75,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.56,
        hotDogPrice: 7.00,
        parkingPrice: 21.20,
        hatPrice: 29.99,
        fanCostIndex: 266.10
    },
    "Seattle Mariners": {
        averageTicketPrice: 37.94,
        premiumTicketPrice: 193.96,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 4.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.25,
        hotDogPrice: 4.00,
        parkingPrice: 16.25,
        hatPrice: 28.00,
        fanCostIndex: 266.01
    },
    "Oakland Athletics": {
        averageTicketPrice: 30.26,
        premiumTicketPrice: 61.41,
        beerPrice: 7.00,
        beerOunces: 12,
        beerPricePerOunce: 0.58,
        softDrinkPrice: 6.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.38,
        hotDogPrice: 6.00,
        parkingPrice: 25.00,
        hatPrice: 25.99,
        fanCostIndex: 260.02
    },
    "Kansas City Royals": {
        averageTicketPrice: 36.42,
        premiumTicketPrice: 152.14,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 3.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.19,
        hotDogPrice: 4.00,
        parkingPrice: 20.00,
        hatPrice: 19.99,
        fanCostIndex: 243.66
    },
    "Milwaukee Brewers": {
        averageTicketPrice: 31.74,
        premiumTicketPrice: 56.40,
        beerPrice: 8.49,
        beerOunces: 16,
        beerPricePerOunce: 0.53,
        softDrinkPrice: 4.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.25,
        hotDogPrice: 4.00,
        parkingPrice: 13.74,
        hatPrice: 25.00,
        fanCostIndex: 239.68
    },
    "Baltimore Orioles": {
        averageTicketPrice: 34.27,
        premiumTicketPrice: 60.24,
        beerPrice: 10.99,
        beerOunces: 16,
        beerPricePerOunce: 0.69,
        softDrinkPrice: 4.10,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.34,
        hotDogPrice: 4.10,
        parkingPrice: 14.40,
        hatPrice: 15.00,
        fanCostIndex: 236.26
    },
    "Cleveland Guardians": {
        averageTicketPrice: 30.99,
        premiumTicketPrice: 81.62,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 4.00,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.33,
        hotDogPrice: 4.50,
        parkingPrice: 14.55,
        hatPrice: 25.00,
        fanCostIndex: 232.51
    },
    "Minnesota Twins": {
        averageTicketPrice: 33.89,
        premiumTicketPrice: 88.80,
        beerPrice: 4.99,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 1.99,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.12,
        hotDogPrice: 3.99,
        parkingPrice: 11.40,
        hatPrice: 24.00,
        fanCostIndex: 228.86
    },
    "Los Angeles Angels": {
        averageTicketPrice: 32.93,
        premiumTicketPrice: 167.12,
        beerPrice: 4.50,
        beerOunces: 16,
        beerPricePerOunce: 0.28,
        softDrinkPrice: 6.00,
        softDrinkOunces: 24,
        softDrinkPricePerOunce: 0.25,
        hotDogPrice: 6.00,
        parkingPrice: 16.67,
        hatPrice: 9.99,
        fanCostIndex: 225.37
    },
    "Detroit Tigers": {
        averageTicketPrice: 26.84,
        premiumTicketPrice: 85.24,
        beerPrice: 5.29,
        beerOunces: 12,
        beerPricePerOunce: 0.44,
        softDrinkPrice: 5.50,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.34,
        hotDogPrice: 5.50,
        parkingPrice: 9.80,
        hatPrice: 26.50,
        fanCostIndex: 224.74
    },
    "Colorado Rockies": {
        averageTicketPrice: 26.16,
        premiumTicketPrice: 59.44,
        beerPrice: 3.00,
        beerOunces: 12,
        beerPricePerOunce: 0.25,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 7.00,
        parkingPrice: 12.68,
        hatPrice: 22.99,
        fanCostIndex: 221.30
    },
    "Toronto Blue Jays": {
        averageTicketPrice: 32.34,
        premiumTicketPrice: 76.68,
        beerPrice: 4.44,
        beerOunces: 12,
        beerPricePerOunce: 0.37,
        softDrinkPrice: 5.19,
        softDrinkOunces: 24,
        softDrinkPricePerOunce: 0.22,
        hotDogPrice: 4.44,
        parkingPrice: 11.76,
        hatPrice: 16.29,
        fanCostIndex: 220.70
    },
    "Pittsburgh Pirates": {
        averageTicketPrice: 26.21,
        premiumTicketPrice: 73.89,
        beerPrice: 8.91,
        beerOunces: 16,
        beerPricePerOunce: 0.56,
        softDrinkPrice: 4.79,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 4.85,
        parkingPrice: 10.50,
        hatPrice: 21.99,
        fanCostIndex: 215.70
    },
    "Cincinnati Reds": {
        averageTicketPrice: 24.89,
        premiumTicketPrice: 88.31,
        beerPrice: 7.49,
        beerOunces: 14,
        beerPricePerOunce: 0.54,
        softDrinkPrice: 7.49,
        softDrinkOunces: 24,
        softDrinkPricePerOunce: 0.31,
        hotDogPrice: 6.29,
        parkingPrice: 13.48,
        hatPrice: 15.00,
        fanCostIndex: 213.14
    },
    "Tampa Bay Rays": {
        averageTicketPrice: 27.87,
        premiumTicketPrice: 116.63,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 5.00,
        softDrinkOunces: 22,
        softDrinkPricePerOunce: 0.23,
        hotDogPrice: 5.00,
        parkingPrice: 13.53,
        hatPrice: 15.00,
        fanCostIndex: 205.01
    },
    "Miami Marlins": {
        averageTicketPrice: 22.98,
        premiumTicketPrice: 185.20,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 3.00,
        softDrinkOunces: 24,
        softDrinkPricePerOunce: 0.13,
        hotDogPrice: 3.00,
        parkingPrice: 15.00,
        hatPrice: 21.99,
        fanCostIndex: 184.90
    },
    "Arizona Diamondbacks": {
        averageTicketPrice: 24.47,
        premiumTicketPrice: 68.78,
        beerPrice: 4.99,
        beerOunces: 14,
        beerPricePerOunce: 0.36,
        softDrinkPrice: 2.99,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.25,
        hotDogPrice: 2.99,
        parkingPrice: 18.33,
        hatPrice: 9.99,
        fanCostIndex: 170.09
    }
};

// Calculate additional metrics and prepare for integration
function analyzeMLBFanCostData() {
    console.log('⚾ MLB Fan Cost Data Analysis (Team Marketing Report 2023)');
    console.log('=========================================================');
    
    const teams = Object.keys(mlbFanCostData);
    const results = {};
    
    teams.forEach(teamName => {
        const data = mlbFanCostData[teamName];
        
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
    teams.sort((a,b) => mlbFanCostData[b].averageTicketPrice - mlbFanCostData[a].averageTicketPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${mlbFanCostData[team].averageTicketPrice}`);
         });
    
    console.log('\n💲 MOST AFFORDABLE (Average Ticket Price):');
    teams.sort((a,b) => mlbFanCostData[a].averageTicketPrice - mlbFanCostData[b].averageTicketPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${mlbFanCostData[team].averageTicketPrice}`);
         });
    
    console.log('\n🍺 MOST EXPENSIVE BEER:');
    teams.sort((a,b) => mlbFanCostData[b].beerPrice - mlbFanCostData[a].beerPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${mlbFanCostData[team].beerPrice}`);
         });
    
    console.log('\n🚗 MOST EXPENSIVE PARKING:');
    teams.sort((a,b) => mlbFanCostData[b].parkingPrice - mlbFanCostData[a].parkingPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${mlbFanCostData[team].parkingPrice}`);
         });
    
    console.log('\n📊 HIGHEST FAN COST INDEX:');
    teams.sort((a,b) => mlbFanCostData[b].fanCostIndex - mlbFanCostData[a].fanCostIndex)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${mlbFanCostData[team].fanCostIndex}`);
         });
    
    console.log('\n💚 LOWEST FAN COST INDEX (Most Affordable Overall):');
    teams.sort((a,b) => mlbFanCostData[a].fanCostIndex - mlbFanCostData[b].fanCostIndex)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${mlbFanCostData[team].fanCostIndex}`);
         });
    
    return results;
}

const mlbFanCostMetrics = analyzeMLBFanCostData();

// Save results for integration
fs.writeFileSync('mlb-fan-cost-metrics.json', JSON.stringify(mlbFanCostMetrics, null, 2));
console.log('\n✅ MLB fan cost metrics saved to mlb-fan-cost-metrics.json');
console.log('\n📈 Ready to update MLB teams with verified fan cost data from Team Marketing Report 2023');