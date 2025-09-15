-- NEXIA Claude Bridge - AppleScript automation for Claude.ai
-- Usage: osascript claude-bridge.applescript "your question"

on run argv
    if length of argv = 0 then
        return "Error: No question provided"
    end if
    
    set question to item 1 of argv
    set claudeResponse to "Initializing..."
    
    tell application "Safari"
        -- Check if Claude.ai is already open
        set claudeTab to missing value
        repeat with w in windows
            repeat with t in tabs of w
                if URL of t contains "claude.ai" then
                    set claudeTab to t
                    exit repeat
                end if
            end repeat
            if claudeTab is not missing value then exit repeat
        end repeat
        
        -- Open Claude.ai if not found
        if claudeTab is missing value then
            set newTab to make new tab at end of tabs of window 1
            set URL of newTab to "https://claude.ai"
            set claudeTab to newTab
            delay 3 -- Wait for page load
        end if
        
        -- Focus on the Claude tab
        set current tab of window 1 to claudeTab
        
        -- Wait for page to be ready
        delay 2
        
        -- Try to find and click the message input
        try
            do JavaScript "
                // Find message input (various selectors)
                const selectors = [
                    'textarea[placeholder*=\"message\"]',
                    'textarea[placeholder*=\"Message\"]', 
                    'div[contenteditable=\"true\"]',
                    'textarea'
                ];
                
                let input = null;
                for (let selector of selectors) {
                    input = document.querySelector(selector);
                    if (input) break;
                }
                
                if (input) {
                    input.focus();
                    input.value = '" & question & "';
                    
                    // Trigger input event
                    input.dispatchEvent(new Event('input', {bubbles: true}));
                    
                    // Find and click send button
                    const sendButtons = document.querySelectorAll('button, [role=\"button\"]');
                    for (let btn of sendButtons) {
                        if (btn.textContent.toLowerCase().includes('send') || 
                            btn.querySelector('svg') ||
                            btn.type === 'submit') {
                            btn.click();
                            break;
                        }
                    }
                    
                    'Message sent';
                } else {
                    'Input not found';
                }
            " in claudeTab
            
            -- Wait for response (adjust timing as needed)
            delay 5
            
            -- Get the response
            set claudeResponse to do JavaScript "
                // Get last message from Claude
                const messages = document.querySelectorAll('[data-message], .message, .chat-message');
                if (messages.length > 0) {
                    const lastMessage = messages[messages.length - 1];
                    return lastMessage.textContent || lastMessage.innerText || 'Response found but could not extract text';
                } else {
                    return 'No response found';
                }
            " in claudeTab
            
        on error errMsg
            set claudeResponse to "Error: " & errMsg
        end try
        
    end tell
    
    return claudeResponse
end run