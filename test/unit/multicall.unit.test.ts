import assert from "assert";
import { describe, it } from "mocha";

import multicall from "../../src/assets/multicall.json";

import { getAllMulticallAddresses } from "../../src/multicall";

describe("multicall.ts", () => {
  describe("getAllMulticallAddresses", () => {
    it("should return all addresses", () => {
      const result = getAllMulticallAddresses();
      assert.equal(result, multicall);
    });
  });
});
