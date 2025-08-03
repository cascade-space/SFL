import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User';
import { Company } from '../src/models/Company';
import { UserRole, UserStatus, CompanyStatus } from '../src/types';
import { logger } from '../src/utils/logger';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env['MONGODB_URI'];

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

// Sample data
const sampleCompanies = [
  {
    name: 'Sangam Fasteners Pvt Ltd',
    industry: 'Manufacturing',
    status: CompanyStatus.ACTIVE,
    address: {
      street: '123 Industrial Park Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '400001'
    },
    contact: {
      email: 'admin@sangamfasteners.com',
      phone: '+91-22-12345678',
      website: 'https://sangamfasteners.com'
    },
    settings: {
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      modules: {
        admin: true,
        supervisor: true,
        employee: true,
        quality: true,
        maintenance: true,
        reports: true
      },
      features: {
        multiStageProduction: true,
        realTimeTracking: true,
        qualityControl: true,
        maintenanceScheduling: true
      }
    },
    subscription: {
      plan: 'enterprise',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  },
  {
    name: 'Tech Manufacturing Solutions',
    industry: 'Electronics',
    status: CompanyStatus.ACTIVE,
    address: {
      street: '456 Innovation Drive',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      zipCode: '560001'
    },
    contact: {
      email: 'admin@techmanufacturing.com',
      phone: '+91-80-87654321',
      website: 'https://techmanufacturing.com'
    },
    settings: {
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      modules: {
        admin: true,
        supervisor: true,
        employee: true,
        quality: true,
        maintenance: true,
        reports: true
      },
      features: {
        multiStageProduction: true,
        realTimeTracking: true,
        qualityControl: true,
        maintenanceScheduling: true
      }
    },
    subscription: {
      plan: 'professional',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  }
];

const sampleUsers = [
  // Super Admin (Cascated Solutions)
  {
    email: 'superadmin@cascatedsolutions.com',
    password: 'SuperAdmin123!',
    firstName: 'Super',
    lastName: 'Admin',
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  },
  // Sangam Fasteners Users
  {
    email: 'admin@sangamfasteners.com',
    password: 'Admin123!',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    department: 'Management',
    position: 'Factory Manager',
    phone: '+91-9876543210',
    emailVerified: true,
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: true
      }
    }
  },
  {
    email: 'supervisor@sangamfasteners.com',
    password: 'Supervisor123!',
    firstName: 'Priya',
    lastName: 'Sharma',
    role: UserRole.SUPERVISOR,
    status: UserStatus.ACTIVE,
    department: 'Production',
    position: 'Production Supervisor',
    phone: '+91-9876543211',
    emailVerified: true,
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  },
  {
    email: 'employee1@sangamfasteners.com',
    password: 'Employee123!',
    firstName: 'Amit',
    lastName: 'Patel',
    role: UserRole.EMPLOYEE,
    status: UserStatus.ACTIVE,
    department: 'Production',
    position: 'Machine Operator',
    phone: '+91-9876543212',
    emailVerified: true,
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: false,
        push: true,
        sms: false
      }
    }
  },
  {
    email: 'employee2@sangamfasteners.com',
    password: 'Employee123!',
    firstName: 'Sneha',
    lastName: 'Verma',
    role: UserRole.EMPLOYEE,
    status: UserStatus.ACTIVE,
    department: 'Quality Control',
    position: 'Quality Inspector',
    phone: '+91-9876543213',
    emailVerified: true,
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        sms: false
      }
    }
  },
  // Tech Manufacturing Users
  {
    email: 'admin@techmanufacturing.com',
    password: 'Admin123!',
    firstName: 'Arun',
    lastName: 'Reddy',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    department: 'Management',
    position: 'Operations Manager',
    phone: '+91-9876543214',
    emailVerified: true,
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: true
      }
    }
  },
  {
    email: 'supervisor@techmanufacturing.com',
    password: 'Supervisor123!',
    firstName: 'Kavya',
    lastName: 'Iyer',
    role: UserRole.SUPERVISOR,
    status: UserStatus.ACTIVE,
    department: 'Assembly',
    position: 'Assembly Supervisor',
    phone: '+91-9876543215',
    emailVerified: true,
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    }
  },
  {
    email: 'employee1@techmanufacturing.com',
    password: 'Employee123!',
    firstName: 'Rahul',
    lastName: 'Singh',
    role: UserRole.EMPLOYEE,
    status: UserStatus.ACTIVE,
    department: 'Assembly',
    position: 'Assembly Worker',
    phone: '+91-9876543216',
    emailVerified: true,
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: false,
        push: true,
        sms: false
      }
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI!);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Company.deleteMany({});
    logger.info('Cleared existing data');

    // Create companies
    const createdCompanies = [];
    for (const companyData of sampleCompanies) {
      const company = new Company(companyData);
      await company.save();
      createdCompanies.push(company);
      logger.info(`Created company: ${company.name}`);
    }

    // Create users
    let userIndex = 0;
    for (const userData of sampleUsers) {
      const user = new User({
        ...userData,
        companyId: userData.role === UserRole.SUPER_ADMIN 
          ? null 
          : createdCompanies[userIndex < 4 ? 0 : 1]?._id // Assign to appropriate company
      });
      await user.save();
      logger.info(`Created user: ${user.email} (${user.role})`);
      userIndex++;
    }

    logger.info('Database seeding completed successfully');
    
    // Display summary
    const userCount = await User.countDocuments();
    const companyCount = await Company.countDocuments();
    
    console.log('\n=== SEEDING SUMMARY ===');
    console.log(`Companies created: ${companyCount}`);
    console.log(`Users created: ${userCount}`);
    console.log('\n=== SAMPLE LOGIN CREDENTIALS ===');
    console.log('Super Admin: superadmin@cascatedsolutions.com / SuperAdmin123!');
    console.log('Sangam Admin: admin@sangamfasteners.com / Admin123!');
    console.log('Sangam Supervisor: supervisor@sangamfasteners.com / Supervisor123!');
    console.log('Sangam Employee: employee1@sangamfasteners.com / Employee123!');
    console.log('Tech Admin: admin@techmanufacturing.com / Admin123!');
    console.log('Tech Supervisor: supervisor@techmanufacturing.com / Supervisor123!');
    console.log('Tech Employee: employee1@techmanufacturing.com / Employee123!');

  } catch (error) {
    logger.error('Error seeding database:', error);
    console.error('Error seeding database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    logger.info('Database connection closed');
    process.exit(0);
  }
}

// Run the seeding
seedDatabase(); 