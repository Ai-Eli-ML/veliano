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

// Form schema
const campaignSchema = z.object({
  name: z.string().min(3, { message: 'Campaign name must be at least 3 characters' }),
  subject: z.string().min(5, { message: 'Subject line must be at least 5 characters' }),
  preheader: z.string().optional(),
  templateId: z.string().min(1, { message: 'Please select a template' }),
  content: z.string().min(20, { message: 'Content must be at least 20 characters' }),
  scheduledFor: z.date().optional(),
  targetAudience: z.enum(['all', 'active', 'inactive', 'custom']),
  testEmails: z.string().optional()
})

type CampaignValues = z.infer<typeof campaignSchema>

const emailTemplates = [
  { id: 'newsletter', name: 'Newsletter' },
  { id: 'promotional', name: 'Promotional' },
  { id: 'product_launch', name: 'Product Launch' },
  { id: 'special_event', name: 'Special Event' },
  { id: 'seasonal', name: 'Seasonal Campaign' }
]

export default function AdminCampaignEditor() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('content')
  const [audienceCount, setAudienceCount] = useState<number | null>(null)
  const supabase = createClientComponentClient()
  
  const form = useForm<CampaignValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      subject: '',
      preheader: '',
      templateId: '',
      content: '',
      targetAudience: 'all',
      testEmails: ''
    }
  })
  
  const targetAudience = form.watch('targetAudience')
  
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
  
  async function onSubmit(values: CampaignValues) {
    setStatus('loading')
    
    try {
      // In a real implementation, this would call a server action to save/send the campaign
      console.log('Campaign values:', values)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setStatus('success')
      setMessage('Campaign saved successfully!')
      
      // Reset form if needed
      // form.reset()
    } catch (error) {
      setStatus('error')
      setMessage('Failed to save campaign. Please try again.')
      console.error('Campaign submission error:', error)
    }
  }
  
  function handleSendTest() {
    // Logic to send test emails would go here
    alert('Test emails would be sent to: ' + form.getValues('testEmails'))
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Campaign Content</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Sale 2024" {...field} />
                      </FormControl>
                      <FormDescription>
                        Internal name for this campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Line</FormLabel>
                      <FormControl>
                        <Input placeholder="Special offer just for you!" {...field} />
                      </FormControl>
                      <FormDescription>
                        Appears in recipient's inbox
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preheader"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preheader Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Get 20% off your next custom grillz order" {...field} />
                      </FormControl>
                      <FormDescription>
                        Preview text shown in email clients
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="templateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Template</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {emailTemplates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the design template for your campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your email content here..." 
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
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Subscribers</SelectItem>
                          <SelectItem value="active">Active Subscribers</SelectItem>
                          <SelectItem value="inactive">Inactive Subscribers</SelectItem>
                          <SelectItem value="custom">Custom Segment</SelectItem>
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
                  control={form.control}
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
                        disabled={!form.getValues('testEmails')}
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
                  control={form.control}
                  name="scheduledFor"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Schedule Send Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                  form.reset()
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
                  disabled={status === 'loading'}
                >
                  Save Draft
                </Button>
                <Button 
                  type="submit" 
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {form.getValues('scheduledFor') ? 'Schedule Campaign' : 'Send Campaign'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 