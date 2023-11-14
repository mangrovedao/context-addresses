# Context addresses for Mangrove

[![npm version](https://badge.fury.io/js/%40mangrovedao%2Fcontext-addresses.svg)](https://badge.fury.io/js/%40mangrovedao%2Fcontext-addresses)
[![CI](https://github.com/mangrovedao/context-addresses/actions/workflows/ci.yml/badge.svg)](https://github.com/mangrovedao/context-addresses/actions/workflows/ci.yml)

This repo contains a collection of addresses on various networks used by Mangrove:

- ERC-20 tokens
- Multicall contracts
- AAVE v3 address provider contract
- Accounts used by Mangrove governance and operations.

For addresses of Mangrove contracts, see the [mangrove-deployments](https://github.com/mangrovedao/mangrove-deployments/) repo.

## Install

- npm - `npm i @mangrovedao/context-addresses`
- yarn - `yarn add @mangrovedao/context-addresses`

## Usage

It is possible to directly use the JSON files in the [assets folder](./src/assets/) that contain the addresses for each address type (accounts, ERC-20 etc).

An alternative is to use the JavaScript library methods to query the addresses. The library currently supports getting all addresses for a specific type:

### Simple addresses

```ts
const multicallAddresses = getAllMulticallAddresses();
const aaveV3Addresses = getAllAaveV3Addresses();
const accounts = getAllAccounts();
```

These return an object with this structure:

```jsonc
{
  "<a unique ID>": {
    "description": "<description of the contract/account/...>",
    "networkAddresses": {
      "<chain ID>": "<address on chain ID>"
    }
  }
  ...
}
```

_Example:_

```jsonc
{
  "Multicall2": {
    "description": "Multicall2 - Aggregate results from multiple read-only function calls",
    "networkAddresses": {
      "137": "0x275617327c958bD06b5D6b871E7f491D76113dd8",
      "42161": "0x842eC2c7D803033Edf55E478F461FC547Bc54EB2",
      "80001": "0xe9939e7Ea7D7fb619Ac57f648Da7B1D425832631"
    }
  }
}
```

### ERC-20 addresses

The function to get ERC-20 addresses returns a different structure with more information (see rationale in the next section):

```ts
const erc20Addresses = getAllErc20s();
```

This returns an object with this structure:

```jsonc
{
  "<a unique ID, typically the token symbol>":
  {
    "symbol": "<the token's symbol>",
    "description": "<a description of the token>",
    "decimals": <the token's number of decimals>,
    "networkInstances": {
      "<chain ID>": {
        "<a unique ID with the format SYMBOL[/VARIANT].[NETWORK_ID[/BRIDGE]]": {
          "name": "<the token's name>",
          "comment": "<any relevant comments about the token>",
          "contractName": "<the name of the token contract>",
          "address": "<the token's address on this chain>"
        },
        ...
      }
    }
  }
  ...
}
```

_Example:_

```jsonc
{
  "USDC": {
    "symbol": "USDC",
    "description": "Circle's USD Coin",
    "decimals": 6,
    "networkInstances": {
      "137": {
        "USDC.": {
          "name": "USD Coin",
          "comment": "Native USDC by Circle.",
          "contractName": "FiatTokenProxy",
          "address": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"
        },
        "USDC.e": {
          "name": "USD Coin (PoS)",
          "comment": "Bridged USDC from Ethereum. Not issued by Circle. Likely bridged by Polygon's FxPortal/Mapper.",
          "contractName": "UChildERC20Proxy",
          "address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          "default": true
        }
      }
      ...
    }
  }
}
```

## ERC-20 tokens

ERC-20 tokens is a multi-dimensional jungle:

- Which address claiming to be token `X` should I use?
- What bridge should I use, which addresses does it use, and how does it handle bridging of native tokens?
- Should I use stable coin issuer `Y`'s "native" ERC-20 token on chain `Z` or the equivalent token bridged from chain `W`?
- What format should I use to tell dApp `A` about the tokens I want to use?

The "Token Lists"\* standard addresses some of these questions, especially the last. However, it seems unable to properly model situations like the following:

1. Circle mints USDC directly on Ethereum, Polygon, and Arbitrum (Circle call these "native"). At the same time, USDC tokens bridged from Ethereum to Polygon and Arbitrum are very popular; In fact, at the time of writing, the bridged versions have a larger total supply than the so-called native USDC tokens. Abstractly, these tokens are the same (= Circle USDC), but their contracts are different and not related.
2. Polygon does not bridge WETH9 from Ethereum but instead bridges native ETH to a WETH contract on Polygon.
3. Token symbols are not canonical. In other words, totally unrelated tokens may use the same symbol..

In cases 1. and 2., there are different instances of the same abstract token. In case 3.,

We'd like to capture these aspect in our model and have a canonical way of specifying which abstract token and instance we use at any given time.

We're therefore experimenting with our own bespoke token list format (aka Token List was [Not Invented Here](https://xkcd.com/927/) 🙈).

Consider this experiment in progress and do not expect this to be stable.

\* Token Lists standard:

- [Uniswap blog post announcing Token Lists](https://blog.uniswap.org/token-lists)
- [tokenlists.org](https://tokenlists.org/)
- [Token List Bridge Utils](https://github.com/Uniswap/token-list-bridge-utils)
  - Utilities for converting an L1 token list to a cross-chain token list.

### ERC-20 token model

We model tokens as the following hierarchy:

```
SYMBOL[/ID]             The root of an abstract token with that symbol
│                       + an identifier if the symbol is not unique.
├ attributes:           Symbol, decimals, and description.
└ networkInstances      Grouping of instancec by network (chain ID).
  ├ <chain ID #1>
  │ ├ <instance ID #1>  Unique ID within the chain, see format below.
  │ │ ├ attributes:     Name, comment, contractName
  │ │ ├ address
  │ │ └ default         'true' if this is considered the default instance for SYMBOL[/UID] on the chain.
  │ └ <instance ID #2>
  │   └ ...
  └ <chain ID #2>
    └ ...
```

### ERC-20 Instance Naming scheme

We assign each _abstract token_ a unique ID on the form `SYMBOL[/ID]` where `ID` is only used if needed to differentiate from another abstract token.

Instances of abstract tokens are also given a unique ID on the format `SYMBOL[/ID].[SOURCE NETWORK[/BRIDGE]]`.

To ease the transition to this new identifier scheme, the instance ID format have been constructed to not collide with the old, so the two can co-exist. This means ERC-20 instance IDs cannot be just the token symbol. This is the reason the `.` is mandatory in the instance IDs.

To make IDs concise, we use the following shorthands for source networks and bridges:

```
SOURCE NETWORK:
  e = Ethereum
  T = Fake source network used to indicate test tokens

BRIDGE:
  (empty string):  The standard bridge for the chain1-chain2 pair.
                   E.g the Arbitrum Bridge between Ethereum and Arbitrum One.
```

_Examples:_

- `USDC.`: Circle's native USDC directly on the chain in question.
- `USDC.e`: Circle's USDC bridged from `e` = Ethereum using the main bridge on the chain in question.
  - This follows Circle's convention of calling these tokens `USDC.e` (NB: on-chain, their symbol is still `USDC`).
- `USDC.T/MGV`: USDC variant issued by Mangrove on the chain in question (for test purposes).
- `USDC.T/AAVEv3`: USDC variant issued for AAVE v3 on the chain in question (for test purposes).

## Notes

A list of network information can be found at [chainid.network](https://chainid.network/).

## License

This library is released under MIT.
