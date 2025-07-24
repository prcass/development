const fs = require('fs');

// Read current data.js
const dataContent = fs.readFileSync('data.js', 'utf8');

// Parse the current data
const window = {};
eval(dataContent);
const gameData = window.GAME_DATA;

// Add the attendance challenge to the verified challenges
const attendanceChallenge = {
    "challenge": "home_attendance",
    "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Packs The House?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Average Home Attendance</div><div style='font-size: 0.85em; color: #666'>(NFL 2024 Verified, Others Estimated)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
};

// Insert attendance challenge after team_value (before franchise challenges)
const currentChallenges = gameData.categories.sports.prompts;
const insertIndex = currentChallenges.findIndex(c => c.challenge === 'franchise_name_changes');
currentChallenges.splice(insertIndex, 0, attendanceChallenge);

console.log('✅ Added attendance challenge');
console.log('✅ Total verified challenges:', currentChallenges.length);

// Create updated data.js content
const newContent = `/**
 * Outrank Game Data - v2.6 Added Verified Attendance Challenge
 * Updated: ${new Date().toISOString()}
 * Added attendance challenge (NFL verified, others estimated)
 * Countries: 40 (enhanced dataset)
 * Movies: 40  
 * Sports: 124 teams, 13 verified challenges (1 with partial data)
 * Companies: 40
 * Total Categories: 4
 */

window.GAME_DATA = ${JSON.stringify(gameData, null, 4)};

// Console output for verification
console.log('✅ Outrank v2.6 Added Attendance - Game data loaded with 4 categories');
console.log('🌍 Countries:', Object.keys(window.GAME_DATA.categories.countries.items).length, 'countries with', window.GAME_DATA.categories.countries.prompts.length, 'challenges');
console.log('🎬 Movies:', Object.keys(window.GAME_DATA.categories.movies.items).length, 'movies with', window.GAME_DATA.categories.movies.prompts.length, 'challenges');
console.log('🏢 Companies:', Object.keys(window.GAME_DATA.categories.companies.items).length, 'companies with', window.GAME_DATA.categories.companies.prompts.length, 'challenges');
console.log('🏈 Sports:', Object.keys(window.GAME_DATA.categories.sports.items).length, 'teams with', window.GAME_DATA.categories.sports.prompts.length, 'VERIFIED challenges');
console.log('📊 Total items:', Object.keys(window.GAME_DATA.categories.countries.items).length + Object.keys(window.GAME_DATA.categories.movies.items).length + Object.keys(window.GAME_DATA.categories.companies.items).length + Object.keys(window.GAME_DATA.categories.sports.items).length);
console.log('🎯 Total challenges:', window.GAME_DATA.categories.countries.prompts.length + window.GAME_DATA.categories.movies.prompts.length + window.GAME_DATA.categories.companies.prompts.length + window.GAME_DATA.categories.sports.prompts.length);`;

// Write the updated data.js
fs.writeFileSync('data.js', newContent);

console.log('✅ Successfully added attendance challenge!');
console.log('📝 Note: NFL attendance data is verified 2024, other leagues are estimates');

// Verify the new file
try {
    const testWindow = {};
    eval(fs.readFileSync('data.js', 'utf8'));
    console.log('✅ Syntax validation passed!');
} catch (error) {
    console.error('❌ Syntax error in generated file:', error.message);
}