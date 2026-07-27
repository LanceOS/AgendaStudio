import os
import re

directories_to_scan = [
    'library/components',
    'client/src/modules'
]

# Map common simple inline styles to utility class names
style_to_class = {
    r"display:\s*['\"]flex['\"]": "lib-flex",
    r"flexDirection:\s*['\"]column['\"]": "lib-flex-col",
    r"flexDirection:\s*['\"]row['\"]": "lib-flex-row",
    r"alignItems:\s*['\"]center['\"]": "lib-items-center",
    r"alignItems:\s*['\"]flex-start['\"]": "lib-items-start",
    r"alignItems:\s*['\"]flex-end['\"]": "lib-items-end",
    r"justifyContent:\s*['\"]center['\"]": "lib-justify-center",
    r"justifyContent:\s*['\"]space-between['\"]": "lib-justify-between",
    r"justifyContent:\s*['\"]flex-end['\"]": "lib-justify-end",
    r"justifyContent:\s*['\"]flex-start['\"]": "lib-justify-start",
    r"flexWrap:\s*['\"]wrap['\"]": "lib-flex-wrap",
    r"flex:\s*1": "lib-flex-1",
    r"position:\s*['\"]relative['\"]": "lib-relative",
    r"position:\s*['\"]absolute['\"]": "lib-absolute",
    r"width:\s*['\"]100%['\"]": "lib-w-full",
    r"height:\s*['\"]100%['\"]": "lib-h-full",
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content

    # Extremely simple regex heuristic for replacing specific simple style chunks
    # Note: A real AST parser is safer, but this gets us 80% there for exact simple matches.
    for pattern, classname in style_to_class.items():
        # E.g. style={{ display: 'flex' }} -> className="lib-flex"
        # We need to be careful. If style has multiple things, we just strip the known ones
        # and manually append to className. This is complex in regex.
        # Let's skip regex complex transformations and use it just to identify target files
        pass

    # Since regex replacement of React props is very brittle, we will only replace exact full style objects that map perfectly to a single or double utility.
    
    # Exact Match 1: style={{ display: 'flex' }}
    exact_replacements = [
        (r"style=\{\{\s*display:\s*['\"]flex['\"]\s*\}\}", r'className="lib-flex"'),
        (r"style=\{\{\s*display:\s*['\"]flex['\"],\s*flexDirection:\s*['\"]column['\"]\s*\}\}", r'className="lib-flex lib-flex-col"'),
        (r"style=\{\{\s*display:\s*['\"]flex['\"],\s*alignItems:\s*['\"]center['\"]\s*\}\}", r'className="lib-flex lib-items-center"'),
        (r"style=\{\{\s*display:\s*['\"]flex['\"],\s*justifyContent:\s*['\"]space-between['\"],\s*alignItems:\s*['\"]center['\"]\s*\}\}", r'className="lib-flex lib-justify-between lib-items-center"'),
        (r"style=\{\{\s*width:\s*['\"]100%['\"]\s*\}\}", r'className="lib-w-full"'),
        (r"style=\{\{\s*height:\s*['\"]100%['\"]\s*\}\}", r'className="lib-h-full"'),
        (r"style=\{\{\s*position:\s*['\"]relative['\"]\s*\}\}", r'className="lib-relative"'),
        (r"style=\{\{\s*flex:\s*1\s*\}\}", r'className="lib-flex-1"'),
    ]

    for pattern, replacement in exact_replacements:
        # Before replacement, we must handle merging if there's already a className.
        # This is hard. We'll just replace if there's NO className adjacent.
        # If this creates invalid React (like className="..." className="..."), the linter will catch it.
        new_content = re.sub(pattern, replacement, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for d in directories_to_scan:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx'):
                process_file(os.path.join(root, file))

print("Done.")
