'use client'

import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Loader2, MailOpen, Send, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { createCampaign } from '@/actions/email'

// Form schema
const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  targetAudience: z.enum(['all', 'marketing', 'product_updates']),
  scheduledFor: z.string().optional(),
  testEmails: z.string().optional(),
})

type CampaignFormData = z.infer<typeof campaignSchema>

const emailTemplates = [
  { id: 'newsletter', name: 'Newsletter' },
  { id: 'promotional', name: 'Promotional' },
  { id: 'product_launch', name: 'Product Launch' },
  { id: 'special_event', name: 'Special Event' },
  { id: 'seasonal', name: 'Seasonal Campaign' }
]

export function AdminCampaignEditor() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('content')
  const [audienceCount, setAudienceCount] = useState<number | null>(null)
  const supabase = createClientComponentClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      targetAudience: 'all',
    },
  })
  
  const { control, handleSubmit, watch, reset } = form
  const targetAudience = watch('targetAudience')
  
  const fetchAudienceCount = async (audience: string) => {
    if (audience === 'custom') {
      setAudienceCount(null)
      return
    }
    
    try {
      let query = supabase.from('email_subscribers').select('id', { count: 'exact' })
      
      if (audience === 'active') {
        query = query.eq('status', 'active')
      } else if (audience === 'inactive') {
        query = query.eq('status', 'unsubscribed')
      }
      
      const { count } = await query
      setAudienceCount(count)
    } catch (error) {
      console.error('Error fetching audience count:', error)
      setAudienceCount(null)
    }
  }
  
  React.useEffect(() => {
    if (targetAudience) {
      fetchAudienceCount(targetAudience)
    }
  }, [targetAudience])
  
  const onSubmit = async (data: CampaignFormData) => {
    try {
      setIsSubmitting(true)
      await createCampaign(data)
      toast.success('Campaign created successfully')
      reset()
    } catch (error) {
      toast.error('Failed to create campaign')
      console.error('Campaign creation error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleSendTest = () => {
    const testEmails = form.getValues('testEmails')
    if (testEmails) {
      alert('Test emails would be sent to: ' + testEmails)
    }
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Email Campaign Editor</CardTitle>
        <CardDescription>
          Create and schedule email campaigns for your subscribers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Campaign Content</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4 pt-4">
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Sale Announcement" {...field} />
                      </FormControl>
                      <FormDescription>
                        Internal name for this campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Don't Miss Our Summer Sale!" {...field} />
                      </FormControl>
                      <FormDescription>
                        Appears in recipient's inbox
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your email content here..." 
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Main content of your email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="audience" className="space-y-4 pt-4">
                <FormField
                  control={control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target audience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Subscribers</SelectItem>
                          <SelectItem value="marketing">Marketing Subscribers</SelectItem>
                          <SelectItem value="product_updates">Product Updates Subscribers</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Who should receive this campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {audienceCount !== null && (
                  <div className="flex items-center space-x-2 rounded-md bg-muted p-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Estimated audience: <strong>{audienceCount}</strong> subscribers
                    </span>
                  </div>
                )}
                
                <FormField
                  control={control}
                  name="testEmails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Emails</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="test@example.com, admin@example.com" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Send test emails to these addresses (comma-separated)
                      </FormDescription>
                      <FormMessage />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="mt-2"
                        onClick={handleSendTest}
                        disabled={!field.value}
                      >
                        <MailOpen className="mr-2 h-4 w-4" />
                        Send Test
                      </Button>
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="scheduling" className="space-y-4 pt-4">
                <FormField
                  control={control}
                  name="scheduledFor"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Schedule Send (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          className="mt-1"
                        />
                      </FormControl>
                      <FormDescription>
                        Leave blank to save as draft
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            {status === 'success' && (
              <div className="flex items-center space-x-2 rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span>{message}</span>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex items-center space-x-2 rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>{message}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  reset()
                  setStatus('idle')
                  setMessage('')
                }}
              >
                Cancel
              </Button>
              <div className="space-x-2">
                <Button 
                  type="submit" 
                  variant="outline"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 