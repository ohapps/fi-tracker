# fi-tracker

## Getting Started

Copy the .env.sample file to .env and fill in the values.

Install dependencies:

```bash
yarn install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tasks

- basic functionality
  - add ability to sort transactions
  - reporting enhancements
    - investment level reporting
      - current value + cost basis + debt chart for last 12 months
      - cash flow chart for last 12 months
    - account level reporting
- project cleanup
  - add global error page
  - authentication
    - add auto logout and token refresh
  - configure linter
  - configure husky
  - add tests for server actions and utility functions
  - add gitlab pipelines to run tests and lint
  - add AI MR reviews - https://www.coderabbit.ai/
- enhancements
  - upgrade to Nextjs 16
  - enable React compiler
  - Update UI to support mobile devices
  - Add PWA support
  - add AI analysis
