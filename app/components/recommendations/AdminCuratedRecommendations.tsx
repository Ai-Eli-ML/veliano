
'use client';

import { type FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCuratedRecommendation, updateCuratedRecommendation, deleteCuratedRecommendation } from '@/actions/recommendations';
import { useToast } from '@/components/ui/use-toast';
import { ProductSearch } from '@/components/product/ProductSearch';
import { type Product } from '@/types/product';
import { type CuratedRecommendationWithDetails } from '@/types/recommendations';

interface AdminCuratedRecommendationsProps {
  productId: string;
  initialRecommendations: CuratedRecommendationWithDetails[];
}

export const AdminCuratedRecommendations: FC<AdminCuratedRecommendationsProps> = ({
  productId,
  initialRecommendations
}) => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<CuratedRecommendationWithDetails[]>(initialRecommendations);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [position, setPosition] = useState(recommendations.length + 1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddRecommendation = async () => {
    if (!selectedProduct) {
      toast({
        title: 'Error',
        description: 'Please select a product to recommend',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createCuratedRecommendation({
        product_id: productId,
        recommended_product_id: selectedProduct.id,
        position: position
      });
      
      if (result.success) {
        // Add the new recommendation to the list
        setRecommendations([
          ...recommendations,
          {
            ...result.data,
            recommended_product: selectedProduct
          } as CuratedRecommendationWithDetails
        ]);
        
        // Reset form
        setSelectedProduct(null);
        setPosition(recommendations.length + 2);
        
        toast({
          title: 'Success',
          description: 'Recommendation added successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add recommendation',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpdatePosition = async (id: string, newPosition: number) => {
    try {
      const result = await updateCuratedRecommendation({
        id,
        position: newPosition
      });
      
      if (result.success) {
        // Update the recommendation in the list
        setRecommendations(
          recommendations.map(rec => 
            rec.id === id ? { ...rec, position: newPosition } : rec
          )
        );
        
        toast({
          title: 'Success',
          description: 'Position updated successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to update position',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteRecommendation = async (id: string) => {
    try {
      const result = await deleteCuratedRecommendation(id);
      
      if (result.success) {
        // Remove the recommendation from the list
        setRecommendations(recommendations.filter(rec => rec.id !== id));
        
        toast({
          title: 'Success',
          description: 'Recommendation deleted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to delete recommendation',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Curated Product Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current recommendations table */}
        <div>
          <h3 className="text-lg font-medium mb-2">Current Recommendations</h3>
          {recommendations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recommendations
                  .sort((a, b) => a.position - b.position)
                  .map((recommendation) => (
                    <TableRow key={recommendation.id}>
                      <TableCell>
                        {recommendation.recommended_product.name}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={recommendation.position}
                          min={1}
                          className="w-20"
                          onChange={(e) => {
                            const newPosition = parseInt(e.target.value);
                            if (newPosition > 0) {
                              handleUpdatePosition(recommendation.id, newPosition);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRecommendation(recommendation.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-gray-500">No recommendations added yet.</p>
          )}
        </div>
        
        {/* Add new recommendation form */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">Add New Recommendation</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Product
              </label>
              <ProductSearch
                onSelectProduct={setSelectedProduct}
                selectedProduct={selectedProduct}
                excludeIds={[productId, ...recommendations.map(r => r.recommended_product_id)]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Position
              </label>
              <Input
                type="number"
                value={position}
                min={1}
                onChange={(e) => setPosition(parseInt(e.target.value))}
                className="w-32"
              />
            </div>
            
            <Button
              onClick={handleAddRecommendation}
              disabled={isSubmitting || !selectedProduct}
            >
              {isSubmitting ? 'Adding...' : 'Add Recommendation'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
