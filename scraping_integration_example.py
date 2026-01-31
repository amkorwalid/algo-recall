#!/usr/bin/env python3
"""
Example: Converting Scraped Data to Quiz Format
This demonstrates how scraped algorithm problems can be converted
to the quiz format used in the algo-recall app.
"""

from bs4 import BeautifulSoup
import json


def convert_scraped_to_quiz_format(scraped_problem):
    """
    Convert scraped problem data to the quiz format used in problems.json
    
    Args:
        scraped_problem: Dictionary with scraped problem data
        
    Returns:
        Dictionary in the quiz format
    """
    quiz_format = {
        "id": scraped_problem.get('id', 'unknown'),
        "title": scraped_problem.get('title', 'Unknown Problem'),
        "difficulty": scraped_problem.get('difficulty', 'medium').lower(),
        "topics": scraped_problem.get('topics', []),
        "problem_summary": scraped_problem.get('description', ''),
        "quiz": {
            "question": scraped_problem.get('quiz_question', 
                                           f"What is the main idea to solve '{scraped_problem.get('title', 'this problem')}' efficiently?"),
            "options": [
                {
                    "id": "A",
                    "text": "Brute force approach",
                    "is_correct": False,
                    "why_wrong": "This approach is inefficient"
                },
                {
                    "id": "B",
                    "text": "Optimized approach (to be filled)",
                    "is_correct": True
                }
            ]
        },
        "key_insight": "Add the key insight here"
    }
    
    return quiz_format


def demo_integration():
    """
    Demonstrate how web scraping integrates with the quiz app.
    """
    print("=== Web Scraping → Quiz Integration Demo ===\n")
    
    # Simulated scraped data (in real scenario, this comes from web_scraper.py)
    scraped_data = {
        'id': 'lc_001',
        'title': 'Two Sum',
        'difficulty': 'Easy',
        'topics': ['array', 'hash_map'],
        'description': 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'
    }
    
    print("1. Scraped Data (from web scraping):")
    print(json.dumps(scraped_data, indent=2))
    
    # Convert to quiz format
    quiz_problem = convert_scraped_to_quiz_format(scraped_data)
    
    print("\n2. Converted to Quiz Format:")
    print(json.dumps(quiz_problem, indent=2))
    
    print("\n" + "="*50)
    print("Integration Workflow:")
    print("="*50)
    print("Step 1: Use web_scraper.py to scrape problems")
    print("Step 2: Parse and extract problem details")
    print("Step 3: Convert to quiz format (this script)")
    print("Step 4: Add to problems.json")
    print("Step 5: Quiz app displays the problem")
    
    print("\n" + "="*50)
    print("Web Scraping Benefits for Algo-Recall:")
    print("="*50)
    print("✓ Automatically collect problems from platforms")
    print("✓ Keep problem database up to date")
    print("✓ Extract topics and difficulty levels")
    print("✓ Scale the quiz content quickly")
    print("✓ Maintain consistency in data format")


if __name__ == '__main__':
    demo_integration()
