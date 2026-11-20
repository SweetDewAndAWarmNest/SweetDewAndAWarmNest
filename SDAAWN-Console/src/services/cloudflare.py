"""
CloudflareService - Cloudflare API integration and management.
"""

import logging
import requests
from typing import Optional

logger = logging.getLogger(__name__)


class CloudflareService:
    """Cloudflare API integration for SDAAWN Console."""
    
    def __init__(self):
        self.api_token = None
        self.account_id = None
        self.region = "auto"
        self._session = requests.Session()
        self._session.headers.update({
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json",
        })
        
    def connect(self, api_token: str, account_id: str, region: str = "auto"):
        """Connect to Cloudflare using API token."""
        self.api_token = api_token
        self.account_id = account_id
        self.region = region
        self._session.headers.update({
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json",
        })
        logger.info("Connected to Cloudflare")
        return self
        
    def get_accounts(self):
        """Get Cloudflare accounts."""
        try:
            response = self._session.get(
                f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/usage",
                params={"endpoint": "usage"},
                timeout=30
            )
            return {"success": True, "data": response.json()}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_pages_projects(self):
        """Get Cloudflare Pages projects."""
        try:
            response = self._session.get(
                f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/pages/projects",
                timeout=30
            )
            return {"success": True, "data": response.json()}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_workers(self):
        """Get Cloudflare Workers."""
        try:
            response = self._session.get(
                f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/workers",
                timeout=30
            )
            return {"success": True, "data": response.json()}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_dns(self):
        """Get Cloudflare DNS records."""
        try:
            response = self._session.get(
                f"https://api.cloudflare.com/client/v4/zones/{self.account_id}/dns_records",
                timeout=30
            )
            return {"success": True, "data": response.json()}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def get_cache_info(self):
        """Get Cloudflare cache information."""
        try:
            response = self._session.get(
                f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/cache",
                timeout=30
            )
            return {"success": True, "data": response.json()}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def api_request(self, method: str, endpoint: str, **kwargs):
        """Make API request to Cloudflare."""
        url = f"https://api.cloudflare.com/client/v4/{endpoint}"
        response = self._session.request(method, url, timeout=30, **kwargs)
        return response.json()
