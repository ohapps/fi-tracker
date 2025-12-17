import { auth0 } from "@/server/security/auth0";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth0.getSession();

        if (!session || !session.user) {
            return NextResponse.json({ authenticated: false, message: "No session found" }, { status: 200 });
        }

        const now = Math.floor(Date.now() / 1000);

        // Check if token is expired (safeguard, though getSession usually returns null if expired/invalid)
        if (session.exp && (session.exp as number) < now) {
            return NextResponse.json({
                authenticated: false,
                message: "Session expired",
                expiredAt: new Date((session.exp as number) * 1000)
            }, { status: 200 });
        }

        return NextResponse.json({
            authenticated: true,
            expiresAt: new Date((session.exp as number) * 1000),
            message: "Session valid"
        });
    } catch (error) {
        console.error("Session check error:", error);
        return NextResponse.json({ authenticated: false, message: "Error checking session" }, { status: 500 });
    }
}
