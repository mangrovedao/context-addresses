# Next version

# 1.2.1

- Add Blast mainnet ERC20 tokens: WETH, and USDB

# 1.2.0

- Add Blast network name (chain ID 238)
- Add `chainIdToNetworkName` function to convert a chain IDs to the network names used in Mangrove smart contract repos.

# 1.1.4

- Add Blast Sepolia Multicall2 address

# 1.1.3

- Add Blast Sepolia ERC20 tokens: WBTC, WETH, and USDB

# 1.1.2

- Add account addresses for Blast Sepolia

# 1.1.1

- Fix issue in mapping of default tokens in `toErc20InstancesPerNamedNetwork`: Only the original instance ID should be marked as default, not the copy that has the symbol as ID.
- Fix return type for `toErc20InstancesPerNamedNetwork`: Missing `decimals` field added.

# 1.1.0

- Add utils for transforming query results to structures that can be easily serialized the JSON format used by the Mangrove smart contract repos.

# 1.0.1

- Add Sepolia addresses for AAVE v3, multicall2, Mangrove accounts, and a few tokens: WETH and USDC.

# 1.0.0

- Initial version with all context addresses used by @mangrovedao/mangrove-core and @mangrovedao/mangrove-strats:
  - ERC20s
  - Mangrove accounts
  - AAVE v3 addresses
  - Multicall
