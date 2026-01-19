"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationCreateSchema } from "@/lib/validation";
import { z } from "zod";
import axios from "axios";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Dropdown from "@/components/shared/Dropdown";
import FileUploader from "@/components/shared/FileUploader";
import { FormErrors } from "@/components/FormErrors";
import { FormSuccess } from "@/components/FormSuccess";
import { useRouter } from "next/navigation";

interface OrganizationFormProps {
  userId: string;
  type: "Create" | "Update"
}

const OrganizationForm = ({ userId }: OrganizationFormProps) => {
  const router = useRouter();
  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof OrganizationCreateSchema>>({
    resolver: zodResolver(OrganizationCreateSchema),
    defaultValues: {
      name: "",
      industry: "",
      description: "",
      website: "",
      logo: null,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof OrganizationCreateSchema>
  ) => {
    setErrors("");
    setSuccess("");

    let logoUrl = "";

    if (files.length > 0) {
      const upload = await fetch("/api/upload", {
        method: "POST",
        body: files[0],
      });

      const data = await upload.json();
      logoUrl = data.url;
    }

    try {
      const res = await axios.post("/api/organizations", {
        ...values,
        logo: logoUrl,
        userId,
      });

      setSuccess("Organization created successfully");
      router.push(`/dashboard`);

    } catch (error: any) {
      setErrors(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Organization Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Organization name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Industry */}
        <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
                <FormItem className="w-full">
                    <Dropdown
                        onChangeHandler={field.onChange}
                        value={field.value}
                        type="industry"
                    >
                    </Dropdown>
                    <FormMessage />
                </FormItem>
            )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Short description"
                  className="h-28"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Website */}
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Website (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Logo Upload */}
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploader
                  image={field.value}
                  setFiles={setFiles}
                  onFieldChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormErrors message={errors} />
        <FormSuccess message={success} />

        <Button type="submit" className="w-full">
          Create Organization
        </Button>
      </form>
    </Form>
  );
};

export default OrganizationForm;
