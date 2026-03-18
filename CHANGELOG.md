# Changelog

## [1.0.6]
### Added
- New automatic **Release** workflow in GitHub Actions that builds and publishes for `x64` and `arm64`.
- New **Tests** workflow with linting and Playwright smoke tests.
- `tests/` folder with startup (smoke) tests to ensure the app opens correctly.
- **ESLint** configuration to maintain code quality.
- Support for automatic publishing to the **Snap Store**.

### Changed
- **.gitignore**: Updated with more robust patterns for Electron, Node.js, and Snap.
- **package.json**: Added `lint` and `test` scripts, and prepared for multi-architecture.
- **renovate.json**: Configured to group dependency updates, auto-merge patches, and update GitHub Actions.
- **snap/snapcraft.yaml**: Improved for a more robust and synchronized build.

### Maintenance
- Implementation of Renovate for automatic dependency maintenance.
- GitHub secrets configuration for secure publishing.
