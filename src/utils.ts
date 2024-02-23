/**
 * @module
 *
 * Utilities used by the Mangrove smart contract repos.
 */

import { Erc20, Erc20Id, Erc20Instance, Role, UniqueId } from "./types";

/** Network names used in Mangrove smart contract repos.
 *
 * Taken from ethers.js 5.7 which is used by the Mangrove smart contract repos.
 *
 * Differences:
 * - "homestead" -> "mainnet"
 * - "local" for 31337
 */
export const mangroveNetworkNames = {
  "1": "mainnet",
  "2": "morden",
  "3": "ropsten",
  "4": "rinkeby",
  "5": "goerli",
  "6": "classicKotti",
  "10": "optimism",
  "56": "bnb",
  "42": "kovan",
  "61": "classic",
  "63": "classicMordor",
  "69": "optimism-kovan",
  "97": "bnbt",
  "100": "xdai",
  "137": "matic",
  "238": "blast",
  "420": "optimism-goerli",
  "42161": "arbitrum",
  "80001": "maticmum",
  "31337": "local",
  "421611": "arbitrum-rinkeby",
  "421613": "arbitrum-goerli",
  "1337702": "kintsugi",
  "11155111": "sepolia",
  "168587773": "blast-sepolia",
} as Record<string, string>;

/**
 * Transform role groups as returned by most of the query methods to a structure that can
 * be easily serialized the JSON format used by the Mangrove smart contract repos when
 * reading addresses:
 *
 * ```
 * {
 *   "mainnet": [
 *     { "name": "Mangrove", "address": "0x..." },
 *     { "name": "MgvOracle", "address": "0x..." },
 *     ...
 *   ],
 *   "maticmum": ...
 * }
 * ```
 *
 * @param roleGroups Role groups as returned by most of the query methods.
 * @returns Named addresses grouped by named network.
 */
export function toNamedAddressesPerNamedNetwork(
  ...roleGroups: Record<UniqueId, Role>[]
): Record<string, { name: string; address: string }[]> {
  const namedAddressesByNetwork: Record<
    string,
    { name: string; address: string }[]
  > = {};

  for (const roleGroup of roleGroups) {
    for (const [roleId, role] of Object.entries(roleGroup)) {
      for (const [networkId, address] of Object.entries(
        role.networkAddresses,
      )) {
        const networkName = mangroveNetworkNames[networkId];

        let namedAddresses = namedAddressesByNetwork[networkName];
        if (namedAddresses === undefined) {
          namedAddresses = namedAddressesByNetwork[networkName] = [];
        }

        namedAddresses.push({
          name: roleId,
          address,
        });
      }
    }
  }

  return namedAddressesByNetwork;
}

/**
 * Transform ERC-20 instances as returned by the `getAllErc20s` method to a structure that can
 * be easily serialized the JSON format used by the Mangrove smart contract repos when reading
 * addresses:
 *
 * ```
 * {
 *   "mainnet": [
 *     { "symbol": "USDT", "decimals": 18, "id": "USDT.", "address": "0x...", "default": true },
 *     { "symbol": "USDT", "decimals": 18, "id": "USDT", "address": "0x...", "default": false },
 *     ...
 *   ],
 *   "maticmum": ...
 * }
 * ```
 * @param erc20s
 * @returns
 */
export function toErc20InstancesPerNamedNetwork(
  erc20s: Record<Erc20Id, Erc20>,
): Record<string, Erc20Instance[]> {
  const instancesPerNamedNetwork: Record<string, Erc20Instance[]> = {};

  for (const [, erc20] of Object.entries(erc20s)) {
    for (const [networkId, networkInstances] of Object.entries(
      erc20.networkInstances,
    )) {
      const networkName = mangroveNetworkNames[networkId];

      for (const [erc20InstanceId, erc20Instance] of Object.entries(
        networkInstances,
      )) {
        let instances = instancesPerNamedNetwork[networkName];
        if (instances === undefined) {
          instances = instancesPerNamedNetwork[networkName] = [];
        }

        instances.push({
          symbol: erc20.symbol,
          decimals: erc20.decimals,
          id: erc20InstanceId,
          address: erc20Instance.address,
          default: erc20Instance.default ?? false,
        });

        if (erc20Instance.default) {
          instances.push({
            symbol: erc20.symbol,
            decimals: erc20.decimals,
            id: erc20.symbol,
            address: erc20Instance.address,
            default: false,
          });
        }
      }
    }
  }

  return instancesPerNamedNetwork;
}
