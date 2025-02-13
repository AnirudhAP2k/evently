import { NextResponse, NextRequest } from "next/server";
import { LoginSchema } from "@/lib/validation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method not allowed"}, { status: 405 });
    }

    try {
        const data = await req.json();

        const validated = LoginSchema.safeParse(data);
        
        if (!validated.success) {
            return NextResponse.json({ error: "Invalid Credentials" }, { status: 400 });
        }

        const { email, password } = validated.data;

        const user = await getUserByEmail(email);
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        
        const isValid = user.password && (await bcrypt.compare(password, user.password));

        if (!isValid) {
            return NextResponse.json({ error: "Invalid Password" }, { status: 400 });
        }

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
                        return NextResponse.json({ error: "Invalid Credentials" }, { status: 400 });
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
