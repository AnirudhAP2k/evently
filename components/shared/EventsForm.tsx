"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { EventCreateSchema, EventSubmitSchema } from "@/lib/validation";
import { z } from 'zod';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import
{
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormErrors } from "@/components/FormErrors";
import { FormSuccess } from "@/components/FormSuccess";
import { useRouter } from "next/navigation";
import Dropdown from '@/components/shared/Dropdown';
import { Textarea } from '@/components/ui/textarea';
import FileUploader from '@/components/shared/FileUploader';
import Image from 'next/image';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from '@/components/ui/checkbox';
import { handleUpload } from '@/lib/file-uploader';

interface EventsFormProps {
    userId: string
    type: "Create" | "Update"
}

const EventsForm = ({ userId, type }: EventsFormProps) => {
    const [errors, setErrors] = useState("");
    const [success, setSuccess] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const router = useRouter();

    const form = useForm<z.infer<typeof EventCreateSchema>>({
        resolver: zodResolver(EventCreateSchema),
        defaultValues: {
        title: "",
        description: "",
        location: "",
        image: null,
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

        const eventData = values;

        if(files.length === 0) {
            setErrors("Please upload an image");
            return;
        }

        const { imageUrl } = await handleUpload(files);

        if(!imageUrl) {
            setErrors("Image upload failed");
            return;
        }

        const finalValues = { ...values, userId, imageUrl };

        if(type === "Create") {
            await axios
            .post('/api/events', finalValues, {
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => {
                setSuccess(response.data.message);
                form.reset();
                router.push(response.data.event);
            })
            .catch((error: any) => {
                const errMessage = error.response?.data?.error || error.message;
                setErrors(errMessage);
            });
        }
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
                                    placeholder="Event title"
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
                    </div>

                    <div className="flex flex-col md:flex-row gap-5">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                    <Textarea {...field}
                                        className="textarea rounded-2xl h-52"
                                        placeholder="Description"
                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <FileUploader
                                            onFieldChange={field.onChange}
                                            image={field.value}
                                            setFiles={setFiles}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-5">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                                            <Image src="/assets/icons/location-grey.svg"
                                            alt="calendar"
                                            width={24}
                                            height={24}
                                            />
                                            <Input {...field}
                                                className="input-field"
                                                placeholder="Event location or online "
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-5">
                        <FormField
                            control={form.control}
                            name="startDateTime"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                                            <Image src="/assets/icons/calendar.svg"
                                            alt="calendar"
                                            width={24}
                                            height={24}
                                            className="filter-grey"
                                            />
                                            <p className="ml-3 whitespace-nowrap text-gray-600">Start Date</p>
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date: Date | null) => field.onChange(date || new Date())}
                                                showTimeSelect
                                                timeInputLabel='Time'
                                                dateFormat="MM/DD/YYYY h:mm aa"
                                                wrapperClassName='datePicker'
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endDateTime"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                                            <Image src="/assets/icons/calendar.svg"
                                            alt="calendar"
                                            width={24}
                                            height={24}
                                            className="filter-grey"
                                            />
                                            <p className="ml-3 whitespace-nowrap text-gray-600">End Date</p>
                                            <DatePicker
                                                selected={field.value}
                                                onChange={(date: Date | null) => field.onChange(date || new Date())}
                                                showTimeSelect
                                                timeInputLabel='Time'
                                                dateFormat="MM/DD/YYYY h:mm aa"
                                                wrapperClassName='datePicker'
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                                            <Image src="/assets/icons/dollar.svg"
                                            alt="dollar"
                                            width={24}
                                            height={24}
                                            className="filter-grey"
                                            />
                                            <Input { ...field }
                                                type="number"
                                                placeholder="Price"
                                                className='p-regular-16 border-0 bg-gray-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                                            />
                                            <FormField
                                                control={form.control}
                                                name="isFree"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <div className="flex items-center">
                                                                <label
                                                                    htmlFor="isFree"
                                                                    className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                    Free Ticket
                                                                </label>
                                                                <Checkbox onCheckedChange={field.onChange} checked={field.value} id="isFree" className="mr-2 h-5 w-5 border-2 border-primary-500" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                                            <Image src="/assets/icons/link.svg"
                                            alt="link"
                                            width={24}
                                            height={24}
                                            />
                                            <Input {...field}
                                                className="input-field"
                                                placeholder="URL"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <FormErrors message={errors} />
                    <FormSuccess message={success} />
                    <Button className="button col-span-2 w-full" disabled={form.formState.isSubmitting} size="lg" type="submit">
                    { form.formState.isSubmitting ? (
                        'Submitting...'
                    ) : (
                        `${type} Event`
                    )}
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default EventsForm
