import { describe, it } from "mocha";
import { expect } from "chai";

import {
  toNamedAddressesPerNamedNetwork,
  toErc20InstancesPerNamedNetwork,
} from "../../src/utils";

describe("utils.ts", () => {
  describe("toNamedAddressesPerNamedNetwork", () => {
    it("should return empty object for empty input", () => {
      expect(toNamedAddressesPerNamedNetwork()).to.deep.equal({});
    });

    it("should return empty object for empty role group", () => {
      expect(toNamedAddressesPerNamedNetwork({})).to.deep.equal({});
    });

    it("should use role ID as address name", () => {
      const roleGroup = {
        roleId: {
          description: "Role description",
          networkAddresses: {
            "1": "0x123",
          },
        },
      };
      expect(toNamedAddressesPerNamedNetwork(roleGroup)).to.deep.equal({
        mainnet: [{ name: "roleId", address: "0x123" }],
      });
    });

    it("should map all networks for a role", () => {
      const roleGroup = {
        roleId: {
          description: "Role description",
          networkAddresses: {
            "1": "0x123",
            "80001": "0x456",
          },
        },
      };
      expect(toNamedAddressesPerNamedNetwork(roleGroup)).to.deep.equal({
        mainnet: [{ name: "roleId", address: "0x123" }],
        maticmum: [{ name: "roleId", address: "0x456" }],
      });
    });

    it("should map all roles in a role group", () => {
      const roleGroup = {
        roleId1: {
          description: "Role 1 description",
          networkAddresses: {
            "1": "0x123",
          },
        },
        roleId2: {
          description: "Role 2 description",
          networkAddresses: {
            "1": "0x456",
          },
        },
      };
      expect(toNamedAddressesPerNamedNetwork(roleGroup)).to.deep.equal({
        mainnet: [
          { name: "roleId1", address: "0x123" },
          { name: "roleId2", address: "0x456" },
        ],
      });
    });

    it("should map all role groups", () => {
      const roleGroup1 = {
        roleId1: {
          description: "Role 1 description",
          networkAddresses: {
            "1": "0x123",
          },
        },
      };
      const roleGroup2 = {
        roleId2: {
          description: "Role 2 description",
          networkAddresses: {
            "1": "0x456",
          },
        },
      };
      expect(
        toNamedAddressesPerNamedNetwork(roleGroup1, roleGroup2),
      ).to.deep.equal({
        mainnet: [
          { name: "roleId1", address: "0x123" },
          { name: "roleId2", address: "0x456" },
        ],
      });
    });
  });

  describe("toErc20InstancePerNamedNetwork", () => {
    it("should return empty object for empty input", () => {
      expect(toErc20InstancesPerNamedNetwork({})).to.deep.equal({});
    });

    it("should map non-default singleton to singleton", () => {
      const erc20s = {
        erc20Id: {
          symbol: "SYM",
          decimals: 18,
          description: "ERC-20 description",
          networkInstances: {
            "1": {
              "SYM.": {
                name: "Test name",
                comment: "Test comment",
                contractName: "Contract",
                address: "0x123",
                default: false,
              },
            },
          },
        },
      };
      expect(toErc20InstancesPerNamedNetwork(erc20s)).to.deep.equal({
        mainnet: [
          {
            symbol: "SYM",
            decimals: 18,
            id: "SYM.",
            address: "0x123",
            default: false,
          },
        ],
      });
    });

    it("should map undefined-default as non-default", () => {
      const erc20s = {
        erc20Id: {
          symbol: "SYM",
          decimals: 18,
          description: "ERC-20 description",
          networkInstances: {
            "1": {
              "SYM.": {
                name: "Test name",
                comment: "Test comment",
                contractName: "Contract",
                address: "0x123",
              },
            },
          },
        },
      };
      expect(toErc20InstancesPerNamedNetwork(erc20s)).to.deep.equal({
        mainnet: [
          {
            symbol: "SYM",
            decimals: 18,
            id: "SYM.",
            address: "0x123",
            default: false,
          },
        ],
      });
    });

    it("should map default singleton to both instance ID and symbol as ID", () => {
      const erc20s = {
        erc20Id: {
          symbol: "SYM",
          decimals: 18,
          description: "ERC-20 description",
          networkInstances: {
            "1": {
              "SYM.": {
                name: "Test name",
                comment: "Test comment",
                contractName: "Contract",
                address: "0x123",
                default: true,
              },
            },
          },
        },
      };
      expect(toErc20InstancesPerNamedNetwork(erc20s)).to.deep.equal({
        mainnet: [
          {
            symbol: "SYM",
            decimals: 18,
            id: "SYM.",
            address: "0x123",
            default: true,
          },
          {
            symbol: "SYM",
            decimals: 18,
            id: "SYM",
            address: "0x123",
            default: false,
          },
        ],
      });
    });

    it("should man multiple instances of same ERC20 for a network", () => {
      const erc20s = {
        erc20Id: {
          symbol: "SYM",
          decimals: 18,
          description: "ERC-20 description",
          networkInstances: {
            "1": {
              "SYM.": {
                name: "Test name 1",
                comment: "Test comment 1",
                contractName: "Contract1",
                address: "0x123",
                default: false,
              },
              "SYM.e": {
                name: "Test name 2",
                comment: "Test comment 2",
                contractName: "Contract2",
                address: "0x456",
                default: true,
              },
            },
          },
        },
      };
      expect(toErc20InstancesPerNamedNetwork(erc20s)).to.deep.equal({
        mainnet: [
          {
            symbol: "SYM",
            decimals: 18,
            id: "SYM.",
            address: "0x123",
            default: false,
          },
          {
            symbol: "SYM",
            decimals: 18,
            id: "SYM.e",
            address: "0x456",
            default: true,
          },
          {
            symbol: "SYM",
            decimals: 18,
            id: "SYM",
            address: "0x456",
            default: false,
          },
        ],
      });
    });

    it("should map multiple ERC20s for a network", () => {
      const erc20s = {
        erc20Id1: {
          symbol: "SYM1",
          decimals: 18,
          description: "ERC-20 description 1",
          networkInstances: {
            "1": {
              "SYM1.": {
                name: "Test name 1",
                comment: "Test comment 1",
                contractName: "Contract1",
                address: "0x123",
                default: false,
              },
            },
          },
        },
        erc20Id2: {
          symbol: "SYM2",
          decimals: 6,
          description: "ERC-20 description 2",
          networkInstances: {
            "1": {
              "SYM2.": {
                name: "Test name 2",
                comment: "Test comment 2",
                contractName: "Contract2",
                address: "0x456",
                default: false,
              },
            },
          },
        },
      };
      expect(toErc20InstancesPerNamedNetwork(erc20s)).to.deep.equal({
        mainnet: [
          {
            symbol: "SYM1",
            decimals: 18,
            id: "SYM1.",
            address: "0x123",
            default: false,
          },
          {
            symbol: "SYM2",
            decimals: 6,
            id: "SYM2.",
            address: "0x456",
            default: false,
          },
        ],
      });
    });

    it("should map multiple networks", () => {
      const erc20s = {
        erc20Id: {
          symbol: "SYM",
          decimals: 18,
          description: "ERC-20 description",
          networkInstances: {
            "1": {
              "SYM.": {
                name: "Test name 1",
                comment: "Test comment 1",
                contractName: "Contract1",
                address: "0x123",
                default: false,
              },
            },
            "80001": {
              "SYM.": {
                name: "Test name 2",
                comment: "Test comment 2",
                contractName: "Contract2",
                address: "0x456",
                default: false,
              },
            },
          },
        },
      };
      expect(toErc20InstancesPerNamedNetwork(erc20s)).to.deep.equal({
        mainnet: [
          {
            symbol: "SYM",
            decimals: 18,
            id: "SYM.",
            address: "0x123",
            default: false,
          },
        ],
        maticmum: [
          {
            symbol: "SYM",
            decimals: 18,
            id: "SYM.",
            address: "0x456",
            default: false,
          },
        ],
      });
    });
  });
});
