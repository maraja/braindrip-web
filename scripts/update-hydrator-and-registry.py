#!/usr/bin/env python3
"""
Update InteractiveHydrator.tsx and interactive-registry.mjs
to include the new Walkthrough and Explorer components.
"""

import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMPONENTS_DIR = os.path.join(BASE_DIR, 'src', 'components', 'interactive')
HYDRATOR_PATH = os.path.join(COMPONENTS_DIR, 'InteractiveHydrator.tsx')
REGISTRY_PATH = os.path.join(BASE_DIR, 'src', 'data', 'interactive-registry.mjs')
CONTENT_DIR = os.path.join(BASE_DIR, 'src', 'content', 'courses')

COURSE_PREFIXES = {
    'agentic-design-patterns': 'ADP',
    'ai-agent-concepts': 'AAC',
    'ai-agent-evaluation': 'AAE',
    'computer-vision-concepts': 'CVC',
    'langgraph-agents': 'LGA',
    'llm-evolution': 'LLE',
    'machine-learning-foundations': 'MLF',
    'mcp-server-supabase-course': 'MCP',
    'natural-language-processing': 'NLP',
    'prompt-engineering': 'PE',
    'reinforcement-learning': 'RL',
}


def slug_to_pascal(slug):
    return ''.join(word.capitalize() for word in slug.split('-'))


def extract_h2_sections(md_path):
    """Extract h2 headings from markdown file."""
    with open(md_path, 'r') as f:
        content = f.read()
    return re.findall(r'^##\s+(.+)$', content, re.MULTILINE)


def update_hydrator():
    """Add new lazy imports to InteractiveHydrator.tsx."""
    with open(HYDRATOR_PATH, 'r') as f:
        content = f.read()

    # Find all existing component names in the hydrator
    existing = set(re.findall(r"(\w+):\s*lazy\(\(\)\s*=>\s*import\(", content))

    # Find all Walkthrough and Explorer component files
    new_entries = []
    for fname in sorted(os.listdir(COMPONENTS_DIR)):
        if fname.endswith('.tsx') and (fname.startswith('Walkthrough') or fname.startswith('Explorer')):
            name = fname.replace('.tsx', '')
            if name not in existing:
                new_entries.append(name)

    if not new_entries:
        print("No new hydrator entries to add.")
        return

    # Build the new import lines
    new_lines = []
    for name in new_entries:
        new_lines.append(f"  {name}: lazy(() => import('./{name}')),")

    # Insert before the closing "};" of the components object
    # Find the line with "};" that closes the components Record
    insert_text = "\n  // === Interactive Walkthroughs and Explorers ===\n"
    insert_text += "\n".join(new_lines) + "\n"

    # Find the position to insert - right before the closing "};"
    # The components object ends with "};\n\nfunction LoadingPlaceholder"
    insert_pos = content.find("};\n\nfunction LoadingPlaceholder")
    if insert_pos == -1:
        print("ERROR: Could not find insertion point in InteractiveHydrator.tsx")
        return

    new_content = content[:insert_pos] + insert_text + content[insert_pos:]

    with open(HYDRATOR_PATH, 'w') as f:
        f.write(new_content)

    print(f"Added {len(new_entries)} entries to InteractiveHydrator.tsx")


def update_registry():
    """Add Walkthrough and Explorer entries to existing registry entries."""
    with open(REGISTRY_PATH, 'r') as f:
        content = f.read()

    changes = 0

    for course_slug, prefix in COURSE_PREFIXES.items():
        course_dir = os.path.join(CONTENT_DIR, course_slug)
        if not os.path.exists(course_dir):
            continue

        for root, dirs, files in os.walk(course_dir):
            for fname in sorted(files):
                if not fname.endswith('.md'):
                    continue

                slug = fname.replace('.md', '')
                pascal_slug = slug_to_pascal(slug)
                composite_key = f'{course_slug}/{slug}'

                walkthrough_name = f'Walkthrough{prefix}{pascal_slug}'
                explorer_name = f'Explorer{prefix}{pascal_slug}'

                # Check if these component files exist
                if not os.path.exists(os.path.join(COMPONENTS_DIR, f'{walkthrough_name}.tsx')):
                    continue

                # Determine placement sections from the MD file
                md_path = os.path.join(root, fname)
                h2_sections = extract_h2_sections(md_path)

                has_how = 'How It Works' in h2_sections
                has_key = 'Key Technical Details' in h2_sections

                walk_section = 'How It Works' if has_how else (h2_sections[0] if h2_sections else 'How It Works')
                expl_section = 'Key Technical Details' if has_key else (h2_sections[1] if len(h2_sections) > 1 else 'Key Technical Details')

                # Check if entry already exists in registry
                if walkthrough_name in content:
                    continue

                # Find the existing entry for this composite key and add to it
                # Pattern: 'course-slug/concept-slug': [
                #   { component: 'Quiz...', ... },
                #   { component: 'Analogy...', ... },
                #   { component: 'Scale...', ... },
                # ],
                escaped_key = re.escape(composite_key)
                pattern = f"('{escaped_key}':\\s*\\[)"

                replacement = (
                    f"'{composite_key}': [\n"
                    f"    {{ component: '{walkthrough_name}', afterSection: '{walk_section}' }},\n"
                    f"    {{ component: '{explorer_name}', afterSection: '{expl_section}' }},"
                )

                new_content = re.sub(pattern, replacement, content, count=1)
                if new_content != content:
                    content = new_content
                    changes += 1

    with open(REGISTRY_PATH, 'w') as f:
        f.write(content)

    print(f"Updated {changes} registry entries")


if __name__ == '__main__':
    print("Updating InteractiveHydrator.tsx...")
    update_hydrator()
    print("\nUpdating interactive-registry.mjs...")
    update_registry()
    print("\nDone!")
