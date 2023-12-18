import assert from "assert";
import { describe, it } from "mocha";

import aaveV3Addresses from "../../src/assets/AAVE-v3.json";

import { getAllAaveV3Addresses } from "../../src/aave";

describe("aave.ts", () => {
  describe("getAllAaveV3Addresses", () => {
    it("should return all addresses", () => {
      const result = getAllAaveV3Addresses();
      assert.equal(result, aaveV3Addresses);
    });
  });
});
