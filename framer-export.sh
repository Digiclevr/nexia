#!/bin/bash

# Framer Site Complete Export Tool
echo "🚀 Framer Export Tool"

# Check if URL provided
if [ -z "$1" ]; then
    echo "Usage: ./framer-export.sh https://your-site.framer.website/"
    exit 1
fi

SITE_URL=$1
EXPORT_DIR="framer-export-$(date +%Y%m%d-%H%M%S)"

echo "📁 Creating export directory: $EXPORT_DIR"
mkdir -p "$EXPORT_DIR"
cd "$EXPORT_DIR"

echo "🌐 Downloading complete site..."
wget --mirror \
     --convert-links \
     --adjust-extension \
     --page-requisites \
     --no-parent \
     --wait=1 \
     --user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
     "$SITE_URL"

echo "🎨 Organizing assets..."
mkdir -p assets/{css,js,images}

# Move CSS files
find . -name "*.css" -exec mv {} assets/css/ \; 2>/dev/null || true

# Move JS files  
find . -name "*.js" -exec mv {} assets/js/ \; 2>/dev/null || true

# Move images
find . \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) -exec mv {} assets/images/ \; 2>/dev/null || true

echo "✅ Export completed in: $EXPORT_DIR"
echo "📊 Files exported:"
echo "   HTML pages: $(find . -name "*.html" | wc -l)"
echo "   CSS files: $(find assets/css -name "*.css" 2>/dev/null | wc -l)"
echo "   JS files: $(find assets/js -name "*.js" 2>/dev/null | wc -l)"
echo "   Images: $(find assets/images \( -name "*.jpg" -o -name "*.png" -o -name "*.svg" \) 2>/dev/null | wc -l)"