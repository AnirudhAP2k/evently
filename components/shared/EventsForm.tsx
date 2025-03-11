"use client";

import React, { useState } from 'react';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { EventCreateSchema } from "@/lib/validation";
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
import Dropdown from './Dropdown';

interface EventsFormProps {
    userId: string
    type: "Create" | "Update"
}

const EventsForm = ({ userId, type }: EventsFormProps) => {
    const [errors, setErrors] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [showTwoFactor, setShowTwoFactor] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof EventCreateSchema>>({
        resolver: zodResolver(EventCreateSchema),
        defaultValues: {
        title: "",
        description: "",
        location: "",
        imageUrl: "",
        startDateTime: new Date(),
        endDateTime: new Date(),
        categoryId: "",
        price: "",
        isFree: false,
        url: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof EventCreateSchema>) => {
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
        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
            >
                <div className="flex flex-col gap-5 md:flex-row">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                <Input {...field}
                                className="input-field"
                                placeholder="Event title "
                                type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <Dropdown
                                    onChangeHandler={field.onChange}
                                    value={field.value}
                                >
                                </Dropdown>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormControl>
                                <Input {...field}
                                className="input-field"
                                placeholder="Event title "
                                type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormErrors message={errors} />
                <FormSuccess message={success} />
                <Button className="w-full" type="submit" disabled={isPending}>
                    Create
                </Button>
            </form>
        </Form>
    </>
  )
}

export default EventsForm
