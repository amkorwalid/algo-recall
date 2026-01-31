#!/usr/bin/env python3
"""
Web Scraping Utility for Algo-Recall
This script demonstrates web scraping capabilities by scraping algorithm problem information.
"""

import requests
from bs4 import BeautifulSoup
import json
from typing import Dict, List, Optional


class AlgorithmScraper:
    """
    A simple web scraper for algorithm problems.
    Demonstrates basic web scraping capabilities using Python.
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scrape_generic_page(self, url: str) -> Optional[Dict]:
        """
        Scrape a generic webpage and extract basic information.
        
        Args:
            url: The URL to scrape
            
        Returns:
            Dictionary containing scraped data or None if failed
        """
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract basic information
            data = {
                'url': url,
                'title': soup.title.string if soup.title else 'No title',
                'status_code': response.status_code,
                'headers': dict(response.headers),
                'meta_description': None,
                'links_count': len(soup.find_all('a')),
                'images_count': len(soup.find_all('img')),
            }
            
            # Try to get meta description
            meta_desc = soup.find('meta', attrs={'name': 'description'})
            if meta_desc:
                data['meta_description'] = meta_desc.get('content', '')
            
            return data
            
        except requests.RequestException as e:
            print(f"Error scraping {url}: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error: {e}")
            return None
    
    def extract_text_content(self, url: str, selector: Optional[str] = None) -> Optional[str]:
        """
        Extract text content from a webpage.
        
        Args:
            url: The URL to scrape
            selector: Optional CSS selector to target specific content
            
        Returns:
            Extracted text or None if failed
        """
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            if selector:
                element = soup.select_one(selector)
                return element.get_text(strip=True) if element else None
            else:
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.decompose()
                return soup.get_text(strip=True, separator=' ')
                
        except Exception as e:
            print(f"Error extracting text: {e}")
            return None
    
    def scrape_links(self, url: str) -> List[Dict]:
        """
        Extract all links from a webpage.
        
        Args:
            url: The URL to scrape
            
        Returns:
            List of dictionaries containing link information
        """
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            links = []
            for link in soup.find_all('a', href=True):
                links.append({
                    'text': link.get_text(strip=True),
                    'href': link['href'],
                    'title': link.get('title', '')
                })
            
            return links
            
        except Exception as e:
            print(f"Error scraping links: {e}")
            return []


def demo_scraping():
    """
    Demonstrate web scraping capabilities.
    """
    print("=== Web Scraping Demo ===\n")
    print("Yes, I am able to do web scraping!")
    print("\nThis script demonstrates basic web scraping capabilities using Python.")
    print("Key features demonstrated:")
    print("  ✓ HTTP requests with proper headers")
    print("  ✓ HTML parsing with BeautifulSoup")
    print("  ✓ Data extraction (title, meta, links, images)")
    print("  ✓ Error handling and timeout management")
    print("  ✓ CSS selector support")
    print("\nCommon use cases for web scraping:")
    print("  • Scraping algorithm problems from coding platforms")
    print("  • Extracting structured data from websites")
    print("  • Monitoring website changes")
    print("  • Collecting data for analysis")
    print("\nLibraries used:")
    print("  • requests: HTTP library for making requests")
    print("  • BeautifulSoup4: HTML/XML parsing library")
    
    print("\n=== Example Usage ===")
    print("scraper = AlgorithmScraper()")
    print("data = scraper.scrape_generic_page('https://example.com')")
    print("links = scraper.scrape_links('https://example.com')")
    print("text = scraper.extract_text_content('https://example.com', selector='h1')")
    
    # Example with a real site
    print("\n=== Live Example ===")
    scraper = AlgorithmScraper()
    
    # Scrape example.com as a demonstration
    print("\nScraping example.com...")
    result = scraper.scrape_generic_page('https://example.com')
    
    if result:
        print(f"\n✓ Successfully scraped!")
        print(f"  Title: {result['title']}")
        print(f"  Status Code: {result['status_code']}")
        print(f"  Links Count: {result['links_count']}")
        print(f"  Images Count: {result['images_count']}")
    else:
        print("✗ Scraping failed (this may be due to network restrictions)")
    
    print("\n" + "="*50)
    print("ANSWER: Yes, web scraping is fully supported!")
    print("="*50)


if __name__ == '__main__':
    demo_scraping()
