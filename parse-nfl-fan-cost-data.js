// Parse NFL Fan Cost Data from Team Marketing Report 2023
const fs = require('fs');

// NFL Fan Cost Data (Team Marketing Report 2023)
const nflFanCostData = {
    "Las Vegas Raiders": {
        averageTicketPrice: 168.83,
        premiumTicketPrice: 370.28,
        beerPrice: 10.99,
        beerOunces: 16,
        beerPricePerOunce: 0.69,
        softDrinkPrice: 2.99,
        softDrinkOunces: 22,
        softDrinkPricePerOunce: 0.14,
        hotDogPrice: 2.99,
        parkingPrice: 30.00,
        hatPrice: 24.99,
        fanCostIndex: 801.20
    },
    "San Francisco 49ers": {
        averageTicketPrice: 161.33,
        premiumTicketPrice: 491.68,
        beerPrice: 12.00,
        beerOunces: 16,
        beerPricePerOunce: 0.75,
        softDrinkPrice: 4.50,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.28,
        hotDogPrice: 6.00,
        parkingPrice: 48.33,
        hatPrice: 27.99,
        fanCostIndex: 773.63
    },
    "Philadelphia Eagles": {
        averageTicketPrice: 139.01,
        premiumTicketPrice: 409.65,
        beerPrice: 11.50,
        beerOunces: 12,
        beerPricePerOunce: 0.96,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 6.50,
        parkingPrice: 56.50,
        hatPrice: 25.99,
        fanCostIndex: 737.52
    },
    "Green Bay Packers": {
        averageTicketPrice: 141.48,
        premiumTicketPrice: 354.57,
        beerPrice: 10.00,
        beerOunces: 16,
        beerPricePerOunce: 0.63,
        softDrinkPrice: 6.50,
        softDrinkOunces: 24,
        softDrinkPricePerOunce: 0.27,
        hotDogPrice: 6.00,
        parkingPrice: 36.67,
        hatPrice: 22.99,
        fanCostIndex: 718.57
    },
    "New England Patriots": {
        averageTicketPrice: 142.74,
        premiumTicketPrice: 439.57,
        beerPrice: 10.50,
        beerOunces: 20,
        beerPricePerOunce: 0.53,
        softDrinkPrice: 5.00,
        softDrinkOunces: 22,
        softDrinkPricePerOunce: 0.23,
        hotDogPrice: 4.50,
        parkingPrice: 0, // No parking fee listed
        hatPrice: 25.99,
        fanCostIndex: 681.94
    },
    "Chicago Bears": {
        averageTicketPrice: 130.29,
        premiumTicketPrice: 357.36,
        beerPrice: 11.00,
        beerOunces: 20,
        beerPricePerOunce: 0.55,
        softDrinkPrice: 7.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.44,
        hotDogPrice: 8.00,
        parkingPrice: 26.70,
        hatPrice: 25.99,
        fanCostIndex: 681.84
    },
    "Kansas City Chiefs": {
        averageTicketPrice: 131.81,
        premiumTicketPrice: 290.06,
        beerPrice: 9.00,
        beerOunces: 16,
        beerPricePerOunce: 0.56,
        softDrinkPrice: 5.00,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.31,
        hotDogPrice: 5.00,
        parkingPrice: 38.74,
        hatPrice: 27.99,
        fanCostIndex: 679.96
    },
    "Denver Broncos": {
        averageTicketPrice: 131.91,
        premiumTicketPrice: 488.56,
        beerPrice: 8.50,
        beerOunces: 16,
        beerPricePerOunce: 0.53,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 6.00,
        parkingPrice: 29.10,
        hatPrice: 27.99,
        fanCostIndex: 677.72
    },
    "Tampa Bay Buccaneers": {
        averageTicketPrice: 124.43,
        premiumTicketPrice: 294.34,
        beerPrice: 7.00,
        beerOunces: 12,
        beerPricePerOunce: 0.58,
        softDrinkPrice: 8.00,
        softDrinkOunces: 24,
        softDrinkPricePerOunce: 0.33,
        hotDogPrice: 8.00,
        parkingPrice: 41.40,
        hatPrice: 29.99,
        fanCostIndex: 677.10
    },
    "Seattle Seahawks": {
        averageTicketPrice: 127.71,
        premiumTicketPrice: 297.81,
        beerPrice: 10.99,
        beerOunces: 16,
        beerPricePerOunce: 0.69,
        softDrinkPrice: 6.49,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.32,
        hotDogPrice: 7.99,
        parkingPrice: 27.85,
        hatPrice: 27.99,
        fanCostIndex: 674.57
    },
    "Pittsburgh Steelers": {
        averageTicketPrice: 127.04,
        premiumTicketPrice: 295.93,
        beerPrice: 9.55,
        beerOunces: 20,
        beerPricePerOunce: 0.48,
        softDrinkPrice: 7.19,
        softDrinkOunces: 22,
        softDrinkPricePerOunce: 0.33,
        hotDogPrice: 6.79,
        parkingPrice: 34.12,
        hatPrice: 25.00,
        fanCostIndex: 667.30
    },
    "Dallas Cowboys": {
        averageTicketPrice: 116.69,
        premiumTicketPrice: 408.93,
        beerPrice: 10.50,
        beerOunces: 16,
        beerPricePerOunce: 0.66,
        softDrinkPrice: 6.50,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.33,
        hotDogPrice: 6.75,
        parkingPrice: 52.84,
        hatPrice: 36.00,
        fanCostIndex: 665.60
    },
    "Washington Commanders": {
        averageTicketPrice: 124.80,
        premiumTicketPrice: 396.00,
        beerPrice: 7.00,
        beerOunces: 12,
        beerPricePerOunce: 0.58,
        softDrinkPrice: 4.50,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.23,
        hotDogPrice: 6.50,
        parkingPrice: 47.33,
        hatPrice: 25.99,
        fanCostIndex: 656.51
    },
    "New York Giants": {
        averageTicketPrice: 126.74,
        premiumTicketPrice: 459.08,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 3.00,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.25,
        hotDogPrice: 7.00,
        parkingPrice: 38.10,
        hatPrice: 30.00,
        fanCostIndex: 655.06
    },
    "Minnesota Vikings": {
        averageTicketPrice: 123.37,
        premiumTicketPrice: 367.08,
        beerPrice: 10.50,
        beerOunces: 20,
        beerPricePerOunce: 0.53,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 6.75,
        parkingPrice: 22.07,
        hatPrice: 26.99,
        fanCostIndex: 641.53
    },
    "Cleveland Browns": {
        averageTicketPrice: 122.18,
        premiumTicketPrice: 306.10,
        beerPrice: 7.50,
        beerOunces: 12,
        beerPricePerOunce: 0.63,
        softDrinkPrice: 5.75,
        softDrinkOunces: 22,
        softDrinkPricePerOunce: 0.26,
        hotDogPrice: 6.75,
        parkingPrice: 24.22,
        hatPrice: 24.99,
        fanCostIndex: 627.92
    },
    "Los Angeles Chargers": {
        averageTicketPrice: 106.23,
        premiumTicketPrice: 368.58,
        beerPrice: 11.00,
        beerOunces: 12,
        beerPricePerOunce: 0.92,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 8.00,
        parkingPrice: 58.40,
        hatPrice: 27.99,
        fanCostIndex: 617.30
    },
    "Houston Texans": {
        averageTicketPrice: 117.45,
        premiumTicketPrice: 376.47,
        beerPrice: 6.00,
        beerOunces: 12,
        beerPricePerOunce: 0.50,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 5.50,
        parkingPrice: 31.29,
        hatPrice: 25.99,
        fanCostIndex: 611.07
    },
    "Los Angeles Rams": {
        averageTicketPrice: 103.90,
        premiumTicketPrice: 377.00,
        beerPrice: 11.00,
        beerOunces: 12,
        beerPricePerOunce: 0.92,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 8.00,
        parkingPrice: 54.90,
        hatPrice: 27.99,
        fanCostIndex: 604.48
    },
    "Baltimore Ravens": {
        averageTicketPrice: 120.27,
        premiumTicketPrice: 312.93,
        beerPrice: 7.63,
        beerOunces: 12,
        beerPricePerOunce: 0.64,
        softDrinkPrice: 4.24,
        softDrinkOunces: 24,
        softDrinkPricePerOunce: 0.18,
        hotDogPrice: 3.71,
        parkingPrice: 23.50,
        hatPrice: 25.44,
        fanCostIndex: 602.52
    },
    "Carolina Panthers": {
        averageTicketPrice: 115.45,
        premiumTicketPrice: 353.05,
        beerPrice: 10.49,
        beerOunces: 16,
        beerPricePerOunce: 0.66,
        softDrinkPrice: 5.99,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 5.99,
        parkingPrice: 21.75,
        hatPrice: 24.99,
        fanCostIndex: 602.43
    },
    "New York Jets": {
        averageTicketPrice: 112.56,
        premiumTicketPrice: 393.09,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 3.00,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.25,
        hotDogPrice: 7.00,
        parkingPrice: 37.80,
        hatPrice: 27.99,
        fanCostIndex: 594.02
    },
    "New Orleans Saints": {
        averageTicketPrice: 111.97,
        premiumTicketPrice: 288.80,
        beerPrice: 12.00,
        beerOunces: 16,
        beerPricePerOunce: 0.75,
        softDrinkPrice: 6.50,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.33,
        hotDogPrice: 6.50,
        parkingPrice: 9.70,
        hatPrice: 25.99,
        fanCostIndex: 585.56
    },
    "Jacksonville Jaguars": {
        averageTicketPrice: 102.22,
        premiumTicketPrice: 411.10,
        beerPrice: 11.49,
        beerOunces: 16,
        beerPricePerOunce: 0.72,
        softDrinkPrice: 6.99,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.35,
        hotDogPrice: 7.29,
        parkingPrice: 41.97,
        hatPrice: 26.99,
        fanCostIndex: 584.93
    },
    "Tennessee Titans": {
        averageTicketPrice: 107.37,
        premiumTicketPrice: 250.11,
        beerPrice: 11.00,
        beerOunces: 16,
        beerPricePerOunce: 0.69,
        softDrinkPrice: 5.50,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.34,
        hotDogPrice: 6.50,
        parkingPrice: 19.48,
        hatPrice: 27.99,
        fanCostIndex: 574.94
    },
    "Detroit Lions": {
        averageTicketPrice: 107.31,
        premiumTicketPrice: 256.85,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 5.50,
        softDrinkOunces: 16,
        softDrinkPricePerOunce: 0.34,
        hotDogPrice: 6.50,
        parkingPrice: 19.94,
        hatPrice: 27.99,
        fanCostIndex: 563.16
    },
    "Indianapolis Colts": {
        averageTicketPrice: 107.00,
        premiumTicketPrice: 333.98,
        beerPrice: 9.00,
        beerOunces: 16,
        beerPricePerOunce: 0.56,
        softDrinkPrice: 4.25,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.21,
        hotDogPrice: 6.00,
        parkingPrice: 26.00,
        hatPrice: 21.99,
        fanCostIndex: 556.98
    },
    "Buffalo Bills": {
        averageTicketPrice: 101.64,
        premiumTicketPrice: 304.43,
        beerPrice: 7.75,
        beerOunces: 12,
        beerPricePerOunce: 0.65,
        softDrinkPrice: 6.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.30,
        hotDogPrice: 6.00,
        parkingPrice: 35.00,
        hatPrice: 25.00,
        fanCostIndex: 555.06
    },
    "Cincinnati Bengals": {
        averageTicketPrice: 101.78,
        premiumTicketPrice: 238.81,
        beerPrice: 6.00,
        beerOunces: 12,
        beerPricePerOunce: 0.50,
        softDrinkPrice: 7.00,
        softDrinkOunces: 20,
        softDrinkPricePerOunce: 0.35,
        hotDogPrice: 6.00,
        parkingPrice: 17.30,
        hatPrice: 27.99,
        fanCostIndex: 544.40
    },
    "Miami Dolphins": {
        averageTicketPrice: 104.45,
        premiumTicketPrice: 390.92,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 4.00,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.33,
        hotDogPrice: 4.00,
        parkingPrice: 29.00,
        hatPrice: 26.99,
        fanCostIndex: 542.78
    },
    "Atlanta Falcons": {
        averageTicketPrice: 111.54,
        premiumTicketPrice: 430.61,
        beerPrice: 5.00,
        beerOunces: 12,
        beerPricePerOunce: 0.42,
        softDrinkPrice: 2.00,
        softDrinkOunces: 12,
        softDrinkPricePerOunce: 0.17,
        hotDogPrice: 2.00,
        parkingPrice: 19.06,
        hatPrice: 24.99,
        fanCostIndex: 541.20
    },
    "Arizona Cardinals": {
        averageTicketPrice: 98.54,
        premiumTicketPrice: 339.85,
        beerPrice: 7.00,
        beerOunces: 12,
        beerPricePerOunce: 0.58,
        softDrinkPrice: 5.50,
        softDrinkOunces: 21,
        softDrinkPricePerOunce: 0.26,
        hotDogPrice: 5.00,
        parkingPrice: 13.30,
        hatPrice: 24.99,
        fanCostIndex: 513.44
    }
};

