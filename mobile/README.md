# Mobile React Native Boilerplate

A modern, scalable React Native boilerplate with TypeScript, Atomic Design,
environment-based native builds, React Navigation, React Query, Zustand-style
global stores, Storybook, and pre-commit quality checks.

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Development Workflow](#development-workflow)
- [Pre-commit Checks](#pre-commit-checks)
- [Architectural Guidelines](#architectural-guidelines)
- [Code Quality Standards](#code-quality-standards)
- [Troubleshooting](#troubleshooting)

## Project Structure

```text
boilerplate-mobile-reactnative/
├── android/                    # Android native project
├── ios/                        # iOS native project
├── env/                        # Environment files, ignored by default
│   ├── .env.example            # Environment template
│   ├── dev.env                 # Development variables
│   ├── stg.env                 # Staging variables
│   ├── test.env                # Test variables
│   └── prod.env                # Production variables
├── scripts/
│   └── validate-atomic-structure.js
├── src/
│   ├── app/                    # Application shell and feature code
│   │   ├── components/         # App-level reusable components
│   │   ├── core/               # Navigation, HTTP, errors, providers
│   │   ├── data/               # Datasources, DTOs, HTTP clients
│   │   ├── domain/             # Use cases and business workflows
│   │   ├── model/              # App models and constants
│   │   ├── modules/            # Screen modules grouped by feature
│   │   ├── navigation/         # Root, tab, and stack navigation setup
│   │   ├── store/              # Global stores
│   │   └── utils/              # App utilities and hooks
│   ├── atomic/                 # Atomic Design component library
│   │   ├── atm.*/              # Atoms: base UI primitives
│   │   ├── mol.*/              # Molecules: composed components
│   │   ├── obj.*/              # Organisms: larger UI blocks
│   │   ├── org.*/              # Page organisms and full sections
│   │   └── pag.*/              # Sample/demo pages
│   ├── assets/                 # Fonts, images, and icons
│   ├── stories/                # Storybook stories
│   └── app.tsx                 # Root app providers and navigator
├── __tests__/                  # Jest tests
├── .eslintrc.js                # ESLint configuration
├── .prettierrc.js              # Prettier configuration
├── babel.config.js             # Babel and path aliases
├── jest.config.js              # Jest configuration
├── metro.config.js             # Metro bundler configuration
├── package.json                # Scripts and dependencies
└── tsconfig.json               # TypeScript configuration
```

## Tech Stack

**Mobile Framework**

- React Native 0.80.0
- React 19.1.0
- TypeScript 5.8
- New Architecture-ready native projects

**Navigation and App Shell**

- React Navigation 7
- Native Stack and Bottom Tabs
- React Native Screens
- React Native Safe Area Context
- React Native Gesture Handler
- React Native Reanimated

**State Management and Data Fetching**

- React Query 5 for server state
- Store providers under `src/app/core/global-store.service.tsx`
- Axios for HTTP requests
- TypeDI for dependency injection
- React Native Config for environment variables

**UI and Styling**

- Atomic Design component structure
- Styled Components
- React Native SVG
- React Native Heroicons
- Bottom sheets and portals
- Flash message overlay pattern

**Native Capabilities Included**

- Keychain secure storage
- Async storage
- Image picker
- Geolocation
- Maps and Google Places
- Stripe payments
- AWS S3 upload helpers
- Push notification support through Notifee

**Development Tools**

- ESLint 8 with React Native, React Hooks, TypeScript, import, and Prettier rules
- Prettier 2.8
- Jest 29
- Storybook React Native 9
- Husky 9
- lint-staged 16

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Ruby and Bundler for iOS dependencies
- Xcode for iOS development
- Android Studio for Android development
- CocoaPods
- A completed React Native environment setup:
  <https://reactnative.dev/docs/set-up-your-environment>

### Installation

1. Clone the repository.

   ```bash
   git clone <repository-url>
   cd boilerplate-mobile-reactnative
   ```

2. Install JavaScript dependencies.

   ```bash
   npm install
   ```

3. Install Husky hooks.

   ```bash
   npm run prepare
   ```

4. Install iOS dependencies.

   ```bash
   bundle install
   cd ios
   bundle exec pod install
   cd ..
   ```

5. Create environment files.

   ```bash
   cp env/.env.example env/dev.env
   cp env/.env.example env/stg.env
   cp env/.env.example env/prod.env
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item env/.env.example env/dev.env
   Copy-Item env/.env.example env/stg.env
   Copy-Item env/.env.example env/prod.env
   ```

### Environment Variables

The app reads environment-specific values through `react-native-config`.

```env
BASE_URL=http://127.0.0.1:8080
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GOOGLE_MAP_URL=https://maps.googleapis.com/maps/api
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
AWS_REGION=ap-southeast-2
AWS_S3_BUCKET=your_s3_bucket_name_here
```

Never commit real keys. Keep committed examples limited to safe placeholders.

### Running the Application

Start Metro:

```bash
npm start
```

Run Android:

```bash
npm run android:dev
```

Run iOS:

```bash
npm run ios:dev
```

Environment-specific commands are available for development, staging, and
production.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm start` | Start Metro bundler |
| `npm run android` | Run Android with default React Native command |
| `npm run ios` | Run iOS with default React Native command |
| `npm run android:dev` | Run Android using `env/dev.env` |
| `npm run android:staging` | Run Android staging variant |
| `npm run android:prod` | Run Android release variant |
| `npm run ios:dev` | Run iOS using `env/dev.env` |
| `npm run ios:staging` | Run iOS staging configuration |
| `npm run ios:prod` | Run iOS release configuration |
| `npm run build:android:debug` | Build Android debug APK |
| `npm run build:android:release` | Build Android release APK |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format source files with Prettier |
| `npm run format:check` | Check formatting |
| `npm run type-check` | Run TypeScript checks |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run Jest in watch mode |
| `npm run test:coverage` | Generate test coverage |
| `npm run storybook-generate` | Generate React Native Storybook imports |
| `npm run validate:atomic` | Validate atomic folder names |
| `npm run prepare` | Install Husky Git hooks |

## Development Workflow

1. Create or update screens under `src/app/modules/<feature>`.
2. Put business workflows in `src/app/domain/<feature>/*.use-case.ts`.
3. Put API, local storage, and native datasource code under `src/app/data`.
4. Keep shared UI in `src/atomic` using the atomic hierarchy.
5. Add app-level reusable components under `src/app/components` when they are
   coupled to the application shell or feature language.
6. Add tests under `__tests__` or a colocated test structure if the project
   adopts one.
7. Run the local checks before committing.

```bash
npm run validate:atomic
npm run lint:fix
npm run format
npm run type-check
npm test
```

For native changes, also run the relevant platform build.

## Pre-commit Checks

Husky runs a staged quality gate before each commit.

### [0/5] Atomic Folder Structure Validation

Command:

```bash
npm run validate:atomic
```

Accepted prefixes under `src/atomic/`:

- `atm.*` for atoms
- `mol.*` for molecules
- `obj.*` for organisms
- `org.*` for page organisms
- `pag.*` for sample/demo pages

Prefer `org.*` for new production page-level sections.

### [1/5] ESLint + Prettier on Staged Files

Command:

```bash
npx lint-staged
```

TypeScript, TSX, JavaScript, and JSX files are linted and formatted. JSON and
Markdown files are formatted.

### [2/5] TypeScript Type Checking

Command:

```bash
npm run type-check
```

Checks type safety across the project without emitting build output.

### [3/5] Unit Tests

Command:

```bash
npm test -- --passWithNoTests
```

Runs Jest tests and allows early boilerplate commits before tests exist.

### [4/5] Android Debug Build

Command:

```bash
npm run build:android:debug
```

Verifies that the Android native project still compiles.

### [5/5] Commit Success

If all checks pass, the commit proceeds.

To bypass hooks in an emergency:

```bash
git commit --no-verify
```

Use this sparingly; it skips every quality gate.

## Architectural Guidelines

### Atomic Design Structure

Atomic imports should move from smaller building blocks to larger compositions.

```text
Atoms (atm.*)
  -> Molecules (mol.*)
  -> Organisms (obj.*)
  -> Page Organisms (org.*)
```

Rules:

- Atoms should only depend on atoms or platform primitives.
- Molecules may depend on atoms and other molecules.
- Organisms may depend on atoms, molecules, and other organisms.
- Page organisms may compose any atomic tier.
- Cross-atomic imports should use each folder's `index.ts` barrel.

Example:

```ts
import { Button } from "@atomic/atm.button";
```

Avoid importing another component's internal implementation file from outside
that component folder.

### Data Flow

```text
Screen or component
  -> use case (*.use-case.ts)
  -> datasource, query, or mutation
  -> HTTP client, local storage, native API, or backend
```

Rules:

- Screens should call use cases, not raw datasources.
- Use cases own business workflows and request orchestration.
- Datasources own HTTP, storage, and native integration details.
- Models and DTOs should stay explicit and close to their layer.

### Naming Conventions

- Components: `name.component.tsx`
- Styles: `name.component.style.tsx` or `name.style.ts`
- Pages: `feature.page.tsx`
- Navigation files: `feature.navigation.tsx`
- Use cases: `action.use-case.ts`
- Mutations: `action.mutation.ts`
- Queries: `action.query.ts`
- Datasources: `entity.datasource.ts`
- DTOs: `entity.dto.ts`
- Models: `entity.model.ts`
- Hooks: `use-name.hook.ts` or `use-name.hook.tsx`
- Stories: `name.stories.tsx`

## Code Quality Standards

### ESLint Rules

- Prefer `const` and `let`.
- Avoid `console` in production code.
- Use React Hooks rules.
- Avoid unstable nested React components.
- Avoid redundant ternaries and unsafe optional chaining.
- Prefer optional chaining where it improves clarity.
- Keep Storybook files free to log when helpful.

### TypeScript Standards

- Strict mode is enabled.
- Decorators are enabled for TypeDI patterns.
- Path aliases are configured for `@app`, `@atomic`, and `@assets`.
- Type checks run with `tsc --noEmit`.

### Formatting

- Prettier is the source of truth for formatting.
- Run `npm run format` before broad commits.
- Staged files are formatted automatically by lint-staged.

### Testing

- Jest is configured for React Native.
- Tests should cover use cases, data mappers, validators, and high-risk UI
  behavior.
- Use `npm run test:coverage` for coverage reports.

## Customizing the Boilerplate

When starting a new product from this boilerplate:

1. Update `package.json` name and metadata.
2. Update `app.json` display name.
3. Rename Android package IDs and iOS bundle identifiers.
4. Replace app icons and splash assets.
5. Replace example environment values.
6. Remove sample modules that are not needed.
7. Keep the architecture and scripts intact unless the new app has a clear
   reason to diverge.

## Troubleshooting

### Environment Variables Not Loading

- Confirm the selected `env/*.env` file exists.
- Restart Metro with a clean cache.

```bash
npm start -- --reset-cache
```

- Rebuild the native app after changing native-facing env variables.

### iOS Pods Fail

```bash
cd ios
bundle exec pod install
cd ..
```

If needed, clean derived data from Xcode and rebuild.

### Android Build Fails

```bash
cd android
gradlew clean
cd ..
npm run android:dev
```

On macOS or Linux, use `./gradlew clean` inside the `android` directory.

### Atomic Validation Fails

Rename folders under `src/atomic` to one of the supported prefixes:

```text
atm.button
mol.password-field
obj.form
org.page-container
pag.form-sample
```

### TypeScript Fails During Commit

```bash
npm run type-check
```

Fix the reported errors, stage the files again, and retry the commit.

## Resources

- React Native: <https://reactnative.dev>
- React Navigation: <https://reactnavigation.org>
- React Query: <https://tanstack.com/query>
- Styled Components: <https://styled-components.com>
- TypeScript: <https://www.typescriptlang.org/docs>
- Atomic Design: <https://bradfrost.com/blog/post/atomic-web-design/>
- Storybook React Native: <https://storybook.js.org/docs/get-started/frameworks/react-native>

## License

This project is private and proprietary unless your organization chooses a
different license.
