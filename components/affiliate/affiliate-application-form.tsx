"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { applyForAffiliateProgram } from "@/actions/affiliate"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z
  .object({
    code: z
      .string()
      .min(3, {
        message: "Affiliate code must be at least 3 characters",
      })
      .max(20, {
        message: "Affiliate code must be at most 20 characters",
      })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message: "Affiliate code can only contain letters, numbers, underscores, and hyphens",
      }),
    paymentMethod: z.enum(["paypal", "bank_transfer"], {
      required_error: "Please select a payment method",
    }),
    paypalEmail: z
      .string()
      .email()
      .optional()
      .refine(
        (email) => {
          if (email === undefined) return true
          return email.length > 0
        },
        {
          message: "PayPal email is required for PayPal payment method",
        },
      ),
    accountName: z
      .string()
      .optional()
      .refine(
        (name) => {
          if (name === undefined) return true
          return name.length > 0
        },
        {
          message: "Account name is required for bank transfer",
        },
      ),
    accountNumber: z
      .string()
      .optional()
      .refine(
        (number) => {
          if (number === undefined) return true
          return number.length > 0
        },
        {
          message: "Account number is required for bank transfer",
        },
      ),
    routingNumber: z
      .string()
      .optional()
      .refine(
        (number) => {
          if (number === undefined) return true
          return number.length > 0
        },
        {
          message: "Routing number is required for bank transfer",
        },
      ),
    bankName: z
      .string()
      .optional()
      .refine(
        (name) => {
          if (name === undefined) return true
          return name.length > 0
        },
        {
          message: "Bank name is required for bank transfer",
        },
      ),
  })
  .refine(
    (data) => {
      if (data.paymentMethod === "paypal") {
        return !!data.paypalEmail
      }
      return true
    },
    {
      message: "PayPal email is required for PayPal payment method",
      path: ["paypalEmail"],
    },
  )
  .refine(
    (data) => {
      if (data.paymentMethod === "bank_transfer") {
        return !!data.accountName && !!data.accountNumber && !!data.routingNumber && !!data.bankName
      }
      return true
    },
    {
      message: "All bank details are required for bank transfer",
      path: ["accountName"],
    },
  )

export function AffiliateApplicationForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      paymentMethod: "paypal",
      paypalEmail: "",
      accountName: "",
      accountNumber: "",
      routingNumber: "",
      bankName: "",
    },
  })

  const paymentMethod = form.watch("paymentMethod")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("code", values.code)
      formData.append("paymentMethod", values.paymentMethod)

      if (values.paymentMethod === "paypal" && values.paypalEmail) {
        formData.append("paypalEmail", values.paypalEmail)
      } else if (values.paymentMethod === "bank_transfer") {
        formData.append("accountName", values.accountName || "")
        formData.append("accountNumber", values.accountNumber || "")
        formData.append("routingNumber", values.routingNumber || "")
        formData.append("bankName", values.bankName || "")
      }

      const result = await applyForAffiliateProgram(formData)

      if (result.success) {
        toast({
          title: "Application submitted",
          description: "Your affiliate application has been submitted for review.",
        })

        // Refresh the page to show the affiliate dashboard
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit application",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting affiliate application:", error)
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
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Affiliate Code</FormLabel>
              <FormControl>
                <Input placeholder="your-code" {...field} />
              </FormControl>
              <FormDescription>
                This will be used in your affiliate links (e.g., example.com?ref=your-code)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="paypal" />
                    </FormControl>
                    <FormLabel className="font-normal">PayPal</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="bank_transfer" />
                    </FormControl>
                    <FormLabel className="font-normal">Bank Transfer</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {paymentMethod === "paypal" && (
          <FormField
            control={form.control}
            name="paypalEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PayPal Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormDescription>We'll send your commissions to this PayPal account</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {paymentMethod === "bank_transfer" && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Routing Number</FormLabel>
                  <FormControl>
                    <Input placeholder="987654321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Bank of America" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

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

