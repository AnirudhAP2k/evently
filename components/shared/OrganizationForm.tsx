"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationCreateSchema } from "@/lib/validation";
import { z } from "zod";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUploader from "@/components/shared/FileUploader";
import { FormErrors } from "@/components/FormErrors";
import { FormSuccess } from "@/components/FormSuccess";
import { createOrganization } from "@/actions/organization";
import { OrganizationSize } from "@prisma/client";

interface OrganizationFormProps {
  userId: string;
  type: "Create" | "Update";
  industries: { id: string; label: string }[];
  initialData?: any;
}

const OrganizationForm = ({
  userId,
  type,
  industries,
  initialData,
}: OrganizationFormProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof OrganizationCreateSchema>>({
    resolver: zodResolver(OrganizationCreateSchema),
    defaultValues: initialData || {
      name: "",
      industryId: "",
      description: "",
      website: "",
      location: "",
      size: undefined,
      logo: null,
    },
  });

  const onSubmit = async (
    values: z.infer<typeof OrganizationCreateSchema>
  ) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        let logoUrl = "";

        // Upload logo if provided
        if (files.length > 0) {
          const formData = new FormData();
          formData.append("file", files[0]);

          const upload = await fetch("/api/file-upload", {
            method: "POST",
            body: formData,
          });

          if (!upload.ok) {
            throw new Error("Failed to upload logo");
          }

          const data = await upload.json();
          logoUrl = data.url;
        }

        // Create FormData for server action
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("industryId", values.industryId);
        if (values.description) formData.append("description", values.description);
        if (values.website) formData.append("website", values.website);
        if (values.location) formData.append("location", values.location);
        if (values.size) formData.append("size", values.size);
        if (logoUrl) formData.append("logo", logoUrl);

        const result = await createOrganization(formData);

        if (result.error) {
          setError(result.error);
        } else {
          setSuccess("Organization created successfully!");
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1000);
        }
      } catch (err: any) {
        setError(err?.message || "Something went wrong");
      }
    });
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
              <FormLabel>Organization Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter organization name"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Industry */}
        <FormField
          control={form.control}
          name="industryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry *</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Organization Size */}
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Size</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STARTUP">Startup (1-50 employees)</SelectItem>
                  <SelectItem value="SME">SME (51-500 employees)</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise (500+ employees)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="City, Country"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your organization..."
                  className="h-28 resize-none"
                  {...field}
                  disabled={isPending}
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
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  disabled={isPending}
                />
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
              <FormLabel>Organization Logo</FormLabel>
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

        <FormErrors message={error} />
        <FormSuccess message={success} />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create Organization"}
        </Button>
      </form>
    </Form>
  );
};

export default OrganizationForm;
