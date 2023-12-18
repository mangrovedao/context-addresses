import erc20Addresses from "./assets/ERC-20.json";

import { Erc20, Erc20Id } from "./types";

export const getAllErc20s = () => erc20Addresses as Record<Erc20Id, Erc20>;
