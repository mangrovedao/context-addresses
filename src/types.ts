export type NetworkId = string;
export type Address = string;

///////////
// Accounts

export type AccountId = string;

export type Account = {
  description: Address;
  networkAddresses: Record<NetworkId, Address>;
};

/////////
// ERC-20

// ERC-20 tokens may have multiple instances on different networks and even on the same network.
// Fx USDC exists on Polygon and Arbitrum in both so-called "native" variants issues by Circle
// and in variants bridged from Ethereum using Polygon and Arbitrum's standard ERC-20 tokens.
// Abstractly, these tokens are the same, but they have different addresses and different attributes.
//
// Also, ERC-20 symbols are not canonical: There may be multiple tokens with the same symbol.
//
// We therefore assign each token a unique ID and associate instances with that ID.
// ERC-20 instances are also assigned a unique ID.

export type Erc20Id = string;
export type Erc20InstanceId = string;

export type Erc20 = {
  symbol: string;
  description: string;
  decimals: number;
  networkInstances: Record<
    NetworkId,
    Record<Erc20InstanceId, Erc20NetworkInstance>
  >;
};

export type Erc20NetworkInstance = {
  name: string;
  comment: string;
  contractName: string;
  address: Address;
  default?: boolean;
};
