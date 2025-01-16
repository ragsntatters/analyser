import requests
import re
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def check_wordpress(url):
    """
    Check if a website is built with WordPress by looking for common indicators
    """
    try:
        # Make request with a custom user agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Get the page content
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        
        # Check for common WordPress indicators
        wordpress_indicators = [
            # Check for wp-content directory
            bool(re.search(r'wp-content|wp-includes', html)),
            
            # Check for WordPress meta generator tag
            bool(soup.find('meta', {'name': 'generator', 'content': re.compile('WordPress', re.I)})),
            
            # Check for WordPress admin links
            bool(soup.find('link', {'rel': 'https://api.w.org/'})),
            
            # Check for common WordPress themes/plugins paths
            bool(re.search(r'themes/[^/]+/|plugins/[^/]+/', html)),
            
            # Check for WordPress RSS feed
            bool(soup.find('link', {'type': 'application/rss+xml'})),
            
            # Check for wp-json API endpoint
            bool(re.search(r'/wp-json/', html))
        ]
        
        # Additional check for wp-admin
        try:
            wp_admin = requests.head(urljoin(url, 'wp-admin'), headers=headers, timeout=5)
            wordpress_indicators.append(wp_admin.status_code != 404)
        except:
            pass
        
        # If any two indicators are true, it's likely WordPress
        return sum(wordpress_indicators) >= 2
        
    except Exception as e:
        print(f"Error checking WordPress for {url}: {str(e)}")
        return False
