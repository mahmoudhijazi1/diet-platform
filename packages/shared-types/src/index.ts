export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  DIETITIAN = 'DIETITIAN',
  PATIENT = 'PATIENT',
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export enum SubscriptionType {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: UserRole;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DietitianProfileData {
  specialization: string;
  yearsOfExperience: number;
  bio?: string;
}

export interface PatientProfileData {
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  height?: number; // in cm
  weight?: number; // in kg
  dietaryPreferences?: string;
}

export * from './dtos/create-dietitian-profile.dto';
export * from './dtos/update-dietitian-profile.dto';
export * from './dtos/create-dietitian.dto';
