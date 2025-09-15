// Dummy data generator for testing ID cards with compliance requirements
import { CardTemplate } from './card-templates';
import { generateOrganizationLogo, generateSignature } from './logo-signature-generator';

// Lists of realistic data
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Daniel', 'Nancy', 'Paul', 'Lisa',
  'Mark', 'Betty', 'Donald', 'Helen', 'George', 'Sandra', 'Kenneth', 'Donna',
  'Steven', 'Carol', 'Edward', 'Ruth', 'Brian', 'Sharon', 'Ronald', 'Michelle',
  'Anthony', 'Laura', 'Kevin', 'Sarah', 'Jason', 'Kimberly', 'Matthew', 'Deborah',
  'Gary', 'Jessica', 'Timothy', 'Shirley', 'Jose', 'Cynthia', 'Larry', 'Angela'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill',
  'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell',
  'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz'
];

const universities = [
  'Harvard University', 'Stanford University', 'MIT', 'Yale University',
  'Columbia University', 'Princeton University', 'University of Chicago',
  'University of Pennsylvania', 'Northwestern University', 'Duke University',
  'Johns Hopkins University', 'California Institute of Technology',
  'Dartmouth College', 'Brown University', 'University of Notre Dame',
  'Vanderbilt University', 'Cornell University', 'Rice University',
  'University of California, Berkeley', 'UCLA', 'Georgetown University',
  'University of Michigan', 'USC', 'Carnegie Mellon University',
  'University of Virginia', 'University of North Carolina', 'NYU',
  'Boston University', 'Georgia Tech', 'University of Washington'
];

const departments = [
  'Computer Science', 'Engineering', 'Business Administration', 'Mathematics',
  'Physics', 'Chemistry', 'Biology', 'Psychology', 'Economics', 'Political Science',
  'English Literature', 'History', 'Sociology', 'Philosophy', 'Art & Design',
  'Architecture', 'Medicine', 'Law', 'Education', 'Communications',
  'Environmental Science', 'Data Science', 'Artificial Intelligence', 'Robotics'
];

const courses = [
  'Bachelor of Science', 'Bachelor of Arts', 'Master of Science', 'Master of Arts',
  'Bachelor of Engineering', 'Bachelor of Business Administration', 'MBA',
  'PhD in Computer Science', 'PhD in Physics', 'Bachelor of Medicine',
  'Master of Engineering', 'Bachelor of Law', 'Master of Education',
  'Bachelor of Fine Arts', 'Master of Public Health'
];

const streets = [
  'Main Street', 'Oak Avenue', 'Maple Drive', 'Elm Street', 'Washington Boulevard',
  'University Avenue', 'College Road', 'Park Lane', 'First Street', 'Second Avenue',
  'Broadway', 'Market Street', 'Liberty Avenue', 'Central Avenue', 'Highland Road'
];

const cities = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Boston, MA', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Portland, OR', 'Atlanta, GA', 'Miami, FL', 'San Francisco, CA', 'Detroit, MI'
];

const libraryNames = [
  'Central Public Library', 'University Library', 'Metropolitan Library',
  'City Central Library', 'Academic Resource Center', 'Digital Learning Commons',
  'Research Library', 'Community Library', 'Student Learning Center'
];

const organizations = [
  'Tech Solutions Inc.', 'Global Enterprises', 'Innovation Labs', 'Future Systems',
  'Digital Dynamics', 'Smart Solutions Corp.', 'Excellence Group', 'Premier Services',
  'Advanced Technologies', 'Professional Consulting'
];

// Helper functions
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate valid date within academic year or last 90 days
function generateValidDate(type: 'issue' | 'expiry' | 'birth'): string {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  if (type === 'birth') {
    // Generate birth date between 18-25 years ago
    const age = generateRandomNumber(18, 25);
    const birthYear = currentYear - age;
    const month = generateRandomNumber(1, 12);
    const day = generateRandomNumber(1, 28);
    return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${birthYear}`;
  }
  
  if (type === 'issue') {
    // Generate date within last 90 days
    const daysAgo = generateRandomNumber(0, 89);
    const issueDate = new Date(today);
    issueDate.setDate(issueDate.getDate() - daysAgo);
    return `${(issueDate.getMonth() + 1).toString().padStart(2, '0')}/${issueDate.getDate().toString().padStart(2, '0')}/${issueDate.getFullYear()}`;
  }
  
  if (type === 'expiry') {
    // Generate date within current academic year
    // Academic year typically runs from August to May
    let academicYearEnd: Date;
    if (currentMonth >= 7) { // August or later
      academicYearEnd = new Date(currentYear + 1, 4, 31); // May 31 next year
    } else {
      academicYearEnd = new Date(currentYear, 4, 31); // May 31 this year
    }
    
    // Generate date between today and academic year end
    const daysUntilEnd = Math.floor((academicYearEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysInFuture = generateRandomNumber(30, Math.min(daysUntilEnd, 365));
    const expiryDate = new Date(today);
    expiryDate.setDate(expiryDate.getDate() + daysInFuture);
    return `${(expiryDate.getMonth() + 1).toString().padStart(2, '0')}/${expiryDate.getFullYear()}`;
  }
  
  return `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
}

function generateStudentId(): string {
  const prefix = generateRandomNumber(1000, 9999);
  const suffix = generateRandomNumber(1000, 9999);
  return `${prefix}-${suffix}`;
}

function generateEmployeeId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const prefix = letters.charAt(Math.floor(Math.random() * letters.length)) + 
                 letters.charAt(Math.floor(Math.random() * letters.length));
  const number = generateRandomNumber(10000, 99999);
  return `${prefix}${number}`;
}

