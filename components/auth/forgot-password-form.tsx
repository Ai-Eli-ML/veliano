"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/providers/auth-provider"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

export default function ForgotPasswordForm() {
  const { resetPassword } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { error, success } = await resetPassword(values.email)

      if (success) {
        setIsSubmitted(true)
        toast({
          title: "Reset link sent",
          description: "Please check your email for password reset instructions",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Failed to send reset link",
          description: error?.message || "Please check your email and try again",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send reset link",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="text-xl font-medium">Check your email</h3>
        <p className="text-gray-500">
          We&apos;ve sent a password reset link to your email address. Please check your inbox.
        </p>
        <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
          Send another link
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full metallic-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending reset link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </Form>
  )
}

