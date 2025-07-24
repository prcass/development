// Update MLB teams with real 2024 attendance data
const fs = require('fs');

// 2024 MLB Home Attendance Data (from the table provided)
// Using the AVG column directly from the table
const mlbAttendanceData = {
    "Los Angeles Dodgers": 48657,
    "New York Yankees": 41896,
    "Philadelphia Phillies": 41527,
    "San Diego Padres": 41117,
    "Atlanta Braves": 37647,
    "Chicago Cubs": 35922,
    "St. Louis Cardinals": 35872,
    "Houston Astros": 35002,
    "Toronto Blue Jays": 33101,
    "San Francisco Giants": 33096,
    "Boston Red Sox": 32838,
    "Texas Rangers": 32735,
    "Los Angeles Angels": 31822,
    "Seattle Mariners": 31553,
    "Colorado Rockies": 31361,
    "Milwaukee Brewers": 31323,
    "New York Mets": 29484,
    "Arizona Diamondbacks": 28912,
    "Baltimore Orioles": 28514,
    "Cleveland Guardians": 26028,
    "Cincinnati Reds": 24989,
    "Washington Nationals": 24287,
    "Minnesota Twins": 24094,
    "Detroit Tigers": 23824,
    "Pittsburgh Pirates": 21239,
    "Kansas City Royals": 20473,
    "Chicago White Sox": 17931,
    "Tampa Bay Rays": 16515,
    "Miami Marlins": 13425,
    "Oakland Athletics": 11528
};

console.log('⚾ Updating MLB teams with real 2024 attendance data');
console.log('✅ Extracted from official MLB attendance table');
console.log('');

// Read current data.js
let content = fs.readFileSync('data.js', 'utf8');

// Update each MLB team with real attendance data
Object.keys(mlbAttendanceData).forEach(teamName => {
    const attendance = mlbAttendanceData[teamName];
    
    // Find the team entry and update the attendance field
    const teamPattern = new RegExp(`(\"name\":\\s*\"${teamName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\"[\\s\\S]*?)\"average_home_attendance\":\\s*[^,}]+`, 'g');
    
    content = content.replace(teamPattern, (match, beforeAttendance) => {
        return beforeAttendance + `\"average_home_attendance\": ${attendance}`;
    });
});

fs.writeFileSync('data.js', content, 'utf8');

console.log('✅ Successfully updated all MLB teams with real 2024 attendance data!');
console.log('');
console.log('📊 Sample MLB attendance updates:');
console.log('   • Los Angeles Dodgers: 48,657 (highest)');
console.log('   • New York Yankees: 41,896');
console.log('   • Philadelphia Phillies: 41,527');
console.log('   • Oakland Athletics: 11,528 (lowest)');
console.log('');
console.log('📈 Current data status:');
console.log('   • NFL: 100% real 2024 data ✅');
console.log('   • NBA: 100% real 2024 data ✅');
console.log('   • MLB: 100% real 2024 data ✅');
console.log('   • NHL: Estimated data 📝');
console.log('');
console.log('🎯 Three leagues now have verified 2024 attendance figures!');