function generatePhoneNumber(): string {
  const areaCode = generateRandomNumber(200, 999);
  const prefix = generateRandomNumber(200, 999);
  const lineNumber = generateRandomNumber(1000, 9999);
  return `+1 (${areaCode}) ${prefix}-${lineNumber}`;
}

function generateEmail(firstName: string, lastName: string, domain?: string): string {
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
  const emailDomain = domain || 'university.edu';
  const formats = [
    `${cleanFirst}.${cleanLast}`,
    `${cleanFirst}${cleanLast}`,
    `${cleanFirst.charAt(0)}${cleanLast}`,
    `${cleanFirst}${cleanLast}${generateRandomNumber(1, 99)}`
  ];
  return `${getRandomItem(formats)}@${emailDomain}`;
}

function generateAddress(): string {
  const number = generateRandomNumber(100, 9999);
  const street = getRandomItem(streets);
  const city = getRandomItem(cities);
  const zip = generateRandomNumber(10000, 99999);
  return `${number} ${street}, ${city} ${zip}`;
}

function getCurrentAcademicYear(): string {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  // Academic year typically starts in August
  if (currentMonth >= 7) { // August or later
    return `${currentYear}-${currentYear + 1}`;
  } else {
    return `${currentYear - 1}-${currentYear}`;
  }
}

// Enhanced dummy data with logos and signatures
export interface EnhancedDummyData {
  data: Record<string, string>;
  logo?: {
    svg: string;
    backgroundColor: string;
  };
  signature?: {
    svg: string;
  };
}

