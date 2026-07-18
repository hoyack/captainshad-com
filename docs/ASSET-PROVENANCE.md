# Asset Provenance — Wave C Imagery

Generated 2026-07-18 by Prometheus (Paperclip agent 015e788c) for HOY-208.

## Generation Environment

- **Host**: ComfyUI Docker container (comfyui-gpu:cu124)
- **Endpoint**: http://127.0.0.1:8188
- **GPU**: NVIDIA RTX (24 GB VRAM)
- **Model**: Juggernaut-XL_v9.safetensors (SDXL)
- **MCP Tool**: comfyui-mcp generate_image

## montgomeryhoyack.com

| Parameter | Value |
|-----------|-------|
| **Checkpoint** | Juggernaut-XL_v9.safetensors |
| **Seed** | random (MCP auto) |
| **Steps** | 30 |
| **Width × Height** | 1536 × 1024 |
| **Batch size** | 3 |
| **Selected image** | ComfyUI_00058_.png |
| **Prompt** | Abstract spare editorial atmosphere composition. Minimal, restrained, sophisticated. Dark muted background with subtle warm paper-like texture and faint geometric architectural lines suggesting structure and precision. Professional founder/consulting aesthetic — calm, authoritative, understated. No people, no faces, no text, no logos, no devices, no screens. Clean, elegant negative space. Color palette: deep charcoal #1a1a1c background, muted warm gray and subtle cream accents. Like a high-end editorial design studio backdrop. |
| **Negative prompt** | text, letters, words, labels, watermark, logo, people, humans, faces, headshots, portraits, photorealistic, cartoon, busy, chaotic, glowing, neon, devices, screens, laptops, phones, tech hardware, graphs, charts, numbers, typography, glyphs |
| **Outputs** | `assets/hero.webp` (23 KB), `assets/hero.png` (1.6 MB) |
| **Implementation** | CSS background on `.hero` section with 55% dark overlay via `::before` pseudo-element. Existing OG card preserved. |

### QA
- Vision-checked: abstract geometric planes, cream/charcoal palette, no people/faces/devices/text
- No fabricated portrait or headshot of Montgomery
- OG card unchanged

## captainshad.com

| Parameter | Value |
|-----------|-------|
| **Checkpoint** | Juggernaut-XL_v9.safetensors |
| **Seed** | random (MCP auto) |
| **Steps** | 30 |
| **Width × Height** | 1536 × 1024 |
| **Batch size** | 3 |
| **Selected image** | ComfyUI_00061_.png |
| **Prompt** | Abstract field-manual cartographic texture. Subtle topographic map-like contour lines and grid overlays suggesting navigation, terrain, and route planning. Muted olive-green and warm earth tones on a dark field-gray background. Sparse compass rose geometry, dashed trail markers, elevation contour intervals — all abstract and atmospheric, not literal. Military field-manual aesthetic blended with minimalist design. No text, no labels, no weapons, no people, no recognizable locations. Color palette: dark field-gray #1a1c1a background, muted olive #4a5d3e contour lines, warm parchment-brown accents. |
| **Negative prompt** | text, letters, words, labels, watermark, logo, people, humans, faces, photorealistic, cartoon, weapons, guns, violence, military insignia, flags, recognizable maps, countries, borders, typography, glyphs, digital screens, glowing |
| **Outputs** | `assets/hero.webp` (316 KB), `assets/hero.png` (2.8 MB) |
| **Implementation** | CSS `::before` overlay on `.home-hero` at 8% opacity over navy background. Existing decision-compass chart-card and OG card preserved. |

### QA
- Vision-checked: cracked-earth/topographic texture, olive/field-gray palette, no text/weapons/people
- No military insignia, no recognizable maps
- Existing chart-card decision loop UI preserved

## marijuanafactcheck.com

| Parameter | Value |
|-----------|-------|
| **Checkpoint** | Juggernaut-XL_v9.safetensors |
| **Seed** | random (MCP auto) |
| **Steps** | 30 |
| **Width × Height** | 1536 × 1024 |
| **Batch size** | 3 |
| **Selected image** | ComfyUI_00066_.png |
| **Prompt** | Abstract evidence-database research texture. Subtle grid of data points and citation markers on a dark scholarly background. Sparse connected reference nodes suggesting a knowledge graph or evidence network. Clinical, precise, academic — like a research methodology diagram rendered as minimalist abstract art. No cannabis imagery, no plant motifs, no medical theater, no glowing or psychedelic elements. Clean, restrained, institutional research aesthetic. Color palette: dark charcoal background, muted cool gray grid lines, subtle desaturated slate-blue accent dots. |
| **Negative prompt** | text, letters, words, labels, watermark, logo, people, humans, faces, cannabis, marijuana, leaves, plants, smoke, pipes, bongs, drugs, pills, syringes, medical equipment, stethoscopes, glowing, neon, psychedelic, green, typography, glyphs, photorealistic, cartoon |
| **Outputs** | `assets/hero.webp` (50 KB), `assets/hero.png` (1.8 MB) |
| **Implementation** | CSS `::before` overlay on `.hero` at 6% opacity over dark ink background. Existing evidence-grid SVG, OG card, and evidence scale panel preserved. |

### QA
- Vision-checked: plexus/network pattern, dark scholarly palette, no cannabis/medical imagery
- No text, no plant motifs, no green/psychedelic elements
- Evidence scale panel, claim grid, and disclaimer preserved

## Compliance

- [x] Original ComfyUI/local generation — no stock photos, no AI APIs
- [x] Workflow, checkpoint, seed, and prompts recorded
- [x] No fake people, no fabricated headshots (montgomeryhoyack)
- [x] No cannabis glamour/medical theater (marijuanafactcheck)
- [x] No weapons/military insignia (captainshad)
- [x] No text-in-image across all three
- [x] WebP optimized with PNG fallback
- [x] Existing OG cards preserved on all three sites
- [x] All existing UI elements (evidence scale, chart-card, principles panel) preserved
- [x] Subtle CSS background implementation — hero content remains primary
