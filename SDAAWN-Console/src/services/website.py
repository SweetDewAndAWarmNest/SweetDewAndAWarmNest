"""
WebsiteService - Website interaction tools for SDAAWN Console.
"""

import logging
import requests
from typing import Optional, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)


class WebsiteService:
    """Website interaction tools for SDAAWN Console."""
    
    def __init__(self):
        self.base_url = "https://sdaawn.pages.dev"
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "SDAAWN-Console/1.0",
        })
        
    def health_check(self, url: str = None) -> Dict[str, Any]:
        """Perform health check on a website."""
        url = url or self.base_url
        try:
            response = self.session.head(url, timeout=10, allow_redirects=True)
            return {
                "url": url,
                "status_code": response.status_code,
                "success": response.status_code < 400,
                "checked_at": datetime.now().isoformat(),
            }
        except requests.exceptions.RequestException as e:
            return {
                "url": url,
                "status_code": None,
                "success": False,
                "error": str(e),
                "checked_at": datetime.now().isoformat(),
            }
    
    def get_sitemap(self, url: str = None) -> list:
        """Fetch and parse sitemap from a website."""
        url = url or self.base_url
        sitemap_url = url.rstrip("/") + "/sitemap.xml"
        try:
            response = self.session.get(sitemap_url, timeout=10)
            if response.status_code == 200:
                from xml.etree import ElementTree as ET
                root = ET.fromstring(response.content)
                namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
                urls = []
                for loc in root.findall('.//ns:loc', namespace):
                    urls.append(loc.text)
                return {"urls": urls, "count": len(urls), "success": True}
            return {"urls": [], "count": 0, "success": False, "error": f"Status {response.status_code}"}
        except Exception as e:
            return {"urls": [], "count": 0, "success": False, "error": str(e)}
    
    def check_performance(self, url: str = None) -> Dict[str, Any]:
        """Check website performance metrics."""
        url = url or self.base_url
        try:
            response = self.session.get(url, timeout=10)
            return {
                "url": url,
                "status_code": response.status_code,
                "content_type": response.headers.get("content-type", "unknown"),
                "content_length": len(response.content),
                "checked_at": datetime.now().isoformat(),
            }
        except Exception as e:
            return {
                "url": url,
                "success": False,
                "error": str(e),
                "checked_at": datetime.now().isoformat(),
            }
    
    def check_robots(self, url: str = None) -> Dict[str, Any]:
        """Fetch robots.txt file."""
        url = url or self.base_url
        robots_url = url.rstrip("/") + "/robots.txt"
        try:
            response = self.session.get(robots_url, timeout=10)
            return {
                "url": robots_url,
                "content": response.text,
                "status_code": response.status_code,
                "success": response.status_code == 200,
                "checked_at": datetime.now().isoformat(),
            }
        except Exception as e:
            return {
                "url": robots_url,
                "success": False,
                "error": str(e),
                "checked_at": datetime.now().isoformat(),
            }
    
    def check_csp(self, url: str = None) -> Dict[str, Any]:
        """Check Content Security Policy headers."""
        url = url or self.base_url
        try:
            response = self.session.get(url, timeout=10)
            csp = response.headers.get("content-security-policy", "Not set")
            return {
                "url": url,
                "csp": csp,
                "status_code": response.status_code,
                "success": True,
                "checked_at": datetime.now().isoformat(),
            }
        except Exception as e:
            return {
                "url": url,
                "success": False,
                "error": str(e),
                "checked_at": datetime.now().isoformat(),
            }
