import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function AmbassadorContent() {
  return (
    <Tabs defaultValue="marketing">
      <TabsList>
        <TabsTrigger value="marketing">Marketing Materials</TabsTrigger>
        <TabsTrigger value="photos">Product Photos</TabsTrigger>
        <TabsTrigger value="guidelines">Content Guidelines</TabsTrigger>
      </TabsList>
      
      <TabsContent value="marketing" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Marketing Materials</CardTitle>
            <CardDescription>
              Download banners, logos, and other assets for your content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Logo Pack", description: "PNG, SVG, and EPS formats in various colors" },
                { name: "Social Media Banners", description: "Optimized for Instagram, Facebook, and Twitter" },
                { name: "Email Signature", description: "HTML and image files for your email signature" },
                { name: "Product Descriptions", description: "Copy-paste product descriptions for your content" },
                { name: "Promotional Graphics", description: "Sale announcements and special offers" },
                { name: "Video Assets", description: "Intros, outros, and lower thirds for videos" },
              ].map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4 aspect-video rounded-md bg-muted flex items-center justify-center">
                      <img 
                        src={`/placeholder.svg?height=120&width=240&text=${item.name}`} 
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="photos" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Photos</CardTitle>
            <CardDescription>
              High-quality product images for your social media and content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "Grillz Collection", description: "Single tooth, bottom, top, and full sets" },
                { name: "Jewelry Collection", description: "Chains, pendants, bracelets, and rings" },
                { name: "Lifestyle Photos", description: "Models wearing our products in various settings" },
                { name: "Product Details", description: "Close-up shots highlighting craftsmanship" },
                { name: "Behind the Scenes", description: "Manufacturing and design process photos" },
                { name: "Customer Testimonials", description: "Photos of happy customers with their products" },
              ].map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4 aspect-square rounded-md bg-muted flex items-center justify-center">
                      <img 
                        src={`/placeholder.svg?height=200&width=200&text=${item.name}`} 
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="guidelines" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Guidelines</CardTitle>
            <CardDescription>
              Best practices for creating effective content
            </CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none dark:prose-invert">
            <h3>Brand Voice & Messaging</h3>
            <p>
              When creating content for Veliano & Co, maintain a tone that is:
            </p>
            <ul>
              <li><strong>Authentic:</strong> Be genuine and relatable in your content</li>
              <li><strong>Aspirational:</strong> Showcase the luxury and quality of our products</li>
              <li><strong>Informative:</strong> Educate your audience about our craftsmanship and materials</li>
              <li><strong>Inclusive:</strong> Appeal to diverse audiences and styles</li>
            </ul>
            
            <h3>Content Do's and Don'ts</h3>
            
            <h4>Do:</h4>
            <ul>
              <li>Showcase the products in real-life settings</li>
              <li>Highlight the quality and craftsmanship</li>
              <li>Share your personal experience with the products</li>
              <li>Include your discount code in all promotional content</li>
              <li>Tag us in your posts so we can reshare your content</li>
            </ul>
            
            <h4>Don't:</h4>
            <ul>
              <li>Make false claims about the products or materials</li>
              <li>Use offensive language or imagery</li>
              <li>Promote competitors' products alongside ours</li>
              <li>Share your discount code with other influencers</li>
              <li>Promise unrealistic delivery times or discounts</li>
            </ul>
            
            <h3>Posting Schedule</h3>
            <p>
              For optimal engagement and sales, we recommend:
            </p>
            <ul>
              <li>2-3 Instagram posts per month featuring our products</li>
              <li>4-6 Instagram stories per month</li>
              <li>1-2 TikTok or YouTube videos per month</li>
              <li>Regular mentions in your content when relevant</li>
            </ul>
            
            <h3>Hashtags</h3>
            <p>
              Include these hashtags in your posts to increase visibility:
            </p>
            <p>
              #CustomGoldGrillz #GoldGrillz #LuxuryJewelry #CustomJewelry #GoldTeeth
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

