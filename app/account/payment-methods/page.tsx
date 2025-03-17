import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Methods | Veliano Jewelry",
  description: "Manage your saved payment methods for faster checkout.",
};

export default function PaymentMethodsPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground mt-2">
            Manage your saved payment methods for faster checkout.
          </p>
        </div>

        <div className="space-y-6">
          {/* Saved Payment Methods */}
          <div className="border rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Payment Methods</h2>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4">
                Add New Payment Method
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Credit Card */}
              <div className="border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md flex items-center justify-center text-white font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                      Default
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="text-sm text-muted-foreground hover:text-foreground">Edit</button>
                      <span className="text-muted-foreground">|</span>
                      <button className="text-sm text-destructive hover:text-destructive/80">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Another Credit Card */}
              <div className="border rounded-md p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-md flex items-center justify-center text-white font-bold">
                      MC
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 5555</p>
                      <p className="text-sm text-muted-foreground">Expires 08/24</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="text-sm text-primary hover:underline">Set as Default</button>
                    <span className="text-muted-foreground">|</span>
                    <button className="text-sm text-muted-foreground hover:text-foreground">Edit</button>
                    <span className="text-muted-foreground">|</span>
                    <button className="text-sm text-destructive hover:text-destructive/80">Remove</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add New Payment Method Form */}
          <div className="border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold">Add New Payment Method</h2>
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cardNumber" className="text-sm font-medium">Card Number</label>
                <input 
                  id="cardNumber" 
                  type="text" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="expiryDate" className="text-sm font-medium">Expiry Date</label>
                  <input 
                    id="expiryDate" 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cvv" className="text-sm font-medium">CVV</label>
                  <input 
                    id="cvv" 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="nameOnCard" className="text-sm font-medium">Name on Card</label>
                <input 
                  id="nameOnCard" 
                  type="text" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input 
                    id="setDefault" 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="setDefault" className="text-sm">Set as default payment method</label>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input 
                    id="saveCard" 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    defaultChecked
                  />
                  <label htmlFor="saveCard" className="text-sm">Save card for future purchases</label>
                </div>
              </div>
              
              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                >
                  Add Payment Method
                </button>
              </div>
            </form>
          </div>
          
          {/* Billing Address */}
          <div className="border rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Billing Address</h2>
              <button className="text-sm text-primary hover:underline">Edit</button>
            </div>
            
            <div className="space-y-1">
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-muted-foreground">123 Main Street</p>
              <p className="text-sm text-muted-foreground">Apt 4B</p>
              <p className="text-sm text-muted-foreground">New York, NY 10001</p>
              <p className="text-sm text-muted-foreground">United States</p>
              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
            </div>
            
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <input 
                  id="sameAsShipping" 
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  defaultChecked
                />
                <label htmlFor="sameAsShipping" className="text-sm">Same as shipping address</label>
              </div>
            </div>
          </div>
          
          {/* Payment Security */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Payment Security</h2>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your payment information is securely stored and processed. We use industry-standard encryption to protect your sensitive data.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <p className="text-sm">All transactions are secure and encrypted</p>
              </div>
              
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <p className="text-sm">Personal information is never shared with merchants</p>
              </div>
              
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
                <p className="text-sm">Fraud monitoring and buyer protection included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 