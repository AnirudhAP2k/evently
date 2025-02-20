"use client";

import React, { useState } from 'react';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/lib/validation";
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

const ResetForm = () => {
    const [errors, setErrors] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, setIsPending] = useState(false);

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
        email: ""
        },
    });

    const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
        setErrors("");
        setSuccess("");
        setIsPending(true);

        const res = await axios
            .post('/api/auth/password-reset', values, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setSuccess(response.data.message);
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
                headerLabel="Forgot your password"
                backButonLabel="Back to login"
                backButonHref="/login"
            >
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                >
                    <div className="space-y-4">
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
                    </div>
                    <FormErrors message={errors} />
                    <FormSuccess message={success} />
                    <Button className="w-full" type="submit" disabled={isPending}>
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
        </>
    )
}

export default ResetForm
