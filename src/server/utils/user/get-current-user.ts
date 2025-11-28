import dbConnect from "@/server/db/connect";
import { UserModel } from "@/server/db/schema";
import { auth0 } from "@/server/security/auth0";

export const getCurrentUser = async () => {
    const session = await auth0.getSession();

    if (!session || !session.user) {
        throw new Error("No user found in session");
    }

    await dbConnect();

    let user = await UserModel.findOne({ authId: session.user.sub });

    if (!user) {
        user = await UserModel.create({
            authId: session.user.sub,
            email: session.user.email,
            expenses: [],
            income: [],
            retirement: [],
            withdrawalRate: 4,
            active: true
        });
    }

    return user;
}