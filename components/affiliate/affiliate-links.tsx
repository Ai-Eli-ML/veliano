"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink } from "lucide-react"
import { useState } from "react"

export function AffiliateLinks() {
  const [copied, setCopied] = useState<string | null>(null)
  
  // In a real app, this would come from the user's profile
  const affiliateCode = "USER123"
  const baseUrl = "https://veliano.com"
  
  const links = [
    {
      id: "homepage",
      name: "Homepage",
      url: `${baseUrl}/?ref=${affiliateCode}`,
      description: "Link to our homepage with your affiliate code",
    },
    {
      id: "products",
      name: "All Products",
      url: `${baseUrl}/products?ref=${affiliateCode}`,
      description: "Link to our products page with your affiliate code",
    },
    {
      id: "bestsellers",
      name: "Best Sellers",
      url: `${baseUrl}/products/bestsellers?ref=${affiliateCode}`,
      description: "Link to our best selling products with your affiliate code",
    },
    {
      id: "new",
      name: "New Arrivals",
      url: `${baseUrl}/products/new?ref=${affiliateCode}`,
      description: "Link to our newest products with your affiliate code",
    },
  ]
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Code</CardTitle>
          <CardDescription>
            Use this code in your marketing materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              value={affiliateCode}
              readOnly
              className="font-mono"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => copyToClipboard(affiliateCode, "code")}
            >
              {copied === "code" ? (
                <span className="text-xs">Copied!</span>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Marketing Links</CardTitle>
          <CardDescription>
            Pre-generated links with your affiliate code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="links" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="links">Quick Links</TabsTrigger>
              <TabsTrigger value="custom">Custom Link</TabsTrigger>
            </TabsList>
            
            <TabsContent value="links" className="space-y-4">
              {links.map((link) => (
                <div key={link.id} className="flex flex-col space-y-2">
                  <Label>{link.name}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={link.url}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(link.url, link.id)}
                    >
                      {copied === link.id ? (
                        <span className="text-xs">Copied!</span>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="custom">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter any URL from our website</Label>
                  <Input
                    placeholder="https://veliano.com/products/category/shoes"
                    className="font-mono"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Generated affiliate link</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${baseUrl}/products/example?ref=${affiliateCode}`}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(`${baseUrl}/products/example?ref=${affiliateCode}`, "custom")}
                    >
                      {copied === "custom" ? (
                        <span className="text-xs">Copied!</span>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button>Generate Link</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

