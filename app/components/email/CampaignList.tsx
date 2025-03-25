'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { sendCampaign } from '@/actions/email';
import type { EmailCampaign } from '@/types/email';

interface CampaignListProps {
  campaigns: EmailCampaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSendNow = async (campaignId: string) => {
    setIsLoading(campaignId);
    try {
      await sendCampaign(campaignId);
      toast.success('Campaign sent successfully');
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast.error('Failed to send campaign');
    } finally {
      setIsLoading(null);
    }
  };

  const getStatusBadgeColor = (status: EmailCampaign['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-500';
      case 'scheduled':
        return 'bg-blue-500';
      case 'sending':
        return 'bg-yellow-500';
      case 'sent':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Target Audience</TableHead>
            <TableHead>Scheduled For</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>{campaign.title}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(campaign.status)}>
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell>{campaign.target_audience}</TableCell>
              <TableCell>
                {campaign.scheduled_for
                  ? format(new Date(campaign.scheduled_for), 'PPp')
                  : '-'}
              </TableCell>
              <TableCell>
                {format(new Date(campaign.created_at), 'PPp')}
              </TableCell>
              <TableCell>
                {campaign.status === 'draft' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendNow(campaign.id)}
                    disabled={isLoading === campaign.id}
                  >
                    {isLoading === campaign.id ? 'Sending...' : 'Send Now'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
} 