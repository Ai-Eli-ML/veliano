"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ShippingTabs() {
  return (
    <Tabs defaultValue="domestic" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="domestic">Domestic Shipping</TabsTrigger>
        <TabsTrigger value="international">International Shipping</TabsTrigger>
      </TabsList>
      <TabsContent value="domestic" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Domestic Shipping Options</CardTitle>
            <CardDescription>
              Shipping options for orders within the United States
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipping Method</TableHead>
                  <TableHead>Estimated Delivery</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Standard Shipping</TableCell>
                  <TableCell>5-7 business days</TableCell>
                  <TableCell className="text-right">$5.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Express Shipping</TableCell>
                  <TableCell>2-3 business days</TableCell>
                  <TableCell className="text-right">$12.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Next Day Delivery</TableCell>
                  <TableCell>Next business day</TableCell>
                  <TableCell className="text-right">$24.99</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="mt-4 text-sm text-muted-foreground">
              Free standard shipping on all orders over $100. Orders placed before 2 PM EST Monday-Friday will be processed the same day.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="international" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>International Shipping Options</CardTitle>
            <CardDescription>
              Shipping options for orders outside the United States
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipping Method</TableHead>
                  <TableHead>Estimated Delivery</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Standard International</TableCell>
                  <TableCell>10-15 business days</TableCell>
                  <TableCell className="text-right">$19.99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Express International</TableCell>
                  <TableCell>5-7 business days</TableCell>
                  <TableCell className="text-right">$39.99</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="mt-4 text-sm text-muted-foreground">
              International customers may be subject to customs fees and taxes upon delivery, which are the responsibility of the recipient.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 