#!/bin/bash

# YouTube Research Command
# Analyzes YouTube content for SEO opportunities, competitive intelligence, and content strategy
# Usage: /youtube-research [search-intent|video-url|channel-url]

set -e

INPUT="$1"
TIMESTAMP=$(date +"%Y-%m-%d")
BASE_DIR="/Users/cliftoncanady/Web Apps/_claudelife"
YOUTUBE_DIR="$BASE_DIR/youtube-research"

# Ensure directories exist
mkdir -p "$YOUTUBE_DIR/videos" "$YOUTUBE_DIR/channels" "$YOUTUBE_DIR/searches" "$YOUTUBE_DIR/keywords" "$YOUTUBE_DIR/reports"

# Function to detect input type
detect_input_type() {
    local input="$1"
    
    if [[ $input =~ youtube\.com/watch\?v= ]] || [[ $input =~ youtu\.be/ ]]; then
        echo "video"
    elif [[ $input =~ youtube\.com/channel/ ]] || [[ $input =~ youtube\.com/c/ ]] || [[ $input =~ youtube\.com/@[a-zA-Z0-9_-]+ ]]; then
        echo "channel"
    else
        echo "search"
    fi
}

# Function to sanitize filename
sanitize_filename() {
    echo "$1" | sed 's/[^a-zA-Z0-9._-]/-/g' | tr '[:upper:]' '[:lower:]'
}

# Main logic
if [ -z "$INPUT" ]; then
    echo "🔍 YouTube Research System"
    echo ""
    echo "Enter one of the following:"
    echo "• Search intent (e.g., 'AI productivity tools')"
    echo "• YouTube video URL"
    echo "• YouTube channel URL"
    echo ""
    read -p "Input: " INPUT
fi

INPUT_TYPE=$(detect_input_type "$INPUT")
SAFE_NAME=$(sanitize_filename "$INPUT")

case $INPUT_TYPE in
    "video")
        echo "🎥 Analyzing YouTube Video..."
        echo "Input: $INPUT"
        echo "Type: Individual Video Analysis"
        
        # Launch video analyzer subagent
        claude --subagent youtube-video-analyzer \
            --input "$INPUT" \
            --output "$YOUTUBE_DIR/videos/video-analysis-$SAFE_NAME-$TIMESTAMP.md" \
            --keywords-output "$YOUTUBE_DIR/keywords/video-keywords-$SAFE_NAME-$TIMESTAMP.md"
        ;;
        
    "channel")
        echo "📺 Analyzing YouTube Channel..."
        echo "Input: $INPUT"
        echo "Type: Channel Competitive Analysis"
        
        # Launch channel analyzer subagent
        claude --subagent youtube-channel-analyzer \
            --input "$INPUT" \
            --output "$YOUTUBE_DIR/channels/channel-analysis-$SAFE_NAME-$TIMESTAMP.md" \
            --report-output "$YOUTUBE_DIR/reports/channel-strategy-$SAFE_NAME-$TIMESTAMP.md"
        ;;
        
    "search")
        echo "🔎 Analyzing Search Intent..."
        echo "Input: $INPUT"
        echo "Type: Content Opportunity Research"
        
        # Launch search analyzer subagent
        claude --subagent youtube-search-analyzer \
            --input "$INPUT" \
            --output "$YOUTUBE_DIR/searches/search-analysis-$SAFE_NAME-$TIMESTAMP.md" \
            --keywords-output "$YOUTUBE_DIR/keywords/search-keywords-$SAFE_NAME-$TIMESTAMP.md" \
            --report-output "$YOUTUBE_DIR/reports/content-strategy-$SAFE_NAME-$TIMESTAMP.md"
        ;;
        
    *)
        echo "❌ Could not determine input type. Please provide:"
        echo "• YouTube video URL (youtube.com/watch?v= or youtu.be/)"
        echo "• YouTube channel URL (youtube.com/channel/, youtube.com/c/, or youtube.com/@username)"
        echo "• Search intent (plain text)"
        exit 1
        ;;
esac

echo ""
echo "✅ YouTube research completed!"
echo "📁 Results saved to: $YOUTUBE_DIR"
echo ""
echo "Generated files:"
case $INPUT_TYPE in
    "video")
        echo "• Video Analysis: youtube-research/videos/video-analysis-$SAFE_NAME-$TIMESTAMP.md"
        echo "• SEO Keywords: youtube-research/keywords/video-keywords-$SAFE_NAME-$TIMESTAMP.md"
        ;;
    "channel")
        echo "• Channel Analysis: youtube-research/channels/channel-analysis-$SAFE_NAME-$TIMESTAMP.md" 
        echo "• Strategy Report: youtube-research/reports/channel-strategy-$SAFE_NAME-$TIMESTAMP.md"
        ;;
    "search")
        echo "• Search Analysis: youtube-research/searches/search-analysis-$SAFE_NAME-$TIMESTAMP.md"
        echo "• Keywords Research: youtube-research/keywords/search-keywords-$SAFE_NAME-$TIMESTAMP.md"
        echo "• Content Strategy: youtube-research/reports/content-strategy-$SAFE_NAME-$TIMESTAMP.md"
        ;;
esac