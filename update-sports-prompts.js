// Script to update sports prompts to match countries format
const fs = require('fs');

// New sports prompts with fun questions and proper formatting
const newSportsPrompts = [
    {
        challenge: "team_value",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Team Is Worth A Small Country?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Team Valuation in Billions USD</div><div style='font-size: 0.85em; color: #666'>(Forbes 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "annual_revenue",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Making It Rain?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Annual Revenue in Millions USD</div><div style='font-size: 0.85em; color: #666'>(Forbes/Team Reports 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "championship_count",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Got The Most Bling?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Championships Won</div><div style='font-size: 0.85em; color: #666'>(Official League Records)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "fan_base_size",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Rules The Hearts Of Millions?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Estimated Fan Base in Millions</div><div style='font-size: 0.85em; color: #666'>(Nielsen/Team Surveys 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "stadium_capacity",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Can The Most Fans Go Wild?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Stadium Seating Capacity</div><div style='font-size: 0.85em; color: #666'>(Official Venue Data 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "ticket_price_average",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Does It Cost A Fortune To Watch?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Average Ticket Price in USD</div><div style='font-size: 0.85em; color: #666'>(Team Marketing Report 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "payroll_total",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Breaking The Bank On Players?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Team Payroll in Millions USD</div><div style='font-size: 0.85em; color: #666'>(Spotrac/League Data 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "social_media_followers",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Winning The Internet?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Social Media Followers in Millions</div><div style='font-size: 0.85em; color: #666'>(Combined Platform Data 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "merchandise_sales",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Whose Jersey Is Everyone Wearing?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Annual Merchandise Sales in Millions USD</div><div style='font-size: 0.85em; color: #666'>(League/Team Reports 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "tv_viewership",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Got Everyone Glued To The Screen?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Average TV Viewership in Millions</div><div style='font-size: 0.85em; color: #666'>(Nielsen Ratings 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "all_time_wins",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Been Crushing It Forever?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>All-Time Regular Season Wins</div><div style='font-size: 0.85em; color: #666'>(Official League Records)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "playoff_appearances",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Always In The Big Dance?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Playoff Appearances</div><div style='font-size: 0.85em; color: #666'>(Official League Records)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "hall_of_fame_players",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Which Team Is A Legend Factory?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Hall of Fame Players Count</div><div style='font-size: 0.85em; color: #666'>(Official Hall of Fame Records)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "home_attendance",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Packs The House Every Night?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Average Home Attendance Percentage</div><div style='font-size: 0.85em; color: #666'>(ESPN/League Data 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "sponsorship_deals",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Got Corporate America's Love?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Number of Major Sponsorship Deals</div><div style='font-size: 0.85em; color: #666'>(SportsBusiness Journal 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "draft_picks_value",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Best At Finding Future Stars?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Draft Capital Value Score</div><div style='font-size: 0.85em; color: #666'>(Analytics Departments 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "injury_rate",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Keeps Their Players Healthiest?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Injury Rate Percentage</div><div style='font-size: 0.85em; color: #666'>(Sports Medicine Reports 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank lowest to highest</div></div>"
    },
    {
        challenge: "coaching_staff_size",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Has An Army Of Coaches?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Total Coaching Staff Size</div><div style='font-size: 0.85em; color: #666'>(Team Directories 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "community_impact",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's The Hometown Hero?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Community Impact Score (0-10)</div><div style='font-size: 0.85em; color: #666'>(ESPN Community Reports 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "international_games",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Gone Global The Most?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>International Games Played</div><div style='font-size: 0.85em; color: #666'>(League International Office 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "player_salaries_avg",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Where Do Players Drive Ferraris?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Average Player Salary in Millions USD</div><div style='font-size: 0.85em; color: #666'>(Players Association Data 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "season_wins",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Dominating Right Now?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Wins This Season</div><div style='font-size: 0.85em; color: #666'>(Current Season 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "social_responsibility",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Making The World Better?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Social Responsibility Score (0-10)</div><div style='font-size: 0.85em; color: #666'>(Athletes for Good 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "digital_engagement",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Killing It Online?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Digital Engagement Score (0-10)</div><div style='font-size: 0.85em; color: #666'>(Social Media Analytics 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "youth_programs",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Building Tomorrow's Stars?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Youth Programs Funded</div><div style='font-size: 0.85em; color: #666'>(Team Community Reports 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "sustainability_score",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's The Greenest Team?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Environmental Sustainability Score (0-10)</div><div style='font-size: 0.85em; color: #666'>(Green Sports Alliance 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "local_economic_impact",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's The City's Cash Cow?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Local Economic Impact in Millions USD</div><div style='font-size: 0.85em; color: #666'>(Economic Impact Studies 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "international_fanbase",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Famous Around The Globe?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>International Fan Base Score (0-10)</div><div style='font-size: 0.85em; color: #666'>(Global Sports Survey 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "media_coverage",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who's Always In The Headlines?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Annual Media Coverage Hours</div><div style='font-size: 0.85em; color: #666'>(Media Monitoring Services 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "facility_quality",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Plays In A Palace?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Facility Quality Score (0-10)</div><div style='font-size: 0.85em; color: #666'>(Stadium Rankings 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "player_development",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Turns Rookies Into Superstars?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Player Development Score (0-10)</div><div style='font-size: 0.85em; color: #666'>(Sports Analytics 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "brand_recognition",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Whose Logo Is Iconic Worldwide?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Brand Recognition Score (0-10)</div><div style='font-size: 0.85em; color: #666'>(Brand Finance Sports 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    },
    {
        challenge: "competitive_balance",
        label: "<div style='text-align: center'><div style='font-size: 1.1em; font-weight: bold; margin-bottom: 8px'>Who Keeps Games Nail-Bitingly Close?</div><div style='font-size: 0.9em; margin-bottom: 6px; color: #009688'>Competitive Balance Score (0-10)</div><div style='font-size: 0.85em; color: #666'>(League Analytics 2024)</div><div style='font-size: 0.9em; margin-top: 8px; font-style: italic'>Rank highest to lowest</div></div>"
    }
];

// Read the file
let content = fs.readFileSync('data.js', 'utf8');

// Convert prompts array to string for replacement
const promptsString = JSON.stringify(newSportsPrompts, null, 16)
    .replace(/^\[/, '')
    .replace(/\]$/, '')
    .trim();

// Find sports prompts section and replace it
const sportsPromptsStart = content.indexOf('"sports": {');
const promptsStart = content.indexOf('"prompts": [', sportsPromptsStart);
const promptsEnd = content.indexOf('],', promptsStart);

if (sportsPromptsStart !== -1 && promptsStart !== -1 && promptsEnd !== -1) {
    const newContent = 
        content.substring(0, promptsStart + '"prompts": ['.length) +
        '\n' + promptsString + '\n            ' +
        content.substring(promptsEnd);
    
    fs.writeFileSync('data.js', newContent, 'utf8');
    console.log('Sports prompts updated successfully!');
} else {
    console.error('Could not find sports prompts section');
}