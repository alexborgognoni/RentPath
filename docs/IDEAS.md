# Cool overengineering ideas

## Git Hooks

Pre-commit

- lint-staged ✓ (you have this) - Run linters only on staged files
- prettier ✓ (you have this) - Code formatting
- secretlint / gitleaks - Prevent committing secrets/API keys
- php-cs-fixer / pint ✓ (you have this) - PHP formatting
- talisman - Scans for sensitive data patterns

Commit-msg

- commitlint ✓ (just added) - Enforce commit message format
- commitizen - Interactive commit message prompts (git cz instead of git commit)

Pre-push

- Run full test suite before pushing
- Block pushes to main/master directly
- Require branch naming conventions (e.g., feat/_, fix/_)

Post-merge / Post-checkout

- Auto-run composer install / npm install when lock files change
- Auto-run migrations when new ones are detected
- Notify if .env.example changed (new env vars needed)

## CI/Quality Tools

Static Analysis

- PHPStan / Larastan (level 0-9) - PHP static analysis, catches bugs before runtime
- Psalm - Alternative to PHPStan, very thorough
- TypeScript strict mode - You're using tsgo already

Code Quality

- SonarQube / SonarCloud - Code smells, duplication, security hotspots
- Codeclimate - Maintainability scores
- Rector - Automated PHP refactoring and upgrades

Testing

- Pest ✓ (you have this) - But consider coverage thresholds
- mutation testing (Infection for PHP) - Tests your tests
- Playwright / Cypress - E2E testing

Security

- npm audit / composer audit - Dependency vulnerabilities
- Snyk - Continuous vulnerability monitoring
- OWASP dependency-check - More thorough than audit

Documentation

- typedoc - Auto-generate TS docs
- PHPDoc checks - Ensure docblocks exist
- API schema validation - OpenAPI/Swagger compliance

## Developer Experience

Editor Integration

- EditorConfig - Consistent settings across editors
- .nvmrc / .php-version - Pin runtime versions
- Codeium / Copilot - AI autocomplete

Git Workflow

- gh-actions for PR checks - Require all checks pass
- auto-assign reviewers - Based on CODEOWNERS
- semantic-release - Auto-versioning from commits (pairs with commitlint)
- danger.js - Automated PR review comments (e.g., "PR too large", "missing tests")
- git-absorb - Auto-fixup commits to the right place

Automation

- Renovate / Dependabot - Auto-update dependencies
- auto-changelog - Generate CHANGELOG from conventional commits
- Husky + mrm - Manage configs across projects

Quick Wins for Your Stack

Given the Laravel + React setup, I'd prioritize:

1. Larastan (level 5+) - Catches so many PHP bugs
2. gitleaks pre-commit - You're on AWS, secrets matter
3. Post-checkout hook to auto-install deps
4. semantic-release - Pairs perfectly with commitlint you just added
