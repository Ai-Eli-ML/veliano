"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Instagram, Twitter, Youtube, Users, Gift, DollarSign, Award } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"

export default function AmbassadorProgramPage() {
  const [activeTab, setActiveTab] = useState("overview")
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-2">Join Our Community</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Veliano Ambassador Program</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Share your passion for luxury jewelry while earning rewards and exclusive benefits.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/account/ambassador/apply">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#how-it-works">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="relative rounded-lg overflow-hidden mb-16">
        <AspectRatio ratio={21/9}>
          <img 
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2070&auto=format&fit=crop" 
            alt="Veliano Ambassador Program" 
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="text-white p-8 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Represent Luxury. Earn Rewards.</h2>
            <p className="text-lg mb-6">
              Our ambassadors are passionate about luxury jewelry and enjoy exclusive perks, early access to collections, and generous commissions.
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/account/ambassador/apply">
                Join Our Community
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader className="text-center">
            <DollarSign className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle>Earn Commissions</CardTitle>
            <CardDescription>
              Earn up to 15% commission on every sale you generate through your unique ambassador link.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Gift className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle>Exclusive Rewards</CardTitle>
            <CardDescription>
              Receive free products, early access to new collections, and exclusive ambassador-only discounts.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Users className="h-12 w-12 mx-auto text-primary mb-2" />
            <CardTitle>Join Our Community</CardTitle>
            <CardDescription>
              Connect with like-minded individuals and participate in exclusive ambassador events.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <div id="how-it-works" className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Here&apos;s how to get started as a Veliano Ambassador.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Card>
            <CardHeader className="text-center">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <CardTitle>Apply</CardTitle>
              <CardDescription>
                Fill out the ambassador application form with your information and social media details.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <CardTitle>Get Approved</CardTitle>
              <CardDescription>
                Our team will review your application and notify you within 3-5 business days.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <CardTitle>Receive Your Kit</CardTitle>
              <CardDescription>
                Get access to your ambassador dashboard, marketing materials, and unique referral links.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary">4</span>
              </div>
              <CardTitle>Start Earning</CardTitle>
              <CardDescription>
                Share your unique links and start earning commissions on every successful referral.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
      
      <div className="bg-muted rounded-lg p-8 mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Ambassador Benefits</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            As a Veliano Ambassador, you&apos;ll enjoy these exclusive benefits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4 items-start">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium mb-1">Commission Program</h3>
              <p className="text-muted-foreground">
                Earn 10-15% commission on all sales generated through your unique referral links.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium mb-1">Free Products</h3>
              <p className="text-muted-foreground">
                Receive free jewelry pieces to showcase and review on your platforms.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium mb-1">Early Access</h3>
              <p className="text-muted-foreground">
                Get first access to new collections and limited-edition pieces before public release.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium mb-1">Exclusive Discounts</h3>
              <p className="text-muted-foreground">
                Enjoy special ambassador pricing on all Veliano products for personal purchases.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium mb-1">Ambassador Community</h3>
              <p className="text-muted-foreground">
                Join our exclusive community of ambassadors for networking and collaboration opportunities.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium mb-1">Special Events</h3>
              <p className="text-muted-foreground">
                Invitations to ambassador-only events, product launches, and virtual meetups.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-lg mb-6">
          &quot;Being a Veliano ambassador has been an incredible journey. The team&apos;s support and the quality of their products make it easy to share with my followers.&quot;
        </p>
        <p className="font-semibold">- Sarah M., Fashion Influencer</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Requirements</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ambassador Requirements</CardTitle>
              <CardDescription>
                We're looking for passionate individuals who meet the following criteria.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-start">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>Active social media presence with a minimum of 1,000 followers on at least one platform</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>Genuine interest in jewelry, fashion, or luxury lifestyle content</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>Consistent and high-quality content creation</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>Engagement with your audience through comments, messages, and interactions</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <p>Alignment with Veliano's brand values and aesthetic</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/account/ambassador/apply">
                  Apply to the Program
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about the Veliano Ambassador Program.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">How do I apply to become an ambassador?</h3>
                <p className="text-muted-foreground">
                  You can apply by filling out the ambassador application form on our website. The application process requires basic information about you and your social media platforms.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">How does the commission structure work?</h3>
                <p className="text-muted-foreground">
                  Ambassadors earn 10-15% commission on all sales generated through their unique referral links. Commission rates increase based on performance and tenure in the program.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">How often will I receive free products?</h3>
                <p className="text-muted-foreground">
                  Active ambassadors receive quarterly product allocations based on performance. Top-performing ambassadors may receive additional products throughout the year.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">When and how are commissions paid?</h3>
                <p className="text-muted-foreground">
                  Commissions are calculated monthly and paid on the 15th of the following month. Payments are made via PayPal or bank transfer, with a minimum payout threshold of $50.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Can I be an ambassador if I'm outside the United States?</h3>
                <p className="text-muted-foreground">
                  Yes, our ambassador program is open to international applicants. However, certain benefits like physical product shipments may vary based on your location.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild className="w-full">
                <Link href="/contact">
                  Have More Questions? Contact Us
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="testimonials" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Ambassador Testimonials</CardTitle>
              <CardDescription>
                Hear from our current ambassadors about their experience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/45.jpg" 
                      alt="Ambassador Sarah" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah J.</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Instagram className="h-3 w-3 mr-1" />
                      <span>@luxurywithsarah</span>
                    </div>
                  </div>
                </div>
                <p className="italic">
                  "Being a Veliano ambassador has been incredible. Not only have I earned substantial commissions, but the exclusive products I've received have elevated my content. The team is supportive and always ready to help!"
                </p>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://randomuser.me/api/portraits/men/32.jpg" 
                      alt="Ambassador Marcus" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Marcus T.</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Youtube className="h-3 w-3 mr-1" />
                      <span>@MarcusStyleGuide</span>
                    </div>
                  </div>
                </div>
                <p className="italic">
                  &quot;I love representing a brand that&apos;s all about quality and style. The team is incredibly supportive.&quot;
                </p>
              </div>
              
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src="https://randomuser.me/api/portraits/women/67.jpg" 
                      alt="Ambassador Elena" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">Elena M.</h4>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Twitter className="h-3 w-3 mr-1" />
                      <span>@ElenaLuxeLife</span>
                    </div>
                  </div>
                </div>
                <p className="italic">
                  &quot;The commission structure is fantastic, and I&apos;m proud to promote products I truly believe in.&quot;
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="bg-primary/5 rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-lg mb-6">
              Apply to become a Veliano Ambassador today and start earning rewards while sharing your passion for luxury jewelry.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/account/ambassador/apply">
                  Apply Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Instagram className="h-8 w-8 text-primary" />
              </div>
              <span className="font-medium">Instagram</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Twitter className="h-8 w-8 text-primary" />
              </div>
              <span className="font-medium">Twitter</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Youtube className="h-8 w-8 text-primary" />
              </div>
              <span className="font-medium">YouTube</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <span className="font-medium">Any Platform</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 