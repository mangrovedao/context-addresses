import assert from "assert";
import { describe, it } from "mocha";

import { getAllAaveV3Addresses } from "../../src/aave";
import { getAllBlastAddresses } from "../../src/blast";
import { getAllAccounts } from "../../src/accounts";
import { getAllErc20s } from "../../src/erc20";
import { getAllMulticallAddresses } from "../../src/multicall";

describe("Unique IDs", () => {
  it("Unique IDs should be unique per network across address types", () => {
    const aaveV3Addresses = getAllAaveV3Addresses();
    const blastAddresses = getAllBlastAddresses();
    const accountAddresses = getAllAccounts();
    const erc20Addresses = getAllErc20s();
    const multicallAddresses = getAllMulticallAddresses();

    // network ID -> ID -> {source, entry}
    const uniqueIds: Record<
      string,
      Record<string, { source: string; entry: any }[]>
    > = {};

    for (const [source, addresses] of [
      ["AAVE-v3.json", aaveV3Addresses],
      ["Blast.json", blastAddresses],
      ["accounts.json", accountAddresses],
      ["multicall.json", multicallAddresses],
    ] as const) {
      for (const [id, entry] of Object.entries(addresses)) {
        for (const networkId of Object.keys(entry.networkAddresses)) {
          const networkUIDMap = uniqueIds[networkId] ?? {};
          if (uniqueIds[networkId] === undefined) {
            uniqueIds[networkId] = networkUIDMap;
          }

          if (networkUIDMap[id] === undefined) {
            networkUIDMap[id] = [];
          }
          networkUIDMap[id].push({ source, entry });
        }
      }
    }

    for (const [tokenId, tokenEntry] of Object.entries(erc20Addresses)) {
      for (const [networkId, tokenInstances] of Object.entries(
        tokenEntry.networkInstances,
      )) {
        const networkUIDMap = uniqueIds[networkId] ?? {};
        if (uniqueIds[networkId]) {
          uniqueIds[networkId] = networkUIDMap;
        }

        if (networkUIDMap[tokenId] === undefined) {
          networkUIDMap[tokenId] = [];
        }
        networkUIDMap[tokenId].push({
          source: "ERC-20.json - token ID",
          entry: tokenEntry,
        });

        for (const [tokenInstanceId, tokenInstanceEntry] of Object.entries(
          tokenInstances,
        )) {
          if (networkUIDMap[tokenInstanceId] === undefined) {
            networkUIDMap[tokenInstanceId] = [];
          }
          networkUIDMap[tokenInstanceId].push({
            source: `ERC-20.json - token ID: ${tokenId}, token instance ID`,
            entry: tokenInstanceEntry,
          });
        }
      }
    }

    // Remove unique IDs
    for (const [networkId, networkUIDMap] of Object.entries(uniqueIds)) {
      for (const [id, entries] of Object.entries(networkUIDMap)) {
        if (entries.length === 1) {
          delete networkUIDMap[id];
        }
      }

      if (Object.keys(networkUIDMap).length === 0) {
        delete uniqueIds[networkId];
      }
    }
    assert.equal(
      Object.keys(uniqueIds).length,
      0,
      `Duplicate IDs found: ${JSON.stringify(uniqueIds, null, 2)}`,
    );
  });
});
