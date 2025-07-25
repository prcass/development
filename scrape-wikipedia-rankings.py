#!/usr/bin/env python3
"""
Wikipedia International Rankings Scraper
Scrapes country rankings from https://en.wikipedia.org/wiki/List_of_international_rankings
and extracts structured data for game challenges.
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time
from urllib.parse import urljoin, urlparse
import csv
from datetime import datetime

class WikipediaRankingsScraper:
    def __init__(self):
        self.base_url = "https://en.wikipedia.org"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.rankings_data = {}
        self.processed_urls = set()
        
    def get_page(self, url):
        """Fetch a Wikipedia page with error handling"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def extract_country_rankings_from_page(self, url, title=""):
        """Extract country rankings from a specific Wikipedia page"""
        soup = self.get_page(url)
        if not soup:
            return []
        
        rankings = []
        
        # Look for tables with country data
        tables = soup.find_all('table', {'class': ['wikitable', 'sortable']})
        
        for table_idx, table in enumerate(tables):
            headers = []
            header_row = table.find('tr')
            if header_row:
                headers = [th.get_text().strip() for th in header_row.find_all(['th', 'td'])]
            
            # Skip if no headers or doesn't look like a ranking table
            if not headers or len(headers) < 2:
                continue
            
            # Look for rank/country patterns
            rank_col = None
            country_col = None
            value_cols = []
            
            for i, header in enumerate(headers):
                header_lower = header.lower()
                if 'rank' in header_lower or header_lower in ['#', 'pos', 'position']:
                    rank_col = i
                elif 'country' in header_lower or 'nation' in header_lower or header_lower in ['country/territory']:
                    country_col = i
                elif header_lower in ['score', 'value', 'index', 'rate', 'percentage', '%', 'gdp', 'population']:
                    value_cols.append(i)
            
            if country_col is None:
                continue
            
            # Extract data rows
            rows = table.find_all('tr')[1:]  # Skip header
            country_data = []
            
            for row in rows:
                cells = row.find_all(['td', 'th'])
                if len(cells) <= max(country_col, max(value_cols) if value_cols else 0):
                    continue
                
                # Extract country name
                country_cell = cells[country_col]
                country_name = self.clean_country_name(country_cell.get_text().strip())
                
                if not country_name or len(country_name) < 2:
                    continue
                
                # Extract rank if available
                rank = None
                if rank_col is not None and rank_col < len(cells):
                    rank_text = cells[rank_col].get_text().strip()
                    rank_match = re.search(r'(\d+)', rank_text)
                    if rank_match:
                        rank = int(rank_match.group(1))
                
                # Extract values
                values = {}
                for val_col in value_cols:
                    if val_col < len(cells):
                        val_text = cells[val_col].get_text().strip()
                        # Try to extract numeric value
                        numeric_val = self.extract_numeric_value(val_text)
                        if numeric_val is not None:
                            values[headers[val_col]] = numeric_val
                
                if values or rank:
                    country_data.append({
                        'country': country_name,
                        'rank': rank,
                        'values': values
                    })
            
            if len(country_data) >= 10:  # Only keep substantial rankings
                ranking_info = {
                    'title': title or f"Ranking from {url}",
                    'url': url,
                    'table_index': table_idx,
                    'headers': headers,
                    'data': country_data,
                    'scraped_at': datetime.now().isoformat()
                }
                rankings.append(ranking_info)
        
        return rankings
    
    def clean_country_name(self, name):
        """Clean and standardize country names"""
        # Remove footnote markers, extra whitespace
        name = re.sub(r'\[.*?\]', '', name)
        name = re.sub(r'\s+', ' ', name.strip())
        
        # Handle common variations
        name_mappings = {
            'United States of America': 'United States',
            'USA': 'United States',
            'UK': 'United Kingdom', 
            'UAE': 'United Arab Emirates',
            'South Korea': 'Republic of Korea',
            'North Korea': 'Democratic People\'s Republic of Korea'
        }
        
        return name_mappings.get(name, name)
    
    def extract_numeric_value(self, text):
        """Extract numeric value from text"""
        # Remove common non-numeric characters
        text = re.sub(r'[,$%]', '', text)
        
        # Look for numbers (including decimals)
        match = re.search(r'(-?\d+\.?\d*)', text)
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                pass
        
        return None
    
    def scrape_main_rankings_page(self):
        """Scrape the main international rankings page"""
        main_url = "https://en.wikipedia.org/wiki/List_of_international_rankings"
        soup = self.get_page(main_url)
        
        if not soup:
            print("Failed to fetch main rankings page")
            return
        
        # Extract links to specific ranking pages
        ranking_links = []
        
        # Look for links in the page content
        content_div = soup.find('div', {'id': 'mw-content-text'})
        if content_div:
            links = content_div.find_all('a', href=True)
            for link in links:
                href = link.get('href')
                if href and href.startswith('/wiki/') and 'ranking' in href.lower():
                    full_url = urljoin(self.base_url, href)
                    link_text = link.get_text().strip()
                    if link_text and len(link_text) > 5:
                        ranking_links.append({
                            'url': full_url,
                            'title': link_text
                        })
        
        print(f"Found {len(ranking_links)} potential ranking pages")
        
        # Also scrape the main page itself for any embedded rankings
        main_rankings = self.extract_country_rankings_from_page(main_url, "International Rankings Overview")
        self.rankings_data['main_page'] = main_rankings
        
        return ranking_links
    
    def scrape_specific_rankings(self, ranking_links, max_pages=20):
        """Scrape specific ranking pages"""
        processed = 0
        
        for link_info in ranking_links:
            if processed >= max_pages:
                break
            
            url = link_info['url']
            title = link_info['title']
            
            if url in self.processed_urls:
                continue
                
            print(f"Scraping: {title} ({url})")
            rankings = self.extract_country_rankings_from_page(url, title)
            
            if rankings:
                self.rankings_data[title] = rankings
                print(f"  Found {len(rankings)} ranking tables")
            
            self.processed_urls.add(url)
            processed += 1
            
            # Be respectful to Wikipedia servers
            time.sleep(1)
    
    def save_results(self):
        """Save scraped data to files"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save raw JSON data
        json_filename = f"wikipedia_rankings_raw_{timestamp}.json"
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(self.rankings_data, f, indent=2, ensure_ascii=False)
        
        # Save processed CSV data
        csv_filename = f"wikipedia_rankings_processed_{timestamp}.csv"
        with open(csv_filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Source', 'Title', 'Country', 'Rank', 'Value', 'Value_Type', 'URL'])
            
            for source, rankings_list in self.rankings_data.items():
                for ranking in rankings_list:
                    title = ranking['title']
                    url = ranking['url']
                    
                    for country_info in ranking['data']:
                        country = country_info['country']
                        rank = country_info.get('rank', '')
                        
                        if country_info['values']:
                            for value_type, value in country_info['values'].items():
                                writer.writerow([source, title, country, rank, value, value_type, url])
                        else:
                            writer.writerow([source, title, country, rank, '', '', url])
        
        print(f"Saved results to {json_filename} and {csv_filename}")
        return json_filename, csv_filename
    
    def generate_game_challenges(self):
        """Generate game challenge data from scraped rankings"""
        challenges = []
        
        for source, rankings_list in self.rankings_data.items():
            for ranking in rankings_list:
                if len(ranking['data']) < 10:  # Skip small rankings
                    continue
                
                title = ranking['title']
                
                # Create challenges for different value types
                for country_info in ranking['data'][:1]:  # Check first entry for value types
                    for value_type in country_info.get('values', {}):
                        challenge = {
                            'label': f"{title}: {value_type}",
                            'challenge': f"{source}_{value_type}".lower().replace(' ', '_'),
                            'direction': 'desc',  # Most rankings are highest to lowest
                            'source': ranking['url'],
                            'countries': {}
                        }
                        
                        # Add country data
                        for country_data in ranking['data']:
                            country = country_data['country']
                            if value_type in country_data.get('values', {}):
                                challenge['countries'][country] = country_data['values'][value_type]
                        
                        if len(challenge['countries']) >= 10:
                            challenges.append(challenge)
        
        # Save challenges in game format
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        challenges_filename = f"game_challenges_{timestamp}.json"
        
        with open(challenges_filename, 'w', encoding='utf-8') as f:
            json.dump({
                'generated_at': datetime.now().isoformat(),
                'total_challenges': len(challenges),
                'challenges': challenges
            }, f, indent=2, ensure_ascii=False)
        
        print(f"Generated {len(challenges)} game challenges in {challenges_filename}")
        return challenges_filename

def main():
    scraper = WikipediaRankingsScraper()
    
    print("🌍 Wikipedia International Rankings Scraper")
    print("=" * 50)
    
    # Step 1: Scrape main page and find ranking links
    print("1. Scraping main rankings page...")
    ranking_links = scraper.scrape_main_rankings_page()
    
    # Step 2: Scrape specific ranking pages
    print(f"2. Scraping {min(20, len(ranking_links))} specific ranking pages...")
    scraper.scrape_specific_rankings(ranking_links, max_pages=20)
    
    # Step 3: Save results
    print("3. Saving results...")
    json_file, csv_file = scraper.save_results()
    
    # Step 4: Generate game challenges
    print("4. Generating game challenges...")
    challenges_file = scraper.generate_game_challenges()
    
    print("=" * 50)
    print("✅ Scraping complete!")
    print(f"📊 Total rankings found: {sum(len(r) for r in scraper.rankings_data.values())}")
    print(f"📁 Files created:")
    print(f"   - {json_file} (Raw data)")  
    print(f"   - {csv_file} (Processed data)")
    print(f"   - {challenges_file} (Game challenges)")

if __name__ == "__main__":
    main()