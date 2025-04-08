# KU Core Library

A design token management system that converts CSV token definitions into various platform-specific formats.

## Structure

```
ku-core-library/
├── tokens/             # Token definitions
│   └── csv/           # CSV source files
├── config/            # Configuration files
├── stories/          # Storybook documentation
├── dist/             # Generated files
└── scripts/          # Build scripts
```

## Token Categories

- Colors
- Typography
- Spacing
- Size
- Radius
- Opacity
- Breakpoints
- Animation
- Border
- Grid
- Shadow
- Z-index

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Add CSV token files to `tokens/csv/`

3. Run the build:
```bash
npm run build
```

4. View the documentation:
```bash
npm run storybook
```

## Development

- `npm run watch` - Watch for CSV changes
- `npm run build` - Build all tokens
- `npm run storybook` - Run Storybook documentation
- `npm run build-storybook` - Build static Storybook

## CSV Format

Each CSV file should follow this structure:
- token: Token name/path
- value: Token value
- category: Token category
- type: Token type
- description: Token description
- usage: Usage examples

## Output Formats

- CSS Custom Properties
- SCSS Variables
- TypeScript Types
- JavaScript Modules
- JSON

## Contributing

1. Add or modify CSV files in `tokens/csv/`
2. Run tests and build
3. Submit a pull request

## License

ISC 