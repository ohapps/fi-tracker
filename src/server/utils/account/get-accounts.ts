import dbConnect from "@/server/db/connect";
import { getCurrentUser } from "../user/get-current-user";
import { AccountModel } from "@/server/db/schema";
import { Account } from "@/types/accounts";

export const getAccounts = async (): Promise<Account[]> => {
    await dbConnect();

    const user = await getCurrentUser();

    if (!user || !user._id) {
        throw new Error("User not found");
    }

    const accounts = await AccountModel.find({ userId: user._id });

    return accounts.map(account => ({
        id: account._id.toString(),
        description: account.description,
    }));
}