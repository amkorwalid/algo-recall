# algo-recall
This is a personal project to help me in technical interviews and my competitive programming journey

## Features

### Quiz Interface
Interactive algorithm problem quiz to help practice technical interview questions.

### Web Scraping Capability ✓
**Yes, this project supports web scraping!**

The repository includes a Python-based web scraping utility that demonstrates:
- HTTP requests with proper headers
- HTML parsing with BeautifulSoup
- Data extraction (titles, metadata, links, images)
- Error handling and timeout management
- CSS selector support

## Web Scraping Usage

### Installation
```bash
pip install -r requirements.txt
```

### Running the Web Scraper
```bash
python web_scraper.py
```

### Programmatic Usage
```python
from web_scraper import AlgorithmScraper

scraper = AlgorithmScraper()

# Scrape a webpage
data = scraper.scrape_generic_page('https://example.com')

# Extract links
links = scraper.scrape_links('https://example.com')

# Extract text with CSS selector
text = scraper.extract_text_content('https://example.com', selector='h1')
```

## Use Cases
- Scraping algorithm problems from coding platforms
- Extracting structured data from websites
- Monitoring website changes
- Collecting data for analysis

## Technologies
- **Frontend**: HTML, CSS, JavaScript
- **Web Scraping**: Python, requests, BeautifulSoup4
