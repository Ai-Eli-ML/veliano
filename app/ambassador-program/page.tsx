import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, ArrowRight, Instagram, TwitterIcon as TikTok, Youtube } from "lucide-react"

export const metadata = {
  title: "Ambassador Program",
  description: "Join our Ambassador Program and earn commissions by promoting our products",
}

export default function AmbassadorProgramPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Join Our <span className="gold-text">Ambassador Program</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">
          Represent our brand, share exclusive discounts, and earn commissions on every sale you generate.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/account/ambassador">
              Apply Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="#how-it-works">Learn More</a>
          </Button>
        </div>
      </div>

      {/* Featured Ambassadors */}
      <div className="mt-20">
        <h2 className="text-center text-3xl font-bold">Our Featured Ambassadors</h2>
        <p className="mt-4 text-center text-muted-foreground">
          Join our community of influencers and brand representatives
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((ambassador) => (
            <Card key={ambassador} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={`/placeholder.svg?height=400&width=400&text=Ambassador+${ambassador}`}
                  alt={`Ambassador ${ambassador}`}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold">Ambassador Name</h3>
                <div className="mt-2 flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  <TikTok className="h-4 w-4" />
                  <Youtube className="h-4 w-4" />
                </div>
                <p className="mt-4 text-muted-foreground">
                  "I love representing Custom Gold Grillz and sharing their amazing products with my followers!"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="mt-20 scroll-mt-20">
        <h2 className="text-center text-3xl font-bold">How It Works</h2>
        <p className="mt-4 text-center text-muted-foreground">Becoming an ambassador is easy and rewarding</p>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Apply",
              description: "Fill out our application form with your social media profiles and why you want to join.",
            },
            {
              title: "Get Approved",
              description: "Our team will review your application and approve you if you're a good fit.",
            },
            {
              title: "Start Earning",
              description: "Share your unique discount code and earn commissions on every sale you generate.",
            },
          ].map((step, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-20">
        <h2 className="text-center text-3xl font-bold">Ambassador Benefits</h2>
        <p className="mt-4 text-center text-muted-foreground">
          Enjoy exclusive perks and rewards as part of our program
        </p>

        <div className="mt-10">
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Benefits</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              <TabsTrigger value="perks">Exclusive Perks</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Earn Commissions</CardTitle>
                    <CardDescription>Get paid for every sale you generate</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">15% Base Commission</p>
                        <p className="text-sm text-muted-foreground">
                          Earn 15% on every sale made with your discount code
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Tiered Commission Structure</p>
                        <p className="text-sm text-muted-foreground">Earn up to 25% as you reach higher sales tiers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Monthly Payouts</p>
                        <p className="text-sm text-muted-foreground">
                          Get paid reliably every month via PayPal or bank transfer
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Exclusive Perks</CardTitle>
                    <CardDescription>Enjoy special benefits as an ambassador</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Free Products</p>
                        <p className="text-sm text-muted-foreground">
                          Receive free products to showcase to your audience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Early Access</p>
                        <p className="text-sm text-muted-foreground">
                          Be the first to know about new products and collections
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Ambassador Community</p>
                        <p className="text-sm text-muted-foreground">Connect with other ambassadors and share tips</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="commissions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Structure</CardTitle>
                  <CardDescription>Our tiered commission structure rewards your growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="py-4 text-left font-medium">Tier</th>
                          <th className="py-4 text-left font-medium">Monthly Sales</th>
                          <th className="py-4 text-left font-medium">Commission Rate</th>
                          <th className="py-4 text-left font-medium">Additional Benefits</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-4">Bronze</td>
                          <td className="py-4">$0 - $1,000</td>
                          <td className="py-4">15%</td>
                          <td className="py-4">Basic ambassador perks</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-4">Silver</td>
                          <td className="py-4">$1,001 - $3,000</td>
                          <td className="py-4">18%</td>
                          <td className="py-4">+ Quarterly free product</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-4">Gold</td>
                          <td className="py-4">$3,001 - $5,000</td>
                          <td className="py-4">20%</td>
                          <td className="py-4">+ Monthly free product</td>
                        </tr>
                        <tr>
                          <td className="py-4">Diamond</td>
                          <td className="py-4">$5,001+</td>
                          <td className="py-4">25%</td>
                          <td className="py-4">+ Custom collaboration opportunity</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="perks" className="mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: "Free Products",
                    description: "Receive free products based on your tier level to showcase to your audience.",
                  },
                  {
                    title: "Early Access",
                    description: "Get early access to new product launches and limited edition collections.",
                  },
                  {
                    title: "Ambassador Community",
                    description: "Join our exclusive community to connect with other ambassadors.",
                  },
                  {
                    title: "Professional Photos",
                    description: "Access to professional product photos for your social media content.",
                  },
                  {
                    title: "Featured Promotion",
                    description: "Opportunity to be featured on our official social media and website.",
                  },
                  {
                    title: "Custom Collaborations",
                    description: "Top-tier ambassadors can collaborate on custom product designs.",
                  },
                ].map((perk, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-bold">{perk.title}</h3>
                      <p className="mt-2 text-muted-foreground">{perk.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <h2 className="text-center text-3xl font-bold">Frequently Asked Questions</h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            {
              question: "Who can apply to be an ambassador?",
              answer:
                "Anyone with an active social media presence and a passion for our products can apply. We look for authentic individuals who align with our brand values.",
            },
            {
              question: "How do I track my sales and commissions?",
              answer:
                "Once approved, you'll have access to an ambassador dashboard where you can track all your sales, commissions, and performance metrics in real-time.",
            },
            {
              question: "When and how do I get paid?",
              answer:
                "Commissions are paid monthly for all sales from the previous month. You can choose to receive payments via PayPal or direct bank transfer.",
            },
            {
              question: "Do I need to purchase products to be an ambassador?",
              answer:
                "No, there's no purchase requirement to join. However, having experience with our products helps you create authentic content.",
            },
            {
              question: "How long does the application process take?",
              answer:
                "We typically review applications within 3-5 business days. You'll receive an email notification once your application has been reviewed.",
            },
            {
              question: "Can I be both an affiliate and an ambassador?",
              answer:
                "Yes, you can participate in both programs. The affiliate program is more focused on link sharing, while the ambassador program involves more brand representation.",
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-20 rounded-lg bg-muted p-8 text-center">
        <h2 className="text-3xl font-bold">Ready to Join?</h2>
        <p className="mt-4 text-muted-foreground">
          Apply today and start earning commissions while representing a brand you love.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/account/ambassador">
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

