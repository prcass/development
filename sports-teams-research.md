# Sports Teams Data Research Plan

## Target Teams (40 teams across major leagues)

### NFL (8 teams)
- Dallas Cowboys
- New England Patriots  
- Green Bay Packers
- Pittsburgh Steelers
- San Francisco 49ers
- New York Giants
- Kansas City Chiefs
- Buffalo Bills

### NBA (8 teams)
- Los Angeles Lakers
- Boston Celtics
- Golden State Warriors
- Chicago Bulls
- New York Knicks
- Miami Heat
- San Antonio Spurs
- Philadelphia 76ers

### MLB (8 teams)
- New York Yankees
- Los Angeles Dodgers
- Boston Red Sox
- San Francisco Giants
- Chicago Cubs
- St. Louis Cardinals
- Atlanta Braves
- Houston Astros

### NHL (6 teams)
- Montreal Canadiens
- Toronto Maple Leafs
- Boston Bruins
- New York Rangers
- Detroit Red Wings
- Chicago Blackhawks

### Soccer/Football (6 teams)
- Manchester United (Premier League)
- Real Madrid (La Liga)
- Barcelona (La Liga)
- Bayern Munich (Bundesliga)
- Juventus (Serie A)
- Paris Saint-Germain (Ligue 1)

### Other International (4 teams)
- Mumbai Indians (IPL Cricket)
- All Blacks (Rugby)
- Mercedes F1 (Formula 1)
- Sydney Swans (AFL)

## Data Collection Priority (Top 12 Challenges)

### 1. Championship Count ✅ EASIEST
**Source:** Official league records, Wikipedia
**Format:** Integer count
**Notes:** Most reliable data available

### 2. Stadium Capacity ✅ VERY EASY  
**Source:** Official venue websites, ESPN
**Format:** Integer (number of seats)
**Notes:** Fixed architectural data

### 3. Team Value ✅ VERY EASY
**Source:** Forbes annual valuations
**Format:** Billions USD (e.g., 5.5)
**Notes:** Forbes publishes comprehensive lists

### 4. All-Time Wins ✅ EASY
**Source:** Official league statistics, Sports Reference
**Format:** Integer count
**Notes:** Regular season wins only

### 5. Playoff Appearances ✅ EASY
**Source:** Official league records
**Format:** Integer count
**Notes:** Total postseason appearances

### 6. Hall of Fame Players ✅ EASY
**Source:** Official Hall of Fame websites
**Format:** Integer count
**Notes:** Players primarily associated with team

### 7. Annual Revenue ✅ MODERATE
**Source:** Forbes, team financial reports
**Format:** Millions USD (e.g., 456.7)
**Notes:** Most recent year available

### 8. Payroll Total ✅ MODERATE
**Source:** Spotrac, league salary databases
**Format:** Millions USD (e.g., 245.6)
**Notes:** Current season payroll

### 9. Player Salaries Average ✅ MODERATE
**Source:** Calculate from payroll total
**Format:** Millions USD (e.g., 4.2)
**Notes:** Payroll ÷ roster size

### 10. Season Wins ✅ MODERATE
**Source:** Current season standings
**Format:** Integer count
**Notes:** 2024 season or most recent complete

### 11. Social Media Followers ✅ MODERATE
**Source:** Official team accounts
**Format:** Millions (e.g., 15.8)
**Notes:** Combined Twitter, Instagram, Facebook

### 12. Home Attendance ✅ MODERATE
**Source:** ESPN, league attendance data
**Format:** Percentage (e.g., 96.8)
**Notes:** % of stadium capacity filled

## Research Strategy
1. Start with one league (NFL) to establish pattern
2. Create template for data entry
3. Focus on most recent complete data (2023-2024)
4. Use primary sources when possible
5. Document all sources for validation

## Data Format Template
```json
"001": {
    "name": "Team Name",
    "code": "001", 
    "league": "League Name",
    "championship_count": 0,
    "stadium_capacity": 0,
    "team_value": 0.0,
    "all_time_wins": 0,
    "playoff_appearances": 0,
    "hall_of_fame_players": 0,
    "annual_revenue": 0.0,
    "payroll_total": 0.0,
    "player_salaries_avg": 0.0,
    "season_wins": 0,
    "social_media_followers": 0.0,
    "home_attendance": 0.0,
    "originalCode": "TEAM_NAME"
}
```