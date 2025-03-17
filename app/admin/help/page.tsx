import React from "react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Help Center | Veliano Jewelry",
  description: "Get help and support for the Veliano Jewelry admin dashboard.",
};

export default function AdminHelpPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Help Center</h1>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions and learn how to use the admin dashboard effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Getting Started</h2>
                <p className="text-sm text-muted-foreground">Learn the basics of the admin dashboard.</p>
              </div>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Dashboard Overview</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    The dashboard provides a quick overview of your store's performance, recent orders, and important metrics.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>View sales analytics and trends</li>
                    <li>Monitor recent orders and their status</li>
                    <li>Track inventory levels and low stock alerts</li>
                    <li>See customer activity and engagement metrics</li>
                  </ul>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Managing Products</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Learn how to add, edit, and organize your product catalog.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Create new products with detailed information</li>
                    <li>Organize products into categories</li>
                    <li>Manage product variants and options</li>
                    <li>Set up pricing, inventory, and shipping details</li>
                  </ul>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Processing Orders</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Understand the order management workflow.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>View and filter orders by status</li>
                    <li>Process payments and refunds</li>
                    <li>Update order status and send notifications</li>
                    <li>Generate shipping labels and track shipments</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Customer Management</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Manage your customer database and communications.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>View customer profiles and purchase history</li>
                    <li>Manage customer groups and segments</li>
                    <li>Handle customer support requests</li>
                    <li>Create and send targeted communications</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Advanced Features</h2>
                <p className="text-sm text-muted-foreground">Explore advanced functionality of the admin dashboard.</p>
              </div>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Custom Orders</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Learn how to manage custom jewelry orders and design requests.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Create and track custom order requests</li>
                    <li>Manage design approvals and revisions</li>
                    <li>Set up custom pricing and payment schedules</li>
                    <li>Track production status and timelines</li>
                  </ul>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Discount and Promotion Management</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Set up and manage various types of discounts and promotions.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Create coupon codes with various conditions</li>
                    <li>Set up automatic discounts based on cart value</li>
                    <li>Schedule time-limited promotions</li>
                    <li>Track promotion performance and ROI</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Reports and Analytics</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Generate and interpret various reports to gain insights into your business.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Sales reports by product, category, or time period</li>
                    <li>Customer acquisition and retention metrics</li>
                    <li>Inventory valuation and turnover reports</li>
                    <li>Marketing campaign performance analysis</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Troubleshooting</h2>
                <p className="text-sm text-muted-foreground">Common issues and their solutions.</p>
              </div>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Payment Processing Issues</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Troubleshoot common payment processing problems.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Failed payment authorizations</li>
                    <li>Payment gateway connection errors</li>
                    <li>Refund processing delays</li>
                    <li>Currency conversion issues</li>
                  </ul>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Inventory Discrepancies</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Resolve inventory tracking and management issues.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Stock count discrepancies</li>
                    <li>Overselling prevention</li>
                    <li>Inventory adjustment procedures</li>
                    <li>Synchronization with physical inventory</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Order Status Updates</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Fix issues with order status updates and notifications.
                  </p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Manual order status override</li>
                    <li>Resending order confirmation emails</li>
                    <li>Fixing tracking number issues</li>
                    <li>Resolving fulfillment delays</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Quick Links</h2>
                <p className="text-sm text-muted-foreground">Frequently accessed resources.</p>
              </div>
              
              <div className="space-y-2">
                <Link href="/admin" className="block text-primary hover:underline">
                  Dashboard
                </Link>
                <Link href="/admin/products" className="block text-primary hover:underline">
                  Products
                </Link>
                <Link href="/admin/orders" className="block text-primary hover:underline">
                  Orders
                </Link>
                <Link href="/admin/customers" className="block text-primary hover:underline">
                  Customers
                </Link>
                <Link href="/admin/custom-orders" className="block text-primary hover:underline">
                  Custom Orders
                </Link>
                <Link href="/admin/settings" className="block text-primary hover:underline">
                  Settings
                </Link>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Video Tutorials</h2>
                <p className="text-sm text-muted-foreground">Learn visually with our tutorial videos.</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Getting Started with the Admin Dashboard</h3>
                  <p className="text-xs text-muted-foreground">Duration: 5:32</p>
                  <button className="text-primary hover:underline text-sm">Watch Now</button>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Managing Custom Jewelry Orders</h3>
                  <p className="text-xs text-muted-foreground">Duration: 8:17</p>
                  <button className="text-primary hover:underline text-sm">Watch Now</button>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Setting Up Shipping and Taxes</h3>
                  <p className="text-xs text-muted-foreground">Duration: 6:45</p>
                  <button className="text-primary hover:underline text-sm">Watch Now</button>
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Advanced Reporting Techniques</h3>
                  <p className="text-xs text-muted-foreground">Duration: 10:23</p>
                  <button className="text-primary hover:underline text-sm">Watch Now</button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Contact Support</h2>
                <p className="text-sm text-muted-foreground">Need additional help? Our support team is here for you.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="text-sm">support@velianojewelry.com</span>
                </div>
                
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full">
                  Open Support Ticket
                </button>
                
                <p className="text-xs text-muted-foreground">
                  Support hours: Monday-Friday, 9am-5pm EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 