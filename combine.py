import base64

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('background.base64', 'r') as f:
    bg_b64 = f.read().strip()

with open('icon.base64', 'r') as f:
    icon_b64 = f.read().strip()

# Add background style
bg_style = f"""
    body {{
        background-color: #101622;
        background-image: linear-gradient(rgba(16, 22, 34, 0.8), rgba(16, 22, 34, 0.8)), url('data:image/png;base64,{bg_b64}');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
    }}
"""

# Insert style before </style>
html = html.replace('</style>', bg_style + '\n    </style>')

# Replace the icon in the button
# The target is the span with touch_app
icon_html = f'<img src="data:image/png;base64,{icon_b64}" class="w-16 h-16 mb-2 drop-shadow-md" alt="Bad Ride Icon">'
html = html.replace('<span class="material-symbols-outlined text-white text-[48px] mb-2 drop-shadow-md">touch_app</span>', icon_html)

with open('final_index.html', 'w', encoding='utf-8') as f:
    f.write(html)
