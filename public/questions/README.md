# Illinois DMV Question Images

This directory contains images used in the Illinois DMV test questions.

## Directory Structure

```
public/questions/
├── signs/          # Traffic sign images (SVG format)
├── scenarios/      # Road scenario diagrams
└── README.md       # This file
```

## Sign Images

Traffic sign images should be in SVG format for scalability. Naming convention:
- `stop-sign.svg`
- `yield-sign.svg`
- `speed-limit-sign.svg`
- `school-zone-sign.svg`
- `railroad-advance-sign.svg`
- etc.

## Scenario Images

Road scenario diagrams should illustrate:
- Right-of-way situations
- Lane positioning
- Turning scenarios
- Blind spot zones
- Parking on hills
- etc.

## Image Specifications

- **Format**: SVG (preferred) or PNG
- **Size**: 400x300px minimum for scenarios
- **Style**: Consistent with Illinois DMV manual illustrations
- **Colors**: Follow standard traffic sign colors

## Adding New Images

1. Create SVG/PNG file
2. Add to appropriate subdirectory
3. Update question data with `image_url` path
4. Run validation to ensure all referenced images exist
