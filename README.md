# express-api-rest-gen
[![npm version](https://img.shields.io/npm/v/express-api-rest-gen.svg)](https://www.npmjs.com/package/express-api-rest-gen)
[![npm downloads](https://img.shields.io/npm/dm/express-api-rest-gen.svg)](https://www.npmjs.com/package/express-api-rest-gen)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Last Commit](https://img.shields.io/github/last-commit/rubsuadav/express-api-rest-gen.svg)](https://github.com/rubsuadav/express-api-rest-gen/commits)

> 🚀 A minimal and powerful CLI tool to generate a production-ready REST API with Express.js (JavaScript or TypeScript)

## ✨ Features
- ⚡ **Zero-configuration** - Interactive CLI setup
- 🔧 **Flexible** - Choose between JavaScript or TypeScript
- 📦 **Production-ready** - Best practices included
- 🎯 **Fast** - Generate your API in seconds
- 📝 **Well-structured** - Clean project structure
- 🛠️ **Extensible** - Easy to customize after generation

## 📋 Table of Contents
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

<a id="installation"></a>
## 📦 Installation

### Global Installation
```sh
npm i -g express-api-rest-gen
```

**Requirements:**
- Node.js 22.0.0 or higher
- npm 10.0.0 or higher

<a id="quick-start"></a>
## 🚀 Quick Start

1. Navigate to your desired directory

2. Run the CLI generator:
```sh
express-api-rest-gen
```
alternatively, you can use npx:

```sh
npx express-api-rest-gen
```

3. Follow the interactive prompts:
   - **Project name** - Your API project name
   - **Language** - Choose between JavaScript or TypeScript
   - **Database** - Select a database (MongoDB, PostgreSQL or MySQL)
   - **Testing** - Optionally include testing setup (Jest)

4. Start coding:
```sh
cd your-project-name
npm start
```

<a id="project-structure"></a>
## 📁 Project Structure
```
your-project-name/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
|   |── tests/
|   |── utils/ # Optional utility functions
|   |── validators/ # Optional validation logic
|   |── index.js (or index.ts) # Entry point
│   └── app.js (or app.ts) # Express app setup
├── .env
├── database.js (or database.ts) # Database connection setup
├── jest.config.js (if Testing selected)
├── package.json
├── package.lock.json
└── tsconfig.json (if TypeScript selected)
```

<a id="contributing"></a>
## 🤝 Contributing
Contributions are welcome! Please feel free to:

- Report bugs and request features via [GitHub Issues](https://github.com/rubsuadav/express-api-rest-gen/issues)
- Submit pull requests with improvements
- Improve documentation

### Development
```sh
git clone https://github.com/rubsuadav/express-api-rest-gen.git
cd express-api-rest-gen
npm i
```

<a id="license"></a>
## 📄 License
This project is licensed under the ISC License - see the LICENSE file for details.
