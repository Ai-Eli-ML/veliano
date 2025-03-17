"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, Save, Search, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

// Define the form schema with Zod
const formSchema = z.object({
  customer_id: z.string().optional(),
  customer_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(10, "Phone number is required"),
  
  // Teeth selection
  teeth_selection: z.array(z.string()).min(1, "Select at least one tooth"),
  
  // Material and specifications
  material: z.string().min(1, "Material is required"),
  design_details: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  estimated_completion_date: z.date().optional(),
  
  // Additional information
  notes: z.string().optional(),
  send_impression_kit: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

// Mock data for existing customers
const mockCustomers = [
  { id: "cust_123", name: "James Wilson", email: "james.wilson@example.com", phone: "(555) 123-4567" },
  { id: "cust_124", name: "Sophia Johnson", email: "sophia.johnson@example.com", phone: "(555) 234-5678" },
  { id: "cust_125", name: "Michael Davis", email: "michael.davis@example.com", phone: "(555) 345-6789" },
]

const materials = [
  { id: "gold-10k", name: "10K Gold" },
  { id: "gold-14k", name: "14K Gold" },
  { id: "gold-18k", name: "18K Gold" },
  { id: "white-gold", name: "White Gold" },
  { id: "rose-gold", name: "Rose Gold" },
  { id: "platinum", name: "Platinum" },
  { id: "silver", name: "Silver" },
  { id: "gold-diamond", name: "Gold with Diamonds" },
]

export default function NewCustomOrderPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCustomerSearch, setShowCustomerSearch] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teeth_selection: [],
      material: "",
      price: 0,
      send_impression_kit: true,
    },
  })
  
  // Filter customers based on search query
  const filteredCustomers = mockCustomers.filter(customer => {
    const query = searchQuery.toLowerCase()
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    )
  })
  
  // Handle customer selection
  const selectCustomer = (customer: typeof mockCustomers[0]) => {
    setSelectedCustomerId(customer.id)
    form.setValue("customer_id", customer.id)
    form.setValue("customer_name", customer.name)
    form.setValue("customer_email", customer.email)
    form.setValue("customer_phone", customer.phone)
    setShowCustomerSearch(false)
  }
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    setIsLoading(true)
    
    // In a real implementation, this would send the data to the API
    setTimeout(() => {
      console.log("Form data:", data)
      
      toast.success("Custom order created successfully!")
      setIsLoading(false)
      router.push("/admin/custom-orders")
    }, 1000)
  }
  
  // Reset customer fields when "Add New Customer" is clicked
  const resetCustomerFields = () => {
    setSelectedCustomerId(null)
    form.setValue("customer_id", undefined)
    form.setValue("customer_name", "")
    form.setValue("customer_email", "")
    form.setValue("customer_phone", "")
    setShowCustomerSearch(false)
  }
  
  // Handle tooth selection
  const toggleTooth = (toothId: string) => {
    const currentSelection = form.getValues("teeth_selection")
    if (currentSelection.includes(toothId)) {
      form.setValue(
        "teeth_selection",
        currentSelection.filter(id => id !== toothId)
      )
    } else {
      form.setValue("teeth_selection", [...currentSelection, toothId])
    }
  }
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" className="mr-4" asChild>
          <Link href="/admin/custom-orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Custom Orders
          </Link>
        </Button>
        
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create New Custom Order</h1>
          <p className="text-muted-foreground">
            Create a new custom grillz order for a customer
          </p>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Select an existing customer or add a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search Existing Customers
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetCustomerFields}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Customer
                </Button>
              </div>
              
              {showCustomerSearch && (
                <Card className="mt-2">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <Input
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="max-h-[200px] overflow-y-auto border rounded-md">
                        {filteredCustomers.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            No customers found
                          </div>
                        ) : (
                          <div className="divide-y">
                            {filteredCustomers.map((customer) => (
                              <div
                                key={customer.id}
                                className={`flex justify-between items-center p-3 cursor-pointer hover:bg-muted ${
                                  selectedCustomerId === customer.id
                                    ? "bg-muted"
                                    : ""
                                }`}
                                onClick={() => selectCustomer(customer)}
                              >
                                <div>
                                  <p className="font-medium">{customer.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {customer.email} · {customer.phone}
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    selectCustomer(customer)
                                  }}
                                >
                                  Select
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Email Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Teeth Selection & Specifications</CardTitle>
              <CardDescription>
                Select teeth and specify materials for the custom grillz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="teeth_selection"
                render={() => (
                  <FormItem>
                    <FormLabel>Select Teeth</FormLabel>
                    <FormDescription>
                      Click on teeth to select them for the custom grillz
                    </FormDescription>
                    <div className="mt-2">
                      <p className="mb-1 text-sm text-muted-foreground">Top Row</p>
                      <div className="grid grid-cols-12 gap-1">
                        {Array.from({ length: 12 }).map((_, i) => {
                          const toothId = `top-${6-i}`
                          const isSelected = form.getValues("teeth_selection").includes(toothId)
                          return (
                            <div 
                              key={`top-${i}`} 
                              className={`h-10 border rounded-sm flex items-center justify-center cursor-pointer ${
                                isSelected ? 'bg-primary/10 border-primary' : 'bg-muted hover:bg-muted/80'
                              }`}
                              onClick={() => toggleTooth(toothId)}
                            >
                              {i+1}
                            </div>
                          )
                        })}
                      </div>
                      <p className="mt-3 mb-1 text-sm text-muted-foreground">Bottom Row</p>
                      <div className="grid grid-cols-12 gap-1">
                        {Array.from({ length: 12 }).map((_, i) => {
                          const toothId = `bottom-${i+1}`
                          const isSelected = form.getValues("teeth_selection").includes(toothId)
                          return (
                            <div 
                              key={`bottom-${i}`} 
                              className={`h-10 border rounded-sm flex items-center justify-center cursor-pointer ${
                                isSelected ? 'bg-primary/10 border-primary' : 'bg-muted hover:bg-muted/80'
                              }`}
                              onClick={() => toggleTooth(toothId)}
                            >
                              {i+1}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {materials.map((material) => (
                            <SelectItem key={material.id} value={material.name}>
                              {material.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5">$</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="pl-7"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="design_details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter specific design requirements, styles, patterns, etc."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="estimated_completion_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Estimated Completion Date</FormLabel>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="send_impression_kit"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Send Impression Kit
                        </FormLabel>
                        <FormDescription>
                          Automatically send an impression kit to the customer
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes or special instructions"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto" disabled={isLoading}>
                {isLoading ? (
                  "Creating Order..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Custom Order
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
} 