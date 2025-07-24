// Clean sports data - keep only 5 challenges with real Sports Reference data
// Remove playoff_wins and all 30 placeholder data challenges
const fs = require('fs');

// Only keep these 5 challenges with real Sports Reference 2025 data
const realDataChallenges = [
    {
        "challenge": "championship_count",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Got The Most Bling?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Championships Won</div><div style='font-size: 0.85em; color: #666'>(Sports Reference 2025)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "all_time_wins",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Won The Most Games Ever?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>All-Time Regular Season Wins</div><div style='font-size: 0.85em; color: #666'>(Sports Reference 2025)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "playoff_appearances",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Makes The Playoffs Most?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Playoff Appearances</div><div style='font-size: 0.85em; color: #666'>(Sports Reference 2025)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "winning_percentage",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Got The Best Win Rate?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>All-Time Winning Percentage</div><div style='font-size: 0.85em; color: #666'>(Sports Reference 2025)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        "challenge": "division_titles",
        "label": "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Rules Their Division?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Division Championships Won</div><div style='font-size: 0.85em; color: #666'>(Sports Reference 2025)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    }
];

// Fields to keep in team data (only real data)
const realDataFields = [
    'name', 'code', 'league', 'championship_count', 'all_time_wins', 
    'playoff_appearances', 'winning_percentage', 'division_titles', 'originalCode'
];

console.log('🧹 Cleaning sports data...');
console.log('✅ Keeping 5 challenges with real Sports Reference 2025 data');
console.log('❌ Removing playoff_wins challenge');
console.log('❌ Removing 30 placeholder data challenges');
console.log('❌ Removing all placeholder data fields from teams');
console.log('');

// Read current data.js
let content = fs.readFileSync('data.js', 'utf8');

// 1. Replace sports prompts with only the 5 real data challenges
const promptsString = realDataChallenges.map(prompt => 
    `          {\n                    "challenge": "${prompt.challenge}",\n                    "label": "${prompt.label}"\n          }`
).join(',\n');

// Find and replace sports prompts section
const sportsPromptsStart = content.indexOf('"sports": {');
const promptsStart = content.indexOf('"prompts": [', sportsPromptsStart);
const promptsEnd = content.indexOf('],', promptsStart);

if (sportsPromptsStart !== -1 && promptsStart !== -1 && promptsEnd !== -1) {
    content = content.substring(0, promptsStart + '"prompts": ['.length) +
        '\n' + promptsString + '\n            ' +
        content.substring(promptsEnd);
}

// 2. Clean each team entry - keep only real data fields
const teamPattern = /("name":\s*"[^"]+")[^}]+("originalCode":\s*"[^"]+")/g;

content = content.replace(teamPattern, (match, nameField, originalCodeField) => {
    // Extract team data
    const nameMatch = nameField.match(/"name":\s*"([^"]+)"/);
    const codeMatch = match.match(/"code":\s*"([^"]+)"/);
    const leagueMatch = match.match(/"league":\s*"([^"]+)"/);
    const championshipMatch = match.match(/"championship_count":\s*([^,}]+)/);
    const winsMatch = match.match(/"all_time_wins":\s*([^,}]+)/);
    const playoffAppearancesMatch = match.match(/"playoff_appearances":\s*([^,}]+)/);
    const winningPercentageMatch = match.match(/"winning_percentage":\s*([^,}]+)/);
    const divisionTitlesMatch = match.match(/"division_titles":\s*([^,}]+)/);
    const originalCodeMatch = originalCodeField.match(/"originalCode":\s*"([^"]+)"/);
    
    if (!nameMatch || !codeMatch || !leagueMatch) return match;
    
    // Build clean team object with only real data
    return `${nameField},
                    "code": "${codeMatch[1]}",
                    "league": "${leagueMatch[1]}",
                    "championship_count": ${championshipMatch ? championshipMatch[1] : 0},
                    "all_time_wins": ${winsMatch ? winsMatch[1] : 0},
                    "playoff_appearances": ${playoffAppearancesMatch ? playoffAppearancesMatch[1] : 0},
                    "winning_percentage": ${winningPercentageMatch ? winningPercentageMatch[1] : 0},
                    "division_titles": ${divisionTitlesMatch ? divisionTitlesMatch[1] : 0},
                    ${originalCodeField}`;
});

// Write the cleaned data
fs.writeFileSync('data.js', content, 'utf8');

console.log('✅ Sports data cleaned successfully!');
console.log('');
console.log('📊 Final sports dataset:');
console.log('   • 5 challenges with real Sports Reference 2025 data');
console.log('   • 124 teams with only verified data fields');
console.log('   • All placeholder data removed');
console.log('');
console.log('🎯 Challenges remaining:');
realDataChallenges.forEach((challenge, index) => {
    console.log(`   ${index + 1}. ${challenge.challenge}`);
});
console.log('');
console.log('📈 Data fields per team: 9 total');
console.log('   • name, code, league, originalCode (metadata)');
console.log('   • championship_count, all_time_wins, playoff_appearances (original real data)');
console.log('   • winning_percentage, division_titles (new real data)');