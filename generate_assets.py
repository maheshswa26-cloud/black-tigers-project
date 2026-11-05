import os

assets_dir = r"C:\Users\Ramayya\.gemini\antigravity\scratch\vizag-go\public\assets"
os.makedirs(assets_dir, exist_ok=True)

svg_templates = {
    "garbage.svg": ("#16191f", "#22c55e", "🗑️", "♻️", "OVERFLOWING GARBAGE", "MVP Colony Sector 4"),
    "fallen-tree.svg": ("#14191c", "#ca8a04", "🌲", "⚠️", "FALLEN TREE", "Beach Road near RK Beach"),
    "pipe-leak.svg": ("#0c1a24", "#0ea5e9", "💧", "🚰", "BROKEN WATER PIPE", "Siripuram Junction"),
    "streetlight.svg": ("#090d16", "#f59e0b", "💡", "❌", "STREETLIGHT OUTAGE", "Kancharapalem Main Road"),
    "dead-animal.svg": ("#1c1616", "#ef4444", "🐕", "⚠️", "DEAD ANIMAL HAZARD", "Highway NH16 Gajuwaka"),
    "drain.svg": ("#131c19", "#10b981", "🌊", "🚫", "BLOCKED DRAIN CULVERT", "Gajuwaka Market Road"),
    "manhole.svg": ("#18151f", "#ef4444", "🕳️", "⚠️", "MISSING MANHOLE COVER", "Maddilapalem Bus Stand"),
    "illegal-dump.svg": ("#1c1917", "#f97316", "🚯", "🛑", "ILLEGAL DUMPING", "Rushikonda IT Hill Road"),
    "signal.svg": ("#11161d", "#f59e0b", "🚦", "⚠️", "BROKEN PEDESTRIAN SIGNAL", "Jagadamba Junction"),
    "hazard-generic.svg": ("#181a20", "#00ff87", "⚡", "📍", "CIVIC HAZARD", "Visakhapatnam Civic Radar")
}

for filename, (bg, accent, emoji, badge_emoji, title, location) in svg_templates.items():
    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
  <rect width="400" height="240" fill="{bg}"/>
  <circle cx="200" cy="130" r="70" fill="{accent}" fill-opacity="0.12" stroke="{accent}" stroke-width="2" stroke-dasharray="6,4"/>
  <circle cx="200" cy="130" r="45" fill="{accent}" fill-opacity="0.2"/>
  <text x="200" y="145" font-family="sans-serif" font-size="44" text-anchor="middle">{emoji}</text>
  <circle cx="50" cy="45" r="22" fill="{accent}" fill-opacity="0.2" stroke="{accent}" stroke-width="2"/>
  <text x="50" y="52" font-family="sans-serif" font-size="20" text-anchor="middle">{badge_emoji}</text>
  <text x="85" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff">{title}</text>
  <text x="85" y="62" font-family="sans-serif" font-size="11" fill="#94a3b8">{location}</text>
</svg>"""
    with open(os.path.join(assets_dir, filename), "w", encoding="utf-8") as f:
        f.write(svg_content.strip())

print(f"Generated {len(svg_templates)} SVG hazard images.")
