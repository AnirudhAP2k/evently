import { NextResponse, NextRequest } from "next/server";
import { LoginSchema } from "@/lib/validation";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { genVerificationToken } from "@/lib/tokens";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/mailer";
import { tokenVerificationBaseLink } from "@/constants";

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

        if(!user.emailVerified) {
            const verificationToken = await genVerificationToken(email);

            if(!verificationToken) {
                return NextResponse.json({ error: "Unable to generate verification token. Please try again later!" }, { status: 500 });
            }

            const verificationEmail = await sendMail({
                email: process.env.SENDER_EMAIL || "alerts@evently.com",
                sendTo: verificationToken.email,
                subject: "Verify your email address",
                html: `<p>To verify your email, please <a href="${tokenVerificationBaseLink}${verificationToken.token}">click here</a>. <br></br> This link will expire in 1 hour.</p>`
            });

            if(!verificationEmail) {
                return NextResponse.json({ error: "Unable to send verification token. Please try again later!" }, { status: 500 });
            }
            
            return NextResponse.json({ error: "Email not verified. Verification email sent" }, { status: 300 });
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
