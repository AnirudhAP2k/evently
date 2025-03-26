"use client";

import React, { useState } from 'react';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validation";
import { z } from 'zod';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import
{
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/FormErrors";
import { FormSuccess } from "@/components/FormSuccess";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const LoginForm = () => {
    const [errors, setErrors] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
        email: "",
        password: "",
        code: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        setErrors("");
        setSuccess("");
        setIsPending(true);

        const res = await axios
            .post('/api/auth/login', values, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            
            .then((response) => {
                setSuccess(response.data.message);

                if(response.data.showTwoFactor) {
                    setShowTwoFactor(true);
                }

                if (response.status !== 202) {
                    form.reset();
                    setTimeout(() => {
                        router.push('/');
                    }, 1000)
                }
            })
            .catch((error: any) => {
                const errMessage = error.response?.data?.error || error.message;
                setErrors(errMessage);
            })
            .finally(()=>{
                setIsPending(false);
            })
    };

    return (
        <>
            <CardWrapper
                headerLabel="Welcome back"
                backButonLabel="Don't have an account"
                backButonHref="/register"
                showSocial
            >
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
                        { !showTwoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                        <Input {...field}
                                        placeholder="john.doe@example.com"
                                        type="email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )
                                }
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                        <Input {...field}
                                        placeholder="******"
                                        type="password" />
                                        </FormControl>
                                        <Button
                                            size="sm"
                                            variant="link"
                                            asChild
                                            className="px-0 font-normal"
                                        >
                                            <Link href="/reset">
                                                Forgot password?
                                            </Link>
                                        </Button>
                                        <FormMessage />
                                    </FormItem>
                                    )
                                }
                                />
                            </>
                        )}
                        { showTwoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Two Factor Code</FormLabel>
                                    <FormControl>
                                    <Input {...field}
                                        disabled={isPending}
                                        placeholder="123456"
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )
                            }
                            />
                        )}
                    </div>
                    <FormErrors message={errors} />
                    <FormSuccess message={success} />
                    <Button className="w-full" type="submit" disabled={isPending}>
                        {showTwoFactor ? "Verify" : "Login"}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
        </>
    )
}

export default LoginForm
