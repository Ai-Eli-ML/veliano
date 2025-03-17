import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Settings | Veliano Jewelry",
  description: "Manage store settings, user permissions, and system configurations.",
};

export default function AdminSettingsPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure store settings, manage user permissions, and customize system configurations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Store Settings */}
          <div className="col-span-2 space-y-6">
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Store Settings</h2>
                <p className="text-sm text-muted-foreground">Configure your store's basic information and settings.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="storeName" className="text-sm font-medium">Store Name</label>
                  <input 
                    id="storeName" 
                    type="text" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="Veliano Jewelry"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="storeEmail" className="text-sm font-medium">Store Email</label>
                  <input 
                    id="storeEmail" 
                    type="email" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="info@velianojewelry.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="storePhone" className="text-sm font-medium">Store Phone</label>
                  <input 
                    id="storePhone" 
                    type="tel" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="storeAddress" className="text-sm font-medium">Store Address</label>
                  <textarea 
                    id="storeAddress" 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="123 Jewelry Lane, New York, NY 10001, United States"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="storeCurrency" className="text-sm font-medium">Default Currency</label>
                  <select 
                    id="storeCurrency" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="USD"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="storeTimezone" className="text-sm font-medium">Timezone</label>
                  <select 
                    id="storeTimezone" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="America/New_York"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 border-t flex justify-end">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                  Save Store Settings
                </button>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Shipping Settings</h2>
                <p className="text-sm text-muted-foreground">Configure shipping methods and rates.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Standard Shipping</h3>
                    <p className="text-sm text-muted-foreground">3-5 business days</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="5.99"
                    />
                    <span className="text-sm font-medium">USD</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Express Shipping</h3>
                    <p className="text-sm text-muted-foreground">1-2 business days</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="14.99"
                    />
                    <span className="text-sm font-medium">USD</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Free Shipping Threshold</h3>
                    <p className="text-sm text-muted-foreground">Orders above this amount qualify for free shipping</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="100"
                    />
                    <span className="text-sm font-medium">USD</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t flex justify-end">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                  Save Shipping Settings
                </button>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Tax Settings</h2>
                <p className="text-sm text-muted-foreground">Configure tax rates and settings.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Automatic Tax Calculation</h3>
                    <p className="text-sm text-muted-foreground">Automatically calculate taxes based on location</p>
                  </div>
                  <div className="flex h-6 items-center">
                    <input 
                      id="autoTax" 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      defaultChecked
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Default Tax Rate</h3>
                    <p className="text-sm text-muted-foreground">Applied when automatic calculation is disabled</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="8.875"
                    />
                    <span className="text-sm font-medium">%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Display Prices with Tax</h3>
                    <p className="text-sm text-muted-foreground">Show prices inclusive of tax on the storefront</p>
                  </div>
                  <div className="flex h-6 items-center">
                    <input 
                      id="taxInclusivePrices" 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t flex justify-end">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
                  Save Tax Settings
                </button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">User Permissions</h2>
                <p className="text-sm text-muted-foreground">Manage admin user roles and permissions.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Admin Users</h3>
                    <p className="text-sm text-muted-foreground">Full access to all settings</p>
                  </div>
                  <button className="text-sm text-primary hover:underline">Manage</button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Staff Users</h3>
                    <p className="text-sm text-muted-foreground">Limited access to orders and products</p>
                  </div>
                  <button className="text-sm text-primary hover:underline">Manage</button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Custom Roles</h3>
                    <p className="text-sm text-muted-foreground">Create custom permission sets</p>
                  </div>
                  <button className="text-sm text-primary hover:underline">Manage</button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">API Keys</h2>
                <p className="text-sm text-muted-foreground">Manage API keys for third-party integrations.</p>
              </div>
              
              <div className="space-y-4">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4 w-full">
                  Generate New API Key
                </button>
                
                <div className="text-sm text-muted-foreground">
                  <p>No active API keys</p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">System Information</h2>
                <p className="text-sm text-muted-foreground">View system details and status.</p>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium">1.5.2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Environment:</span>
                  <span className="font-medium">Production</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="font-medium">March 17, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database Status:</span>
                  <span className="font-medium text-green-500">Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage Status:</span>
                  <span className="font-medium text-green-500">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 