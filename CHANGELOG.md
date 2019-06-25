# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

# Moved to [github releases](https://github.com/chrisblossom/read-dir-deep/releases).

## [Unreleased]

## [6.0.0] - 2019-05-17

-   Breaking: Remove node 6 support

## [5.0.0] - 2019-04-22

### Changed

-   Breaking: remove default export and add named exports: `readDirDeep`, `readDirDeepSync`
-   Breaking: replace `readDirDeep.sync` with named export `readDirDeepSync`
-   Update packages

## [4.0.4] - 2019-04-22

### Fixed

-   (Typescript) Options now correctly extends Globby's Options

## [4.0.2] - 2019-01-15

### Fixed

-   Fix Typescript return type

## [4.0.1] - 2019-01-15

### Fixed

-   Change default pattern to `**`. Correctly throw `ENOTDIR` fix

## [4.0.0] - 2019-01-15

-   Migrate to Typescript
-   Breaking: Update [globby](https://github.com/sindresorhus/globby)

## [3.0.0] - 2019-01-07

### Changed

-   Breaking: Use [globby](https://github.com/sindresorhus/globby)

## [2.0.0] - 2019-01-05

### Changed

-   Breaking: Use [path-sort2](https://github.com/jamiebuilds/path-sort2) for sorting paths

## [1.0.6] - 2019-01-05

### Changed

-   Add `relative` option
-   Internal: replace async `for of` with `Promise.all(map)`