// Main generator function
export function generateDummyData(template: CardTemplate): Record<string, string> {
  const data: Record<string, string> = {};
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const fullName = `${firstName} ${lastName}`;
  
  // Generate data based on template type and fields
  template.fields.forEach(field => {
    switch (field.key) {
      // Name fields
      case 'studentName':
      case 'memberName':
      case 'employeeName':
      case 'visitorName':
        data[field.key] = fullName;
        break;
        
      // Institution/Organization fields
      case 'universityName':
      case 'organizationName':
        data[field.key] = getRandomItem(universities);
        break;
      case 'libraryName':
        data[field.key] = getRandomItem(libraryNames);
        break;
      case 'clubName':
        data[field.key] = `${getRandomItem(cities).split(',')[0]} Sports Club`;
        break;
      case 'insurerName':
        data[field.key] = `${getRandomItem(['Blue Cross', 'Aetna', 'United Health', 'Cigna', 'Kaiser'])} Health Insurance`;
        break;
        
      // ID fields
      case 'studentId':
      case 'memberId':
      case 'visitorId':
        data[field.key] = generateStudentId();
        break;
      case 'employeeId':
        data[field.key] = generateEmployeeId();
        break;
      case 'groupNumber':
        data[field.key] = `GRP${generateRandomNumber(100000, 999999)}`;
        break;
        
      // Date fields
      case 'dateOfBirth':
        data[field.key] = generateValidDate('birth');
        break;
      case 'joinDate':
      case 'visitDate':
      case 'effectiveDate':
        data[field.key] = generateValidDate('issue');
        break;
      case 'expiryDate':
      case 'validUntil':
        data[field.key] = generateValidDate('expiry');
        break;
        
      // Academic fields
      case 'course':
      case 'program':
        data[field.key] = getRandomItem(courses);
        break;
      case 'department':
        data[field.key] = getRandomItem(departments);
        break;
      case 'year':
      case 'grade':
        data[field.key] = `Year ${generateRandomNumber(1, 4)}`;
        break;
      case 'academicYear':
        data[field.key] = getCurrentAcademicYear();
        break;
        
      // Contact fields
      case 'phone':
      case 'emergencyContact':
        data[field.key] = generatePhoneNumber();
        break;
      case 'email':
        data[field.key] = generateEmail(firstName, lastName);
        break;
      case 'address':
      case 'officeLocation':
        data[field.key] = generateAddress();
        break;
        
      // Special fields
      case 'bloodGroup':
        data[field.key] = getRandomItem(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
        break;
      case 'designation':
        data[field.key] = getRandomItem(['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Research Fellow', 'Administrator', 'Manager', 'Coordinator']);
        break;
      case 'sport':
        data[field.key] = getRandomItem(['Football', 'Basketball', 'Tennis', 'Swimming', 'Gym & Fitness', 'Soccer', 'Volleyball', 'Track & Field']);
        break;
      case 'purpose':
        data[field.key] = getRandomItem(['Business Meeting', 'Interview', 'Campus Tour', 'Conference', 'Guest Lecture', 'Research Collaboration']);
        break;
      case 'hostName':
        data[field.key] = `Dr. ${getRandomItem(lastNames)}`;
        break;
      case 'visitTime':
        data[field.key] = `${generateRandomNumber(8, 17).toString().padStart(2, '0')}:${generateRandomNumber(0, 59).toString().padStart(2, '0')}`;
        break;
      case 'borrowLimit':
        data[field.key] = generateRandomNumber(3, 10).toString();
        break;
      case 'copay':
        data[field.key] = `$${generateRandomNumber(10, 50)}`;
        break;
      case 'rxBin':
        data[field.key] = generateRandomNumber(100000, 999999).toString();
        break;
        
      // Select fields with options
      case 'membershipType':
        data[field.key] = field.options ? getRandomItem(field.options) : 'Regular';
        break;
      case 'membershipLevel':
        data[field.key] = field.options ? getRandomItem(field.options) : 'Gold';
        break;
      case 'accessLevel':
        data[field.key] = field.options ? getRandomItem(field.options) : 'Level 2';
        break;
      case 'readingLevel':
        data[field.key] = field.options ? getRandomItem(field.options) : 'Intermediate';
        break;
      case 'planType':
        data[field.key] = field.options ? getRandomItem(field.options) : 'PPO';
        break;
        
      // Default case
      default:
        data[field.key] = `Sample ${field.label}`;
    }
  });
  
  return data;
}

// Enhanced generator with logos and signatures
export function generateEnhancedDummyData(template: CardTemplate): EnhancedDummyData {
  const basicData = generateDummyData(template);
  const result: EnhancedDummyData = { data: basicData };
  
  // Extract name for signature
  const nameFields = ['studentName', 'memberName', 'employeeName', 'visitorName'];
  let fullName = '';
  for (const field of nameFields) {
    if (basicData[field]) {
      fullName = basicData[field];
      break;
    }
  }
  
  // Extract organization for logo
  const orgFields = ['universityName', 'organizationName', 'libraryName', 'clubName', 'insurerName'];
  let orgName = '';
  for (const field of orgFields) {
    if (basicData[field]) {
      orgName = basicData[field];
      break;
    }
  }
  
  // Generate logo if organization exists
  if (orgName) {
    result.logo = generateOrganizationLogo(orgName);
  }
  
  // Generate signature if name exists
  if (fullName) {
    result.signature = generateSignature(fullName);
  }
  
  return result;
}

// Validate if data meets compliance requirements
export function validateCompliance(data: Record<string, string>, template: CardTemplate): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check for full name
  const nameFields = ['studentName', 'memberName', 'employeeName', 'visitorName'];
  const hasName = nameFields.some(field => data[field] && data[field].trim().length > 0);
  if (!hasName) {
    errors.push('Full name is required');
  }
  
  // Check for institution name
  const institutionFields = ['universityName', 'organizationName', 'libraryName', 'clubName', 'insurerName'];
  const hasInstitution = institutionFields.some(field => data[field] && data[field].trim().length > 0);
  if (!hasInstitution) {
    errors.push('Institution/Organization name is required');
  }
  
  // Check for valid date
  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const dateFields = ['joinDate', 'visitDate', 'effectiveDate', 'validUntil', 'expiryDate'];
  let hasValidDate = false;
  
  for (const field of dateFields) {
    if (data[field]) {
      const dateStr = data[field];
      const dateParts = dateStr.split('/');
      let date: Date;
      
      if (dateParts.length === 2) {
        // MM/YYYY format
        date = new Date(parseInt(dateParts[1]), parseInt(dateParts[0]) - 1);
      } else if (dateParts.length === 3) {
        // MM/DD/YYYY format
        date = new Date(parseInt(dateParts[2]), parseInt(dateParts[0]) - 1, parseInt(dateParts[1]));
      } else {
        continue;
      }
      
      // Check if date is within last 90 days or in current academic year
      const academicYearStart = new Date(today.getFullYear(), 7, 1); // August 1
      const academicYearEnd = new Date(today.getFullYear() + 1, 4, 31); // May 31
      
      if (date >= ninetyDaysAgo || (date >= academicYearStart && date <= academicYearEnd)) {
        hasValidDate = true;
        break;
      }
    }
  }
  
  if (!hasValidDate && dateFields.some(field => template.fields.some(f => f.key === field))) {
    errors.push('Date must be within current academic year or last 90 days');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}