import assert from "assert";
import { describe, it } from "mocha";

import erc20Addresses from "../../src/assets/ERC-20.json";

import { getAllErc20s } from "../../src/erc20";

describe("erc20.ts", () => {
  describe("getAllErc20s", () => {
    it("should return all addresses", () => {
      const result = getAllErc20s();
      assert.equal(result, erc20Addresses);
    });
  });
});
