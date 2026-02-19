#!/bin/bash

# Get all markdown files first
declare -A all_files
while IFS= read -r file; do
    all_files["$file"]=1
done < <(find . -name "*.md" -type f | sed 's|^\./||')

broken=()

# Check each markdown file for links
while IFS= read -r source_file; do
    source_rel=$(echo "$source_file" | sed 's|^\./||')
    source_dir=$(dirname "$source_rel")
    
    # Extract link targets - simplified approach
    while IFS= read -r line; do
        # Find all [text](path) patterns
        temp_line="$line"
        while [[ "$temp_line" =~ \[([^\]]*)\]\(([^)]*\.md[^)]*)\) ]]; do
            target="${BASH_REMATCH[2]}"
            temp_line="${temp_line#*${BASH_REMATCH[0]}}"
            
            # Remove anchor if present
            target="${target%#*}"
            
            # Skip if empty
            [ -z "$target" ] && continue
            
            # Resolve relative paths
            resolved="$target"
            if [[ "$target" =~ ^\.\./ ]]; then
                # Go up directories
                num_ups=0
                temp="$target"
                while [[ "$temp" =~ ^\.\./ ]]; do
                    ((num_ups++))
                    temp="${temp#../}"
                done
                
                # Build path from source_dir
                dir_parts=(${source_dir//\// })
                for ((i=0; i<num_ups && ${#dir_parts[@]}>0; i++)); do
                    unset 'dir_parts[-1]'
                done
                
                resolved="${temp}"
                if [ ${#dir_parts[@]} -gt 0 ]; then
                    resolved="$(printf '/%s' "${dir_parts[@]}")/$temp"
                    resolved="${resolved#/}"
                fi
            elif [[ "$target" =~ ^\./ ]]; then
                if [ "$source_dir" != "." ] && [ -n "$source_dir" ]; then
                    resolved="$source_dir/${target#./}"
                else
                    resolved="${target#./}"
                fi
            else
                if [ "$source_dir" != "." ] && [ -n "$source_dir" ]; then
                    resolved="$source_dir/$target"
                else
                    resolved="$target"
                fi
            fi
            
            # Check if file exists
            if [ -z "${all_files[$resolved]}" ]; then
                broken+=("$source_rel|$target")
            fi
        done
    done < <(grep -E '\[([^\]]*)\]\(.*\.md' "$source_file" 2>/dev/null || true)
done < <(find . -name "*.md" -type f)

# Report
if [ ${#broken[@]} -gt 0 ]; then
    echo "BROKEN LINKS FOUND:"
    echo ""
    for link in "${broken[@]}"; do
        source="${link%%|*}"
        target="${link#*|}"
        echo "- $source -> $target"
    done
    echo ""
    echo "Total broken links: ${#broken[@]}"
else
    echo "No broken links found!"
fi
