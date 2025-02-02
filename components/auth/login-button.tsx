"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
    children: React.ReactNode;
    node?: "modal" | "redirect",
    asChild?: boolean;
};

export const LoginButton = ({
    children,
    node = "redirect",
    asChild
}: LoginButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push("/login");
    };

    if(node === "modal") {
        return (
            <span>
                TODO: Implement modal
            </span>
        )
    }
    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}