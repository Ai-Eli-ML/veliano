import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ambassador Program Application | Veliano Jewelry",
  description: "Apply to become a Veliano Jewelry ambassador and earn rewards for promoting our products.",
};

export default function AmbassadorApplicationPage() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Ambassador Program Application</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Join our exclusive ambassador program and earn rewards while promoting Veliano Jewelry to your audience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Program Benefits */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Program Benefits</h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="7"></circle>
                      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Exclusive Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn up to 20% commission on sales generated through your unique referral link.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Free Products</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive complimentary jewelry pieces to showcase to your audience.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20"></path>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Special Discounts</h3>
                    <p className="text-sm text-muted-foreground">
                      Enjoy exclusive ambassador-only discounts on all Veliano products.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Creative Freedom</h3>
                    <p className="text-sm text-muted-foreground">
                      Express your unique style while showcasing our products in your own creative way.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Community Access</h3>
                    <p className="text-sm text-muted-foreground">
                      Join our exclusive ambassador community to network and collaborate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">Requirements</h2>
              
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Active social media presence with engaged followers</li>
                <li>Passion for jewelry and fashion</li>
                <li>Consistent posting schedule</li>
                <li>Authentic content creation</li>
                <li>Professional communication</li>
                <li>Alignment with Veliano brand values</li>
              </ul>
            </div>
          </div>
          
          {/* Application Form */}
          <div className="border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold">Application Form</h2>
            <p className="text-sm text-muted-foreground">
              Please fill out the form below to apply for our ambassador program. We'll review your application and get back to you within 5-7 business days.
            </p>
            
            <form className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                <input 
                  id="fullName" 
                  type="text" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <input 
                  id="email" 
                  type="email" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                <input 
                  id="phone" 
                  type="tel" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Social Media Platforms</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input 
                      id="instagram" 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="instagram" className="text-sm">Instagram</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      id="tiktok" 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="tiktok" className="text-sm">TikTok</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      id="youtube" 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="youtube" className="text-sm">YouTube</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      id="facebook" 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="facebook" className="text-sm">Facebook</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      id="twitter" 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="twitter" className="text-sm">Twitter</label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="instagramHandle" className="text-sm font-medium">Instagram Handle</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                    @
                  </span>
                  <input 
                    id="instagramHandle" 
                    type="text" 
                    className="flex h-10 w-full rounded-none rounded-r-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="username"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="followers" className="text-sm font-medium">Total Followers (across all platforms)</label>
                <select 
                  id="followers" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select range</option>
                  <option value="1000-5000">1,000 - 5,000</option>
                  <option value="5001-10000">5,001 - 10,000</option>
                  <option value="10001-50000">10,001 - 50,000</option>
                  <option value="50001-100000">50,001 - 100,000</option>
                  <option value="100001+">100,000+</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="experience" className="text-sm font-medium">Previous Ambassador Experience</label>
                <textarea 
                  id="experience" 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Please share any previous experience as a brand ambassador or influencer."
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="whyJoin" className="text-sm font-medium">Why do you want to join our ambassador program?</label>
                <textarea 
                  id="whyJoin" 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us why you're interested in representing Veliano Jewelry."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input 
                    id="terms" 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <label htmlFor="terms" className="text-sm">
                    I agree to the <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4 w-full"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
} 