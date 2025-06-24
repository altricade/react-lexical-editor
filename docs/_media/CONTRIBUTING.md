# Contributing to React Lexical Editor

Thank you for your interest in contributing to React Lexical Editor! This document outlines the process for contributing to this project.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct, which is to treat everyone with respect and create a positive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with the following information:

- Clear title and description
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (browser, OS, etc.)

### Feature Requests

We welcome feature requests! Please provide:

- Clear description of the feature
- Rationale for adding this feature
- Any implementation ideas you have

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linting (`npm run lint`)
6. Commit with clear messages following [conventional commits](https://www.conventionalcommits.org/)
7. Push to your branch
8. Open a Pull Request

### Development Setup

```bash
# Clone the repo
git clone https://github.com/altricade/react-lexical-editor.git
cd react-lexical-editor

# Install dependencies
npm install

# Start development
npm run dev

# Run the playground
npm run playground
```

## Testing

Please ensure all tests pass before submitting a pull request:

```bash
npm test
```

Add new tests for new features or bug fixes.

## Code Style

We use ESLint and Prettier to maintain code quality:

```bash
# Run linting
npm run lint

# Format code
npm run format
```

## Documentation

Documentation is crucial for this project. Please update the README.md or other documentation files when making changes that affect the public API.

## Review Process

All submissions require review. We use GitHub pull requests for this purpose. Your PR will be reviewed by maintainers, and you might be asked to make changes before it's merged.

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
