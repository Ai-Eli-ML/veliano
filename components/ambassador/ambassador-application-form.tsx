"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { applyForAmbassadorProgram } from "@/actions/ambassador"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  bio: z
    .string()
    .min(50, {
      message: "Bio must be at least 50 characters",
    })
    .max(500, {
      message: "Bio cannot exceed 500 characters",
    }),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  website: z.string().optional(),
})

export function AmbassadorApplicationForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bio: "",
      instagram: "",
      tiktok: "",
      youtube: "",
      twitter: "",
      facebook: "",
      website: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("bio", values.bio)

      if (values.instagram) formData.append("instagram", values.instagram)
      if (values.tiktok) formData.append("tiktok", values.tiktok)
      if (values.youtube) formData.append("youtube", values.youtube)
      if (values.twitter) formData.append("twitter", values.twitter)
      if (values.facebook) formData.append("facebook", values.facebook)
      if (values.website) formData.append("website", values.website)

      const result = await applyForAmbassadorProgram(formData)

      if (result.success) {
        toast({
          title: "Application submitted",
          description: "Your ambassador application has been submitted for review.",
        })

        // Refresh the page to show the ambassador dashboard
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit application",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting ambassador application:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
                  placeholder="Tell us about yourself, your audience, and why you want to be an ambassador..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>This will help us understand if you're a good fit for our program.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Media Profiles</h3>
          <p className="text-sm text-muted-foreground">
            Please provide links to your social media profiles. At least one is required.
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

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Apply Now"
          )}
        </Button>
      </form>
    </Form>
  )
}

