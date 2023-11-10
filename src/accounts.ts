import accounts from "./assets/accounts.json";
import { AccountId, Account } from "./types";

export const getAllAccounts = () => accounts as Record<AccountId, Account>;
