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

- clean up invalid transactions
- investigate timestamp off by a day issue
- fix empty state - no expense or income
- add ability to sort expenses, income and retirement on profile page
- create favicon / logo
  - https://logo.utities.online/
- reporting enhancements
  - investment level reporting
  - account level reporting
- add global error page
- authentication
  - add auto logout and token refresh
- project cleanup
  - configure linter
  - configure husky
  - add tests for server actions and utility functions
- Update UI to support mobile devices
- Add PWA support
- upgrade to Nextjs 16
- enable React compiler