// Calculate additional metrics and prepare for integration
function analyzeNFLFanCostData() {
    console.log('🏈 NFL Fan Cost Data Analysis (Team Marketing Report 2023)');
    console.log('=========================================================');
    
    const teams = Object.keys(nflFanCostData);
    const results = {};
    
    teams.forEach(teamName => {
        const data = nflFanCostData[teamName];
        
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
    teams.sort((a,b) => nflFanCostData[b].averageTicketPrice - nflFanCostData[a].averageTicketPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nflFanCostData[team].averageTicketPrice}`);
         });
    
    console.log('\n💲 MOST AFFORDABLE (Average Ticket Price):');
    teams.sort((a,b) => nflFanCostData[a].averageTicketPrice - nflFanCostData[b].averageTicketPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nflFanCostData[team].averageTicketPrice}`);
         });
    
    console.log('\n🍺 MOST EXPENSIVE BEER:');
    teams.sort((a,b) => nflFanCostData[b].beerPrice - nflFanCostData[a].beerPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nflFanCostData[team].beerPrice}`);
         });
    
    console.log('\n🚗 MOST EXPENSIVE PARKING:');
    teams.sort((a,b) => nflFanCostData[b].parkingPrice - nflFanCostData[a].parkingPrice)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nflFanCostData[team].parkingPrice}`);
         });
    
    console.log('\n📊 HIGHEST FAN COST INDEX:');
    teams.sort((a,b) => nflFanCostData[b].fanCostIndex - nflFanCostData[a].fanCostIndex)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nflFanCostData[team].fanCostIndex}`);
         });
    
    console.log('\n💚 LOWEST FAN COST INDEX (Most Affordable Overall):');
    teams.sort((a,b) => nflFanCostData[a].fanCostIndex - nflFanCostData[b].fanCostIndex)
         .slice(0,5)
         .forEach((team, i) => {
             console.log(`${i+1}. ${team}: $${nflFanCostData[team].fanCostIndex}`);
         });
    
    return results;
}

const nflFanCostMetrics = analyzeNFLFanCostData();

// Save results for integration
fs.writeFileSync('nfl-fan-cost-metrics.json', JSON.stringify(nflFanCostMetrics, null, 2));
console.log('\n✅ NFL fan cost metrics saved to nfl-fan-cost-metrics.json');
console.log('\n📈 Ready to update NFL teams with verified fan cost data from Team Marketing Report 2023');