import accounts from "./assets/accounts.json";
import { UniqueId, Role } from "./types";

export const getAllAccounts = () => accounts as Record<UniqueId, Role>;
