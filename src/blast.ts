import blastAddresses from "./assets/Blast.json";
import { Role, UniqueId } from "./types";

export const getAllBlastAddresses = () =>
  blastAddresses as Record<UniqueId, Role>;
