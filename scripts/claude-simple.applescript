-- Simple Claude automation test
on run argv
    try
        set question to "Hello from NEXIA, please respond with: BRIDGE WORKING"
        
        tell application "Safari"
            activate
            delay 1
            
            -- Find Claude tab or open new one
            set foundTab to false
            repeat with w in windows
                repeat with t in tabs of w
                    if URL of t contains "claude.ai" then
                        set current tab of window 1 to t
                        set foundTab to true
                        exit repeat
                    end if
                end repeat
                if foundTab then exit repeat
            end repeat
            
            if not foundTab then
                tell window 1
                    set newTab to make new tab at end of tabs
                    set URL of newTab to "https://claude.ai"
                    set current tab to newTab
                end tell
                delay 5
            end if
            
            delay 2
            
            -- Simple JavaScript injection
            set jsResult to do JavaScript "
                document.body.style.border = '5px solid red';
                'JavaScript is working';
            "
            
            return "JS Result: " & jsResult
            
        end tell
        
    on error errMsg
        return "Error: " & errMsg
    end try
end run