"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star } from "lucide-react"
import { submitReview } from "@/actions/reviews"
import { useToast } from "@/hooks/use-toast"
import type { ProductReview } from "@/types/review"

const formSchema = z.object({
  rating: z.string().min(1, "Please select a rating"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be less than 1000 characters"),
})

interface ReviewFormProps {
  productId: string
  onSuccess: (review: ProductReview) => void
  onCancel: () => void
}

export function ReviewForm({ productId, onSuccess, onCancel }: ReviewFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: "",
      title: "",
      content: "",
    },
  })

  const selectedRating = form.watch("rating")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("productId", productId)
      formData.append("rating", values.rating)
      formData.append("title", values.title)
      formData.append("content", values.content)

      const result = await submitReview(formData)

      if (result.success) {
        toast({
          title: "Review submitted",
          description: "Thank you for your review!",
        })

        if (result.data) {
          onSuccess(result.data as unknown as ProductReview)
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to submit review",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting review:", error)
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
          name="rating"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div
                        key={rating}
                        className="relative"
                        onMouseEnter={() => setHoverRating(rating)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} className="sr-only" />
                        <label htmlFor={`rating-${rating}`} className="cursor-pointer p-1">
                          <Star
                            className={`h-8 w-8 ${
                              (hoverRating ? rating <= hoverRating : rating <= Number.parseInt(selectedRating || "0"))
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                          <span className="sr-only">{rating} stars</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </FormControl>
              <FormDescription>How would you rate this product?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review Title</FormLabel>
              <FormControl>
                <Input placeholder="Summarize your experience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with this product..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Your review will help other customers make better purchasing decisions.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

