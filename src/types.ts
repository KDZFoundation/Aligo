export type UserRole = 'ngo' | 'business' | 'admin';

export interface Badge {
  id: string;
  type: 'stakeholders' | 'volunteers' | 'employee_volunteering' | 'payroll' | 'sponsoring' | 'donations' | 'crm' | 'charity' | 'csr_eco' | 'csr_social';
  label: string;
  value?: string | number;
  level?: 'gold' | 'silver' | 'platinum' | 'none';
}

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  profileType: 'basic' | 'extended';
  
  // Basic Info
  nip: string;
  organizationName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  county: string;
  voivodeship: string;
  firstName: string;
  lastName: string;
  phone: string;
  
  // Extended Info (NGO & Business)
  completedProjectsCount?: number;
  ongoingProjectsCount?: number;
  platformProjectsCount?: number;
  foundationDate?: string; // For NGO
  socialActivityStartDate?: string; // For Business
  industry?: string[];
  communicatorConsent?: boolean;
  
  // Gamification
  badges?: Badge[];
  
  createdAt: any;
}

export type ProjectStatus = 'planned' | 'in-progress' | 'completed';

export interface Project {
  id?: string;
  title: string;
  titleEn?: string;
  assumptions: string;
  assumptionsEn?: string;
  effect: string;
  effectEn?: string;
  deadline: string;
  status: ProjectStatus;
  ownerId: string;
  ownerName: string;
  category?: 'Edukacja' | 'Ekologia' | 'Pomoc Społeczna' | 'Kultura' | 'Zdrowie' | 'Inne';
  categoryEn?: string;
  contributionValue?: number;
  imageUrl?: string;
  
  // Engagement
  interestedBusinesses?: string[]; // Array of business UIDs
  confirmedBusinesses?: string[]; // Array of business UIDs
  negativeFeedbackCount?: number;
  
  // Contract
  contractGenerated?: boolean;
  contractDate?: any;
  
  createdAt: any;
  updatedAt?: any;
}

export interface ProjectInterest {
  projectId: string;
  businessId: string;
  businessName: string;
  description: string;
  createdAt: any;
}

export interface ChatMessage {
  id?: string;
  projectId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: any;
}

export interface AnnualReport {
  year: number;
  organizationName: string;
  totalProjects: number;
  completedProjects: number;
  ongoingProjects: number;
  totalSupportValue?: number;
  csrImpactDescription?: string; // Added field for CSR impact
  generatedAt: any;
}
