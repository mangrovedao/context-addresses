import assert from "assert";
import { describe, it } from "mocha";

import accounts from "../../src/assets/accounts.json";

import { getAllAccounts } from "../../src/accounts";

describe("accounts.ts", () => {
  describe("getAllAccounts", () => {
    it("should return all addresses", () => {
      const result = getAllAccounts();
      assert.equal(result, accounts);
    });
  });
});
