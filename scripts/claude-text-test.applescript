-- Test text injection in Claude
on run argv
    try        
        tell application "Safari"
            activate
            delay 1
            
            set jsResult to do JavaScript "
                // Find text input area
                const inputs = document.querySelectorAll('textarea, div[contenteditable=\"true\"], input[type=\"text\"]');
                let result = 'Found ' + inputs.length + ' inputs. ';
                
                for (let i = 0; i < inputs.length; i++) {
                    let input = inputs[i];
                    result += 'Input ' + i + ': ' + input.tagName + ' ';
                    if (input.placeholder) {
                        result += '(placeholder: ' + input.placeholder + ') ';
                    }
                }
                
                result;
            "
            
            return jsResult
            
        end tell
        
    on error errMsg
        return "Error: " & errMsg
    end try
end run