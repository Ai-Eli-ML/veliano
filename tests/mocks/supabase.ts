import { Database } from '@/types/supabase';

class MockSupabaseClient {
  private addresses: any[] = [];
  private networkError = false;

  reset() {
    this.addresses = [];
    this.networkError = false;
  }

  seedAddress(address: any) {
    this.addresses.push(address);
  }

  simulateNetworkError() {
    this.networkError = true;
  }

  resetNetworkError() {
    this.networkError = false;
  }

  // Mock Supabase methods
  from(table: string) {
    if (this.networkError) {
      return {
        select: () => Promise.reject(new Error('Network error')),
        insert: () => Promise.reject(new Error('Network error')),
        update: () => Promise.reject(new Error('Network error')),
        delete: () => Promise.reject(new Error('Network error')),
      };
    }

    return {
      select: () => Promise.resolve({ data: this.addresses, error: null }),
      insert: (address: any) => {
        const newAddress = { ...address, id: `test-${Date.now()}` };
        this.addresses.push(newAddress);
        return Promise.resolve({ data: newAddress, error: null });
      },
      update: (updates: any) => {
        this.addresses = this.addresses.map(addr => 
          addr.id === updates.id ? { ...addr, ...updates } : addr
        );
        return Promise.resolve({ data: updates, error: null });
      },
      delete: () => {
        const deletedAddress = this.addresses[0];
        this.addresses = this.addresses.slice(1);
        return Promise.resolve({ data: deletedAddress, error: null });
      },
      eq: () => ({
        single: () => Promise.resolve({ data: this.addresses[0], error: null }),
      }),
    };
  }
}

export const mockSupabaseClient = new MockSupabaseClient(); 