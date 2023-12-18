import multicallAddresses from "./assets/multicall.json";
import { Role, UniqueId } from "./types";

export const getAllMulticallAddresses = () =>
  multicallAddresses as Record<UniqueId, Role>;
