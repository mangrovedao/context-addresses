# context-addresses

A collection of addresses used by Mangrove.

## ERC-20

ERC-20 tokens may have multiple instances on different networks and even on the same network.
Fx USDC exists on Polygon and Arbitrum in both so-called "native" variants issues by Circle
and in variants bridged from Ethereum using Polygon and Arbitrum's standard ERC-20 tokens.
Abstractly, these tokens are the same, but they have different addresses and different attributes.

Also, ERC-20 symbols are not canonical: There may be multiple tokens with the same symbol.

We therefore assign each token a unique ID and associate instances with that ID.
ERC-20 instances are also assigned a unique ID.

### Naming scheme

#### ERC-20 instance naming scheme

Dimensions:

- symbol
  - eg WETH, USDC
- symbol disambiguation / variant ID
  - in case of an ambiguous symbol, there must be an ID to disambiguate
  - we don't expect this to be common, so ideally disambiguation ID isn't required. This means assuming a primary token for a given symbol
  - NB: On testnets, this could be used to differentiate tokens
- original / source
  - eg Circle's USDC on Ethereum or Polygon
- bridged, from which chain, and by which bridge
  - eg WETH on Arbitrum bridged from Ethereum WETH9 using Arbitrum's canonical bridge
  - in case of multiple bridges, a bridge disambiguation ID is needed
- ~~wrapped (NB: can this be other than native? Yes, BTC)~~
  - native: WETH on Ethereum, WMATIC on Polygon
  - other: WBTC
  - NB: Is it actually important for our purposes whether a token is wrapped? Probably not, so ignoring this for now..
- version ?

To ease the transition to this new identifier scheme, the new identifiers should not collide with the old, so the two can co-exist. This means ERC-20 instance IDs cannot be just the token symbol.

```
SYMBOL[/VARIANT].[NETWORK_ID[/BRIDGE]]

NETWORK_ID:
  e = Ethereum
```

_Examples:_

- `USDC.`: Circle's native USDC directly on the chain in question
- `USDC.e`: Circle's USDC bridged from `e` = Ethereum using the main bridge on the chain in question
- `USDC/MGV.`: USDC variant issued by Mangrove on the chain in question (for test purposes)
- `USDC/AAVEv3.`: USDC variant issued for AAVE v3 on the chain in question (for test purposes)

## Notes

A list of network information can be found at [chainid.network](https://chainid.network/).

## License

This library is released under MIT.
