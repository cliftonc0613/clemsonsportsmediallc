#!/bin/bash

# Build Presos Presentation Script
# Builds and optionally serves Presos presentations using Jekyll

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default presos directory
PRESOS_DIR="${PRESOS_DIR:-$HOME/presos}"

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "ℹ $1"
}

# Function to check if presos directory exists
check_presos_installation() {
    if [ ! -d "$PRESOS_DIR" ]; then
        print_error "Presos directory not found at: $PRESOS_DIR"
        echo ""
        echo "Please set PRESOS_DIR environment variable or install presos:"
        echo "  git clone https://github.com/dsyer/presos ~/presos"
        echo "  cd ~/presos"
        echo "  git submodule update --init"
        echo "  bundle install"
        exit 1
    fi
    print_success "Found presos at: $PRESOS_DIR"
}

# Function to check if bundler is installed
check_bundler() {
    if ! command -v bundle &> /dev/null; then
        print_error "Bundler is not installed"
        echo ""
        echo "Install bundler:"
        echo "  gem install bundler"
        exit 1
    fi
    print_success "Bundler is installed"
}

# Function to check if jekyll is installed
check_jekyll() {
    cd "$PRESOS_DIR"
    if ! bundle exec jekyll --version &> /dev/null; then
        print_warning "Jekyll gems not installed"
        print_info "Installing dependencies..."
        bundle install
    fi
    print_success "Jekyll is ready"
}

# Function to build presentation
build_presentation() {
    cd "$PRESOS_DIR"
    print_info "Building presentation..."

    if bundle exec jekyll build; then
        print_success "Build completed successfully"
        echo ""
        print_info "Generated files in: ${PRESOS_DIR}/_site/decks/"
        return 0
    else
        print_error "Build failed"
        return 1
    fi
}

# Function to serve presentation
serve_presentation() {
    local presentation_file="$1"
    cd "$PRESOS_DIR"

    print_info "Starting Jekyll server..."
    print_info "Server will run at: http://localhost:4000"
    echo ""

    # Extract presentation name from file path
    if [ -n "$presentation_file" ]; then
        local pres_name=$(basename "$presentation_file" .md)
        print_info "View your presentation at: http://localhost:4000/decks/${pres_name}.html"
    else
        print_info "Browse all presentations at: http://localhost:4000/decks/"
    fi

    echo ""
    print_warning "Press Ctrl+C to stop the server"
    echo ""

    bundle exec jekyll serve -w
}

# Function to open presentation in browser
open_presentation() {
    local presentation_file="$1"
    local pres_name=$(basename "$presentation_file" .md)
    local html_path="${PRESOS_DIR}/_site/decks/${pres_name}.html"

    if [ -f "$html_path" ]; then
        print_info "Opening presentation in browser..."

        # Detect OS and open browser
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "$html_path"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "$html_path"
        else
            print_warning "Unable to automatically open browser on this OS"
            print_info "Open manually: file://${html_path}"
        fi
    else
        print_error "Generated HTML not found at: $html_path"
    fi
}

# Show usage
usage() {
    echo "Usage: $0 [OPTIONS] [PRESENTATION_FILE]"
    echo ""
    echo "Build and serve Presos presentations"
    echo ""
    echo "Options:"
    echo "  -b, --build      Build presentation only (no server)"
    echo "  -s, --serve      Build and serve with auto-rebuild"
    echo "  -o, --open       Build and open in browser"
    echo "  -h, --help       Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  PRESOS_DIR       Path to presos installation (default: ~/presos)"
    echo ""
    echo "Examples:"
    echo "  $0 --build decks/my-talk.md"
    echo "  $0 --serve decks/my-talk.md"
    echo "  $0 --open decks/my-talk.md"
    exit 0
}

# Main script
main() {
    local mode="build"
    local presentation_file=""

    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -b|--build)
                mode="build"
                shift
                ;;
            -s|--serve)
                mode="serve"
                shift
                ;;
            -o|--open)
                mode="open"
                shift
                ;;
            -h|--help)
                usage
                ;;
            *)
                presentation_file="$1"
                shift
                ;;
        esac
    done

    echo ""
    echo "═══════════════════════════════════════"
    echo "  Presos Presentation Builder"
    echo "═══════════════════════════════════════"
    echo ""

    # Run checks
    check_presos_installation
    check_bundler
    check_jekyll
    echo ""

    # Execute based on mode
    case $mode in
        build)
            if build_presentation; then
                if [ -n "$presentation_file" ]; then
                    open_presentation "$presentation_file"
                fi
            fi
            ;;
        serve)
            build_presentation && serve_presentation "$presentation_file"
            ;;
        open)
            if build_presentation; then
                if [ -n "$presentation_file" ]; then
                    open_presentation "$presentation_file"
                else
                    print_error "Please specify a presentation file to open"
                    exit 1
                fi
            fi
            ;;
    esac
}

# Run main function
main "$@"
