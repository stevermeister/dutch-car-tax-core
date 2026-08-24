# dutch-car-tax-core

Dutch motorrijtuigenbelasting (MRB / road tax) calculation logic and tariff
data: the 2026 provincial tariff grid, fuel-type rate multipliers, the
oldtimer (classic car) exemption rule, and the `calculatePrice` function that
ties them together.

This package has no runtime dependencies and no framework assumptions — it's
plain TypeScript compiled to CommonJS, shared between:

- [car.thetax.nl](https://github.com/stevermeister/dutch-car-tax) — the
  Angular web calculator
- the Dutch car tax MCP server (RDW + tax lookups as MCP tools)

## Install

This isn't published to npm — install it as a git dependency:

```bash
npm install github:stevermeister/dutch-car-tax-core
```

Pin to a tag or commit for anything beyond local experimentation:

```bash
npm install github:stevermeister/dutch-car-tax-core#v0.1.0
```

## Usage

```ts
import { calculatePrice, GRID, isOldtimerExempt, FormValue } from 'dutch-car-tax-core';

const value: FormValue = { provinceKey: 'NH', fuelType: 'Benzine', volume: 1651 };
calculatePrice(GRID, value); // => 280

isOldtimerExempt('19860101', new Date()); // => true
```

## Updating the tariff grid

The provincial tariff grid (`src/grid.ts`) is sourced from the official
Belastingdienst MRB tariff JS file
(`https://www.belastingdienst.nl/common/js/iah/motorrijtuigenbelasting-tarieven.js`)
and changes yearly. This is the single source of truth for both consumers —
update it here, bump the version, and update the git dependency ref in each
consumer.

## Test

```bash
npm test
```

Runs on Node's built-in test runner (`node --test`) — no test framework
dependency.
