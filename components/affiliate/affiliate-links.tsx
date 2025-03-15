"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

interface AffiliateLinksProps {
  affiliateCode: string
}

export function AffiliateLinks({ affiliateCode }: AffiliateLinksProps) {
  const [_, copyToClipboard] = useCopyToClipboard()
  const [isCopied, setIsCopied] = useState(false)
  const [customUrl, setCustomUrl] = useState("")

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
  const defaultAffiliateLink = `${baseUrl}?ref=${affiliateCode}`
  const customAffiliateLink = customUrl ? `${customUrl}?ref=${affiliateCode}` : defaultAffiliateLink

  const popularLinks = [
    { name: "Homepage", url: `${baseUrl}?ref=${affiliateCode}` },
    { name: "Grillz Collection", url: `${baseUrl}/products/grillz?ref=${affiliateCode}` },
    { name: "Jewelry Collection", url: `${baseUrl}/products/jewelry?ref=${affiliateCode}` },
    { name: "Top Sellers", url: `${baseUrl}/products?sort=featured&ref=${affiliateCode}` },
  ]

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text)
    if (success) {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <Tabs defaultValue="links">
      <TabsList>
        <TabsTrigger value="links">Popular Links</TabsTrigger>
        <TabsTrigger value="custom">Custom Link</TabsTrigger>
        <TabsTrigger value="banners">Banners & Assets</TabsTrigger>
      </TabsList>

      <TabsContent value="links">
        <Card>
          <CardHeader>
            <CardTitle>Popular Affiliate Links</CardTitle>
            <CardDescription>Share these links with your audience to earn commissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <h3 className="font-medium">{link.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(link.url)} className="shrink-0">
                    {isCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" /> Copy Link
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="custom">
        <Card>
          <CardHeader>
            <CardTitle>Create Custom Affiliate Link</CardTitle>
            <CardDescription>Generate an affiliate link for any page on our website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="custom-url" className="mb-2 block text-sm font-medium">
                  Enter Page URL
                </label>
                <div className="flex gap-2">
                  <Input
                    id="custom-url"
                    placeholder={baseUrl}
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                  />
                  <Button variant="outline" onClick={() => setCustomUrl("")}>
                    Reset
                  </Button>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Your Affiliate Link</h3>
                <div className="flex items-center gap-2">
                  <Input value={customAffiliateLink} readOnly />
                  <Button variant="outline" onClick={() => handleCopy(customAffiliateLink)} className="shrink-0">
                    {isCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" /> Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="banners">
        <Card>
          <CardHeader>
            <CardTitle>Marketing Materials</CardTitle>
            <CardDescription>Download banners and other marketing assets to promote our products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4].map((banner) => (
                <div key={banner} className="space-y-2">
                  <div className="aspect-[2/1] overflow-hidden rounded-md border bg-muted">
                    <img
                      src={`/placeholder.svg?height=250&width=500&text=Banner+${banner}`}
                      alt={`Affiliate Banner ${banner}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Banner {banner}</span>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

