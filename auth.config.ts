import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthConfig  } from "next-auth"
import { LoginSchema } from "@/lib/validation";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Google({
        clientId: process.env.GOOGLE_ID || "",
        clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    GitHub({
        clientId: process.env.GITHUB_ID || "",
        clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
        async authorize(credentials): Promise<any | null> {
            const validated = LoginSchema.safeParse(credentials);
                    
            if (validated.success) {
                const { email, password } = validated.data;
        
                const user = await getUserByEmail(email);
        
                if (!user || !user.password) {
                    return null;
                }
        
                const isValid = await bcrypt.compare(password, user.password);
                if (isValid) {
                    return user;
                }
            }

            return null;
        }
    }),
  ],
} satisfies NextAuthConfig