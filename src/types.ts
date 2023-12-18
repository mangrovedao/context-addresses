export type NetworkId = string;
export type Address = string;
export type UniqueId = string;

// A Role is a set of network addresses on different networks that play the same role.
export type Role = {
  description: string;
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

export type Erc20Id = UniqueId;
export type Erc20InstanceId = UniqueId;

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
