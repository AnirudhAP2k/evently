"use client";

import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Header } from "@/components/auth/Header";
import { Social } from "@/components/auth/Social";

interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButonLabel: string;
    backButonHref: string;
    showSocial?: boolean;
}

export const CardWrapper = ({
    children,
    headerLabel,
    backButonLabel,
    backButonHref,
    showSocial
}: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            { showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )};
        </Card>
    );
};