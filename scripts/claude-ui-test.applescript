-- Test UI automation approach
tell application "System Events"
    tell application "Safari" to activate
    delay 2
    
    -- Try to find text fields using UI elements
    try
        tell process "Safari"
            set textFields to text fields of window 1
            return "Found " & (count of textFields) & " text fields"
        end tell
    on error
        return "Could not access UI elements - check Accessibility permissions"
    end try
end tell