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
                redirectTo: false
            })
        } catch (error: any) {
            if(error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignIn":
                        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
                    default:
                        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
                }
            }
            throw error;
        }

        // const user = await prisma.user.findUnique({
        //     where: { email }
        // });

        // if (!user) {
        //     return NextResponse.json({ error: "User not found" }, { status: 404 });
        // }

        // const isValid = user.password && (await bcrypt.compare(password, user.password));
        // if (!isValid) {
        //     return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        // }

        return NextResponse.json({ message: "Login Successful", user: user }, { status: 200 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
