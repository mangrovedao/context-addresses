import assert from "assert";
import { describe, it } from "mocha";

import blastAddresses from "../../src/assets/Blast.json";

import { getAllBlastAddresses } from "../../src/blast";

describe("blast.ts", () => {
  describe("getAllBlastAddresses", () => {
    it("should return all addresses", () => {
      const result = getAllBlastAddresses();
      assert.equal(result, blastAddresses);
    });
  });
});
