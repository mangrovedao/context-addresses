import aaveV3Addresses from "./assets/AAVE-v3.json";
import { Role, UniqueId } from "./types";

export const getAllAaveV3Addresses = () =>
  aaveV3Addresses as Record<UniqueId, Role>;
