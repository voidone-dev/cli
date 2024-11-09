# VoidOne CLI

[![npm version](https://img.shields.io/npm/v/voidone.svg)](https://www.npmjs.com/package/voidone)
[![Downloads](https://img.shields.io/npm/dm/voidone.svg)](https://www.npmjs.com/package/voidone)
[![License](https://img.shields.io/npm/l/voidone.svg)](https://github.com/voidone/cli/blob/main/LICENSE)

The easiest way to deploy production-ready websites to the [VoidOne](https://voidone.dev) platform.

See our [documentation](https://voidone.dev/docs) to get started with the VoidOne platform.

## Table of Contents

<details>
<summary>Click to expand</summary>

- [Installation](#installation)
- [Usage](#usage)
- [CLI Reference](#cli-reference)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

</details>

## Installation

VoidOne CLI requires [Node.js](https://nodejs.org) version 18.0.0 or above. Install it globally with:

```bash
npm install -g voidone
```

For local project installation:

```bash
npm install --save-dev voidone
```

## Usage

Once installed, you can use the `voidone` command or run it through `npx`:

```bash
voidone [command]

# or using npx
npx voidone [command]

# Get help
voidone help
```

## CLI Reference

### Deploy a website
Deploy your application to VoidOne:

```bash
npx voidone deploy
```

### Authenticate with VoidOne
Log in to your VoidOne account:

```bash
npx voidone login
```

### Link a project
Connect your local directory to a VoidOne app:

```bash
npx voidone link
```

### Reset configuration
Logout and remove local project configuration:

```bash
npx voidone reset
```

## Documentation

For comprehensive documentation and guides, visit:
- [VoidOne Platform](https://voidone.dev/)
- [CLI Documentation](https://voidone.dev/docs)

## License

MIT. See [LICENSE](LICENSE) for more details.