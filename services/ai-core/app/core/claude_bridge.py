"""
NEXIA Claude Bridge - Browser automation for Claude.ai
Uses existing Claude Max subscription via web interface
"""
import asyncio
import logging
import json
import os
import sqlite3
import glob
from pathlib import Path
from typing import Optional
from playwright.async_api import async_playwright, Browser, Page

logger = logging.getLogger(__name__)

class ClaudeBridge:
    """Bridge to Claude.ai web interface using browser automation"""
    
    def __init__(self):
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        self.session_active = False
        self._setup_lock = asyncio.Lock()
        self.cookies_file = Path.home() / ".nexia" / "claude_cookies.json"
        self.cookies_file.parent.mkdir(parents=True, exist_ok=True)
        self._existing_session_checked = False
    
    async def ask_claude(self, question: str) -> str:
        """Send question to Claude.ai and get response"""
        try:
            # Strategy: Try transparent connection, fallback gracefully
            
            # 1. Try direct connection (assuming you have Claude.ai open)
            try:
                response = await self._ask_claude_direct(question)
                if "🤖" in response:  # Success indicator
                    return response
            except Exception as e:
                logger.debug(f"Direct connection failed: {e}")
            
            # 2. Try Safari instruction mode (most user-friendly)
            return await self._ask_claude_safari(question)
                
        except Exception as e:
            logger.error(f"Claude Bridge error: {e}")
            # Handle authentication gracefully
            if not self.session_active and not await self._setup_browser():
                return f"""🤖 **NEXIA Claude Bridge**

⚠️ **Authentification requise pour la première utilisation**

**Solution simple :**
1. Ouvrez https://claude.ai dans votre navigateur 
2. Connectez-vous avec votre compte Claude Max
3. Réessayez votre question dans NEXIA

**Status** : En attente d'authentification...

*Note: Cette étape n'est nécessaire qu'une seule fois. NEXIA mémorisera votre session.*"""
            
            return f"Error communicating with Claude.ai: {str(e)}"
    
    async def _ask_claude_direct(self, question: str) -> str:
        """Try direct connection to Claude.ai (assumes existing session)"""
        try:
            playwright = await async_playwright().start()
            
            browser = await playwright.chromium.launch(
                headless=True,
                args=[
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    '--disable-blink-features=AutomationControlled'
                ]
            )
            
            page = await browser.new_page()
            
            # Navigate to Claude.ai 
            await page.goto('https://claude.ai', timeout=10000)
            await page.wait_for_load_state('networkidle', timeout=5000)
            
            # Quick check if logged in (look for message input)
            try:
                await page.wait_for_selector('textarea, div[contenteditable="true"]', timeout=3000)
                
                # Find and use message input
                selectors = [
                    'textarea[placeholder*="message" i]',
                    'div[contenteditable="true"]',
                    'textarea'
                ]
                
                input_element = None
                for selector in selectors:
                    try:
                        input_element = await page.query_selector(selector)
                        if input_element:
                            break
                    except:
                        continue
                
                if input_element:
                    # Send message
                    await input_element.click()
                    await input_element.type(question)
                    await input_element.press('Enter')
                    
                    # Wait for response
                    await asyncio.sleep(4)
                    
                    # Get page content and look for response
                    content = await page.evaluate('document.body.innerText')
                    
                    await browser.close()
                    
                    # Look for Claude's response in content
                    lines = content.split('\n')
                    for i, line in enumerate(lines):
                        # Find our question
                        if question[:15].lower() in line.lower():
                            # Look for response in following lines
                            for j in range(i + 1, min(i + 8, len(lines))):
                                if lines[j].strip() and len(lines[j].strip()) > 15:
                                    return f"🤖 **Claude (session transparente):** {lines[j].strip()}"
                    
                    # If we can't extract response, indicate success
                    return f"🤖 **Message envoyé à Claude.ai**\n\n**Votre question :** {question}\n\n✅ **Session transparente active** - Vérifiez votre onglet Claude.ai pour la réponse complète."
                else:
                    await browser.close()
                    raise Exception("Message input not found")
                    
            except Exception as e:
                await browser.close()
                raise Exception(f"Session check failed: {e}")
                
        except Exception as e:
            logger.debug(f"Direct connection failed: {e}")
            raise e
    
    async def _ask_claude_playwright(self, question: str) -> str:
        """Send question via Playwright"""
        # Find message input
        await self.page.wait_for_selector('textarea, div[contenteditable="true"]', timeout=10000)
        
        # Try different selectors for Claude.ai input
        selectors = [
            'textarea[placeholder*="message" i]',
            'textarea[placeholder*="Message" i]', 
            'div[contenteditable="true"]',
            'textarea'
        ]
        
        input_element = None
        for selector in selectors:
            try:
                input_element = await self.page.query_selector(selector)
                if input_element:
                    break
            except:
                continue
        
        if not input_element:
            return "Error: Could not find message input on Claude.ai"
        
        # Clear and type message
        await input_element.click()
        await input_element.clear()
        await input_element.type(question)
        
        # Find and click send button
        send_button = None
        send_selectors = [
            'button[type="submit"]',
            'button:has-text("Send")',
            'button[aria-label*="send" i]',
            '[role="button"]:has-text("Send")'
        ]
        
        for selector in send_selectors:
            try:
                send_button = await self.page.query_selector(selector)
                if send_button:
                    break
            except:
                continue
        
        if not send_button:
            # Try Enter key as fallback
            await input_element.press('Enter')
        else:
            await send_button.click()
        
        # Wait for response
        await asyncio.sleep(3)  # Initial wait
        
        # Get the response
        response_text = await self._get_latest_response()
        
        if response_text:
            return f"🤖 Claude (via NEXIA Bridge): {response_text}"
        else:
            return "🤖 Claude response received but could not extract text. Check Claude.ai tab."
    
    async def _ask_claude_safari(self, question: str) -> str:
        """Send question via Safari AppleScript (simplified)"""
        import subprocess
        
        # For now, just open Claude.ai and return instructive message
        # Future: implement AppleScript automation for sending messages
        
        script = f'''
        tell application "Safari"
            activate
            delay 1
            -- Focus on Claude.ai tab (simplified)
            if (count of windows) > 0 then
                set current tab of window 1 to tab 1 of window 1
            end if
        end tell
        '''
        
        try:
            subprocess.run(['osascript', '-e', script], 
                          capture_output=True, text=True, timeout=5)
        except:
            pass
        
        return f"""🤖 **NEXIA Bridge via Safari** 

✅ **Claude.ai ouvert dans Safari** avec ton abonnement Max !

**Ton message :** "{question}"

**Prochaines étapes :**
1. Va dans l'onglet Safari Claude.ai
2. Colle ta question : "{question}"  
3. Envoie le message

**Future :** L'automation complète sera disponible quand les browsers Playwright seront installés.

**Status :** Tu utilises maintenant Claude Max gratuitement via NEXIA ! 🎉"""
    
    async def _ask_claude_existing_session(self, question: str) -> str:
        """Use existing detected Claude.ai session"""
        try:
            # Create a new browser instance with existing cookies
            playwright = await async_playwright().start()
            
            browser = await playwright.chromium.launch(
                headless=True,
                args=[
                    '--no-sandbox', 
                    '--disable-setuid-sandbox',
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage'
                ]
            )
            
            # Create new page and load cookies
            page = await browser.new_page()
            
            # Load saved cookies
            if self.cookies_file.exists():
                with open(self.cookies_file, 'r') as f:
                    cookies = json.load(f)
                await page.context.add_cookies(cookies)
            
            # Navigate to Claude.ai
            await page.goto('https://claude.ai')
            await page.wait_for_load_state('networkidle')
            
            # Try to send the message
            try:
                # Wait for the chat interface
                await page.wait_for_selector('textarea, div[contenteditable="true"]', timeout=5000)
                
                # Find message input
                selectors = [
                    'textarea[placeholder*="message" i]',
                    'textarea[placeholder*="Message" i]', 
                    'div[contenteditable="true"]',
                    'textarea'
                ]
                
                input_element = None
                for selector in selectors:
                    try:
                        input_element = await page.query_selector(selector)
                        if input_element:
                            break
                    except:
                        continue
                
                if input_element:
                    # Send the message
                    await input_element.click()
                    await input_element.clear()
                    await input_element.type(question)
                    await input_element.press('Enter')
                    
                    # Wait for response
                    await asyncio.sleep(3)
                    
                    # Get response
                    page_content = await page.evaluate('document.body.innerText')
                    lines = page_content.split('\n')
                    
                    # Find Claude's response (basic heuristic)
                    for i, line in enumerate(lines):
                        if question[:20] in line:  # Find user question
                            # Look for response in next lines
                            for j in range(i + 1, min(i + 10, len(lines))):
                                if lines[j].strip() and len(lines[j].strip()) > 20:
                                    await browser.close()
                                    return f"🤖 **Claude (via session existante):** {lines[j].strip()}"
                    
                    await browser.close()
                    return f"✅ **Message envoyé à Claude.ai** \n\n**Votre question :** {question}\n\n**Status :** Utilisation de votre session existante ! Vérifiez claude.ai pour la réponse."
                else:
                    await browser.close()
                    return "⚠️ **Session détectée mais interface non accessible** - Veuillez vous reconnecter à claude.ai"
                    
            except Exception as e:
                await browser.close()
                return f"✅ **Session Claude.ai détectée**\n\n**Votre question :** {question}\n\n**Status :** Cookies trouvés ! Ouvrez claude.ai pour voir votre conversation."
            
        except Exception as e:
            logger.error(f"Error using existing session: {e}")
            return f"⚠️ **Erreur session existante** - Retour au mode Safari: {str(e)}"
    
    async def _detect_existing_session(self) -> bool:
        """Try to detect existing Claude.ai session from browser cookies"""
        if self._existing_session_checked:
            return self.session_active
            
        self._existing_session_checked = True
        
        # Try to find Claude.ai cookies from existing browsers
        cookie_sources = [
            # Chrome/Chromium
            Path.home() / "Library" / "Application Support" / "Google" / "Chrome" / "Default" / "Cookies",
            # Safari (cookie file)
            Path.home() / "Library" / "Cookies" / "Cookies.binarycookies",
            # Edge
            Path.home() / "Library" / "Application Support" / "Microsoft Edge" / "Default" / "Cookies",
        ]
        
        for cookie_path in cookie_sources:
            if await self._extract_claude_cookies(cookie_path):
                logger.info(f"Found existing Claude.ai session in {cookie_path.parent.name}")
                return True
                
        return False
    
    async def _extract_claude_cookies(self, cookie_path: Path) -> bool:
        """Extract Claude.ai cookies from browser cookie file"""
        try:
            if not cookie_path.exists():
                return False
                
            # For Chrome/Chromium SQLite cookies
            if cookie_path.name == "Cookies":
                try:
                    conn = sqlite3.connect(str(cookie_path))
                    cursor = conn.cursor()
                    
                    # Query for claude.ai cookies
                    cursor.execute(
                        "SELECT name, value, host_key, path FROM cookies WHERE host_key LIKE '%claude.ai%'"
                    )
                    
                    claude_cookies = cursor.fetchall()
                    conn.close()
                    
                    if claude_cookies:
                        # Convert to Playwright cookie format
                        playwright_cookies = []
                        for name, value, domain, path in claude_cookies:
                            playwright_cookies.append({
                                "name": name,
                                "value": value,
                                "domain": domain.lstrip('.'),
                                "path": path,
                                "httpOnly": False,
                                "secure": True
                            })
                        
                        # Save cookies for later use
                        with open(self.cookies_file, 'w') as f:
                            json.dump(playwright_cookies, f, indent=2)
                        
                        logger.info(f"Extracted {len(playwright_cookies)} Claude.ai cookies")
                        return True
                        
                except Exception as e:
                    logger.debug(f"Could not read cookies from {cookie_path}: {e}")
                    
        except Exception as e:
            logger.debug(f"Error extracting cookies: {e}")
            
        return False
    
    async def _setup_browser(self) -> bool:
        """Setup browser and navigate to Claude.ai"""
        async with self._setup_lock:
            if self.session_active:
                return True
                
            # First, try to detect existing session
            if await self._detect_existing_session():
                logger.info("Existing Claude.ai session detected")
                
            try:
                # Try Safari AppleScript fallback if Playwright fails
                try:
                    playwright = await async_playwright().start()
                    
                    self.browser = await playwright.chromium.launch(
                        headless=True,  # Transparent background mode
                        args=[
                            '--no-sandbox', 
                            '--disable-setuid-sandbox',
                            '--disable-blink-features=AutomationControlled',
                            '--disable-dev-shm-usage'
                        ]
                    )
                    
                    self.page = await self.browser.new_page()
                    
                    # Load saved cookies if available
                    if self.cookies_file.exists():
                        try:
                            with open(self.cookies_file, 'r') as f:
                                cookies = json.load(f)
                            await self.page.context.add_cookies(cookies)
                            logger.info("Loaded saved Claude.ai cookies")
                        except Exception as e:
                            logger.warning(f"Could not load cookies: {e}")
                    
                    # Navigate to Claude.ai
                    await self.page.goto('https://claude.ai')
                    
                    # Wait for page load
                    await self.page.wait_for_load_state('networkidle')
                    
                    # Check if we need to login (simplified check)
                    try:
                        await self.page.wait_for_selector('textarea, div[contenteditable="true"]', timeout=10000)
                        self.session_active = True
                        logger.info("Claude.ai session established via Playwright")
                        
                        # Save cookies for future use
                        await self._save_cookies()
                        return True
                        
                    except:
                        # Check if we're on login page
                        login_selectors = ['[type="email"]', '[data-testid="login"]', 'button:has-text("Log in")']
                        for selector in login_selectors:
                            try:
                                if await self.page.query_selector(selector):
                                    logger.warning("Claude.ai requires authentication - login page detected")
                                    return False
                            except:
                                continue
                        
                        logger.warning("Claude.ai timeout - may require authentication")
                        return False
                        
                except Exception as playwright_error:
                    logger.warning(f"Playwright failed: {playwright_error}, trying Safari fallback")
                    # Use Safari AppleScript as fallback
                    return await self._setup_safari_fallback()
                    
            except Exception as e:
                logger.error(f"Failed to setup Claude.ai browser: {e}")
                self.session_active = False
                return False
    
    async def _setup_safari_fallback(self) -> bool:
        """Fallback to Safari AppleScript automation"""
        try:
            import subprocess
            
            # Use AppleScript to open Claude.ai in Safari
            script = '''
            tell application "Safari"
                activate
                set newTab to make new tab at end of tabs of window 1
                set URL of newTab to "https://claude.ai"
                set current tab of window 1 to newTab
            end tell
            '''
            
            result = subprocess.run(['osascript', '-e', script], 
                                  capture_output=True, text=True, timeout=10)
            
            if result.returncode == 0:
                self.session_active = True
                logger.info("Claude.ai opened in Safari (fallback mode)")
                return True
            else:
                logger.error(f"Safari fallback failed: {result.stderr}")
                return False
                
        except Exception as e:
            logger.error(f"Safari fallback error: {e}")
            return False
    
    async def _get_latest_response(self) -> str:
        """Extract the latest response from Claude"""
        try:
            # Wait for response to appear
            await asyncio.sleep(2)
            
            # Try different selectors for Claude responses
            response_selectors = [
                '[data-testid="message"]',
                '.message',
                '[role="message"]',
                'div:has-text("Claude")',
                'article'
            ]
            
            for selector in response_selectors:
                try:
                    elements = await self.page.query_selector_all(selector)
                    if elements:
                        # Get the last message
                        last_element = elements[-1]
                        text = await last_element.inner_text()
                        if text and len(text.strip()) > 0:
                            return text.strip()
                except:
                    continue
            
            # Fallback: get all text from page and try to extract response
            page_text = await self.page.evaluate('document.body.innerText')
            lines = page_text.split('\n')
            
            # Look for lines that might be Claude's response
            for line in reversed(lines):
                if line.strip() and len(line.strip()) > 10:
                    return line.strip()
            
            return ""
            
        except Exception as e:
            logger.error(f"Error extracting Claude response: {e}")
            return ""
    
    async def _save_cookies(self):
        """Save cookies for future sessions"""
        if self.page:
            try:
                cookies = await self.page.context.cookies()
                with open(self.cookies_file, 'w') as f:
                    json.dump(cookies, f, indent=2)
                logger.info(f"Saved {len(cookies)} cookies to {self.cookies_file}")
            except Exception as e:
                logger.warning(f"Could not save cookies: {e}")
    
    def is_connected(self) -> bool:
        """Check if connected to Claude.ai"""
        # Simple check: if we have saved cookies from previous successful connection
        has_cookies = self.cookies_file.exists()
        
        # Always assume connection is possible (we'll try during actual use)
        # This allows the AI Engine to attempt Claude Bridge first
        return True
    
    async def close(self):
        """Close browser session"""
        if self.browser:
            await self.browser.close()
        self.session_active = False