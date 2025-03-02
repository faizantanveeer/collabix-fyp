export interface Collaboration {
  campaign: string;
  status: string;
  budget: number;
}

export interface UserData {
  collaborations: {
    active: any[];
    completed: any[];
    pending: any[];
  };
  messages: any[];
  notifications: any[];
  paymentMethods: any[];
  payments: any[];
  profile: {
    id: string;
    averageRating: number;
    companyName: string;
    email: string;
    industry: string;
    name: string;
    role: 'influencer' | 'business';
    socialLinks: any[];
    totalFollowers: number;
    website: string;
  };
} 