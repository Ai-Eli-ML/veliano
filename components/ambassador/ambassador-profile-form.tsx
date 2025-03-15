"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateAmbassadorProfile } from "@/actions/ambassador"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import type { AmbassadorProfile } from "@/types/ambassador"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  bio: z.string().optional(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  website: z.string().optional(),
  payment_method: z.string().optional(),
  payment_details: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
})

interface AmbassadorProfileFormProps {
  ambassador: AmbassadorProfile
}

type SocialMedia = {
  instagram?: string
  tiktok?: string
  youtube?: string
  twitter?: string
  facebook?: string
  website?: string
}

export function AmbassadorProfileForm({ ambassador }: AmbassadorProfileFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: ambassador.bio || "",
      instagram: (ambassador.social_media as SocialMedia)?.instagram || "",
      tiktok: (ambassador.social_media as SocialMedia)?.tiktok || "",
      youtube: (ambassador.social_media as SocialMedia)?.youtube || "",
      twitter: (ambassador.social_media as SocialMedia)?.twitter || "",
      facebook: (ambassador.social_media as SocialMedia)?.facebook || "",
      website: (ambassador.social_media as SocialMedia)?.website || "",
      payment_method: ambassador.payment_method?.type || "",
      payment_details: ambassador.payment_method?.details || {},
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const formData = new FormData()
      if (values.bio) formData.append("bio", values.bio)
      if (values.instagram) formData.append("instagram", values.instagram)
      if (values.tiktok) formData.append("tiktok", values.tiktok)
      if (values.youtube) formData.append("youtube", values.youtube)
      if (values.twitter) formData.append("twitter", values.twitter)
      if (values.facebook) formData.append("facebook", values.facebook)
      if (values.website) formData.append("website", values.website)
      if (values.payment_method) formData.append("payment_method", values.payment_method)
      if (values.payment_details) formData.append("payment_details", JSON.stringify(values.payment_details))

      const response = await fetch("/api/ambassador/profile", {
        method: "PUT",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about yourself, your audience, and why you're a great ambassador..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>This bio will be visible on your ambassador profile.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Media Profiles</h3>
          <p className="text-sm text-muted-foreground">
            Update your social media profiles to help us promote your content.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="@username or full URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tiktok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok</FormLabel>
                  <FormControl>
                    <Input placeholder="@username or full URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube</FormLabel>
                  <FormControl>
                    <Input placeholder="Channel URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input placeholder="@username or full URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input placeholder="Page or profile URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website/Blog</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourwebsite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </Form>
  )
}

