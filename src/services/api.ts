/**
 * Replace MockSansthaApi with HttpSansthaApi when Spring Boot is available.
 * Payment creation deliberately only creates an order; browser-side success is
 * never treated as a verified payment.
 */
export type FundraisingSummary = {
  target: number;
  raised: number;
  utilized: number;
  donorCount: number;
};

export type DonationDraft = {
  amount: number;
  donor: { name: string; mobile: string; email: string; city: string };
  anonymous: boolean;
};

export type DonationOrder = {
  id: string;
  status: 'INITIATED' | 'PAYMENT_PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  gatewayRedirectUrl?: string;
};

export interface SansthaApi {
  getFundraisingSummary(): Promise<FundraisingSummary>;
  createDonation(draft: DonationDraft): Promise<DonationOrder>;
  getDonation(id: string): Promise<DonationOrder>;
}

export class MockSansthaApi implements SansthaApi {
  async getFundraisingSummary(): Promise<FundraisingSummary> {
    return { target: 100000000, raised: 37500000, utilized: 14200000, donorCount: 12450 };
  }
  async createDonation(_draft: DonationDraft): Promise<DonationOrder> {
    return { id: `DON-${Date.now()}`, status: 'INITIATED' };
  }
  async getDonation(id: string): Promise<DonationOrder> {
    return { id, status: 'PAYMENT_PENDING' };
  }
}

export class HttpSansthaApi implements SansthaApi {
  constructor(private readonly baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api') {}
  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
    if (!response.ok) throw new Error(`API request failed (${response.status})`);
    return response.json() as Promise<T>;
  }
  getFundraisingSummary() { return this.request<FundraisingSummary>('/transparency'); }
  createDonation(draft: DonationDraft) { return this.request<DonationOrder>('/donations', { method: 'POST', body: JSON.stringify(draft) }); }
  getDonation(id: string) { return this.request<DonationOrder>(`/donations/${encodeURIComponent(id)}`); }
}

export const sansthaApi: SansthaApi = new MockSansthaApi();
