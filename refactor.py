import os
import re

directories_to_scan = [
    'client/src',
    'library/components'
]

replacements = [
    # Colors (Old tokens to new)
    (r'var\(--color-text-secondary, var\(--text\)\)', r'var(--color-text-secondary)'),
    (r'var\(--color-text-primary, var\(--text-h\)\)', r'var(--color-text-primary)'),
    (r'var\(--color-surface-code, var\(--code-bg\)\)', r'var(--color-surface-code)'),
    (r'var\(--text-h\)', r'var(--color-text-primary)'),
    (r'var\(--text\)', r'var(--color-text-secondary)'),
    (r'var\(--border\)', r'var(--color-border-default)'),
    (r'var\(--bg\)', r'var(--color-surface-app)'),

    # Spacing
    (r"'4px'", r"'var(--space-1)'"),
    (r"'8px'", r"'var(--space-2)'"),
    (r"'12px'", r"'var(--space-3)'"),
    (r"'16px'", r"'var(--space-4)'"),
    (r"'20px'", r"'var(--space-5)'"),
    (r"'24px'", r"'var(--space-6)'"),
    (r"'32px'", r"'var(--space-8)'"),
    
    (r'"4px"', r'"var(--space-1)"'),
    (r'"8px"', r'"var(--space-2)"'),
    (r'"12px"', r'"var(--space-3)"'),
    (r'"16px"', r'"var(--space-4)"'),
    (r'"20px"', r'"var(--space-5)"'),
    (r'"24px"', r'"var(--space-6)"'),
    (r'"32px"', r'"var(--space-8)"'),

    # Typography
    (r"fontSize:\s*'11px'", r"fontSize: 'var(--font-size-xs)'"),
    (r"fontSize:\s*'12px'", r"fontSize: 'var(--font-size-sm)'"),
    (r"fontSize:\s*'13px'", r"fontSize: 'var(--font-size-base)'"),
    (r"fontSize:\s*'14px'", r"fontSize: 'var(--font-size-md)'"),
    (r"fontSize:\s*'15px'", r"fontSize: 'var(--font-size-md)'"),
    (r"fontSize:\s*'16px'", r"fontSize: 'var(--font-size-lg)'"),
    (r"fontSize:\s*'18px'", r"fontSize: 'var(--font-size-xl)'"),
    (r"fontSize:\s*'20px'", r"fontSize: 'var(--font-size-2xl)'"),
    (r"fontSize:\s*'24px'", r"fontSize: 'var(--font-size-3xl)'"),
    
    (r'fontSize:\s*"11px"', r'fontSize: "var(--font-size-xs)"'),
    (r'fontSize:\s*"12px"', r'fontSize: "var(--font-size-sm)"'),
    (r'fontSize:\s*"13px"', r'fontSize: "var(--font-size-base)"'),
    (r'fontSize:\s*"14px"', r'fontSize: "var(--font-size-md)"'),
    (r'fontSize:\s*"15px"', r'fontSize: "var(--font-size-md)"'),
    (r'fontSize:\s*"16px"', r'fontSize: "var(--font-size-lg)"'),
    (r'fontSize:\s*"18px"', r'fontSize: "var(--font-size-xl)"'),
    (r'fontSize:\s*"20px"', r'fontSize: "var(--font-size-2xl)"'),
    (r'fontSize:\s*"24px"', r'fontSize: "var(--font-size-3xl)"'),

    # Edge cases like multi-value padding
    (r"'8px 0'", r"'var(--space-2) 0'"),
    (r"'0 8px'", r"'0 var(--space-2)'"),
    (r"'12px 16px'", r"'var(--space-3) var(--space-4)'"),
    (r"'16px 24px'", r"'var(--space-4) var(--space-6)'"),
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for d in directories_to_scan:
    for root, _, files in os.walk(d):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts') or file.endswith('.css'):
                process_file(os.path.join(root, file))

print("Done.")
