import { NextResponse, NextRequest } from "next/server";
import { LoginSchema } from "@/lib/validation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const POST = async (req: NextRequest) => {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed"}, { status: 405 });
    }

    try {
        const data = await req.json();

        const validated = LoginSchema.safeParse(data);
        
        if (!validated.success) {
            return NextResponse.json({ error: "Incorrect Credentials" }, { status: 400 });
        }

        const { email, password } = validated.data;

        try {
            await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
        } catch (error: any) {
            console.error(error.message);
            if(error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin": {
                        return NextResponse.json({ error: error.message }, { status: 400 });
                    }
                    case "OAuthSignInError": {
                        return NextResponse.json({ error: "OAuth SignIn Failed" }, { status: 400 });
                    }
                    default: {
                        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
                    }
                }
            }
        }

        return NextResponse.json({ message: "Login Successful" }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
