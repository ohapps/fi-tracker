# Requirements

## Features

- ability to track various types of investments
  - description
  - investment type (used to report portfolio value by type)
    - stocks
    - bonds
    - mutual funds
    - real estate
    - savings account
    - CD
    - other
  - classification
    - investment
    - retirement
    - cash reserve
  - cost basis
  - current debt
  - current value
  - transactions
  - investment metrics
- group investments by accounts
  - enter a description
- create a profile
  - enter target retirement withdraw rate
  - enter monthly expenses
- review portfolio
  - calculate portfolio value
  - calculate portfolio equity (total assets - total debt)
  - calculate cash reserves
  - calculate months of expenses in cash reserves
  - passive income per month filtered by investment
  - dispaly a status fi-status tracker
    - https://www.getrichslowly.org/stages-of-financial-freedom/
  - pre retirement income list
  - post retirement income list
  - combined total

## improvements from previous version

- make it easier to enter updates for each investment
- better UI and charts
- fi status tracker
  - 1. income covers current expenses and $1,000 emergency fund
  - 2. six months of expenses in the bank
  - 3. investments cover loss of primary income stream
  - 4. retirement income replaces salary
  - 5. investment income covers all salary
- ability to enter detailed expenses
- ability to create scenarios and see how it impacts fi status
- metrics on an account level
- metrics on an investment level

## Tech Stack

- Nextjs
- MongoDB
- Auth0
- Tailwind
- Shadcn
- Zod
- React Hook Form
- PWA / Offline

## Transactions and calculations

- account types - classification

  - investment - used for tracking pre retirement passive income
  - retirement - used to tracking retirement income with focus on draw down
  - cash reserve - used to track emergency reserve funds

- investment types - this is only used for reporting purposes to show asset allocation by type

  - stocks
  - bonds
  - mutual fund
  - real estate
  - savings account
  - cd
  - other

- transaction types
  - gain
    - used to measure positive income
    - no impact to investment metrics
    - example: rental operating gain
  - loss
    - used to measure negative income
    - no impact to investment metrics
    - example: rental operating loss
  - value change
    - increase/decrease in asset value
  - cost basis change
    - increase/decrease in cost basis
  - debt change
    - increase/decrease in debt
