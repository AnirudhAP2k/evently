"use client";

import React, { useState } from 'react';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/lib/validation";
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
import { FormSuccess } from '@/components/FormSuccess';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
    const [errors, setErrors] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, setIsPending] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setErrors("");
        setSuccess(""); 
        setIsPending(true);

        const res = await axios
            .post('/api/auth/register', values, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setSuccess(response.data.message);
                router.push("/login");
            })
            .catch((error) => {
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
                headerLabel="Create an account"
                backButonLabel="Already have an account?"
                backButonHref="/login"
                showSocial
            >
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                            <Input {...field}
                            placeholder="John Doe"
                            type="name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )
                    }
                    />
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
                            <FormMessage />
                        </FormItem>
                        )
                    }
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                            <Input {...field}
                            placeholder="******"
                            type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )
                    }
                    />
                    </div>
                    <FormErrors message={errors} />
                    <FormSuccess message={success} />
                    <Button className="w-full" type="submit" disabled={isPending}>
                    Register
                    </Button>
                </form>
            </Form>
        </CardWrapper>
        </>
    )
}

export default RegisterForm
