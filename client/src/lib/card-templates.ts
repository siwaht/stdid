export interface CardTemplate {
  id: string;
  name: string;
  type: 'student' | 'library' | 'staff' | 'visitor' | 'sports' | 'health';
  description: string;
  fields: CardField[];
  design: CardDesign;
  icon: string;
}

export interface CardField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  validation?: string;
  maxLength?: number;
  type?: 'text' | 'date' | 'select' | 'number';
  options?: string[];
}

export interface CardDesign {
  theme: string;
  primaryColor: string;
  accentColor: string;
  bgGradient?: string;
  pattern?: 'dots' | 'lines' | 'circuit' | 'waves' | 'geometric';
  layout: 'horizontal' | 'vertical' | 'modern' | 'classic';
}

export const colorThemes = {
  default: {
    name: 'Default (No Theme)',
    primary: 'hsl(222, 2%, 30%)',
    accent: 'hsl(222, 2%, 50%)',
    gradient: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
  },
  ocean: {
    name: 'Ocean Blue',
    primary: 'hsl(200, 100%, 45%)',
    accent: 'hsl(180, 100%, 40%)',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  forest: {
    name: 'Forest Green',
    primary: 'hsl(140, 60%, 35%)',
    accent: 'hsl(100, 50%, 45%)',
    gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  },
  sunset: {
    name: 'Sunset Orange',
    primary: 'hsl(25, 100%, 55%)',
    accent: 'hsl(350, 100%, 60%)',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  corporate: {
    name: 'Corporate Gray',
    primary: 'hsl(210, 20%, 35%)',
    accent: 'hsl(210, 50%, 50%)',
    gradient: 'linear-gradient(135deg, #667db6 0%, #0082c8 100%)',
  },
  vibrant: {
    name: 'Vibrant Purple',
    primary: 'hsl(280, 100%, 50%)',
    accent: 'hsl(320, 100%, 55%)',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  mint: {
    name: 'Mint Fresh',
    primary: 'hsl(165, 70%, 45%)',
    accent: 'hsl(190, 65%, 50%)',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  royal: {
    name: 'Royal Gold',
    primary: 'hsl(45, 100%, 50%)',
    accent: 'hsl(30, 100%, 45%)',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  },
  midnight: {
    name: 'Midnight Dark',
    primary: 'hsl(230, 30%, 20%)',
    accent: 'hsl(260, 60%, 50%)',
    gradient: 'linear-gradient(135deg, #2e3192 0%, #1bffff 100%)',
  },
};

export const cardTemplates: CardTemplate[] = [
  {
    id: 'student-standard',
    name: 'Student ID Card',
    type: 'student',
    description: 'Standard student identification card for educational institutions',
    icon: '🎓',
    fields: [
      { key: 'universityName', label: 'University/School Name', placeholder: 'Enter institution name', required: true, maxLength: 100 },
      { key: 'studentName', label: 'Full Name', placeholder: 'Enter your full name', required: true, maxLength: 50 },
      { key: 'studentId', label: 'Student ID', placeholder: 'Enter student ID', required: true, maxLength: 20 },
      { key: 'academicYear', label: 'Academic Year', placeholder: '2024-2025', required: true, maxLength: 20 },
      { key: 'course', label: 'Course/Program', placeholder: 'Enter course name', required: true, maxLength: 50 },
      { key: 'year', label: 'Year/Grade', placeholder: 'Enter year or grade', required: true, maxLength: 20 },
      { key: 'validUntil', label: 'Valid Until', placeholder: 'MM/YYYY', required: true },
      { key: 'bloodGroup', label: 'Blood Group', placeholder: 'Enter blood group', required: false, maxLength: 10 },
    ],
    design: {
      theme: 'ocean',
      primaryColor: colorThemes.ocean.primary,
      accentColor: colorThemes.ocean.accent,
      bgGradient: colorThemes.ocean.gradient,
      pattern: 'dots',
      layout: 'horizontal',
    },
  },
  {
    id: 'library-card',
    name: 'Library Card',
    type: 'library',
    description: 'Library membership card with borrowing privileges',
    icon: '📚',
    fields: [
      { key: 'libraryName', label: 'Library Name', placeholder: 'Enter library name', required: true, maxLength: 100 },
      { key: 'memberName', label: 'Member Name', placeholder: 'Enter full name', required: true, maxLength: 50 },
      { key: 'memberId', label: 'Member ID', placeholder: 'Enter member ID', required: true, maxLength: 20 },
      { key: 'membershipType', label: 'Membership Type', placeholder: 'Regular/Premium/Student', required: true, type: 'select', options: ['Regular', 'Premium', 'Student', 'Senior', 'Child'] },
      { key: 'joinDate', label: 'Join Date', placeholder: 'MM/DD/YYYY', required: true, type: 'date' },
      { key: 'expiryDate', label: 'Expiry Date', placeholder: 'MM/DD/YYYY', required: true, type: 'date' },
      { key: 'borrowLimit', label: 'Borrow Limit', placeholder: 'Number of books', required: true, type: 'number', maxLength: 3 },
      { key: 'readingLevel', label: 'Reading Level', placeholder: 'Beginner/Intermediate/Advanced', required: false, type: 'select', options: ['Beginner', 'Intermediate', 'Advanced'] },
    ],
    design: {
      theme: 'forest',
      primaryColor: colorThemes.forest.primary,
      accentColor: colorThemes.forest.accent,
      bgGradient: colorThemes.forest.gradient,
      pattern: 'lines',
      layout: 'modern',
    },
  },
  {
    id: 'staff-faculty',
    name: 'Staff/Faculty ID',
    type: 'staff',
    description: 'Professional identification for staff and faculty members',
    icon: '💼',
    fields: [
      { key: 'organizationName', label: 'Organization', placeholder: 'Enter organization name', required: true, maxLength: 100 },
      { key: 'employeeName', label: 'Employee Name', placeholder: 'Enter full name', required: true, maxLength: 50 },
      { key: 'employeeId', label: 'Employee ID', placeholder: 'Enter employee ID', required: true, maxLength: 20 },
      { key: 'designation', label: 'Designation', placeholder: 'Enter job title', required: true, maxLength: 50 },
      { key: 'department', label: 'Department', placeholder: 'Enter department', required: true, maxLength: 50 },
      { key: 'officeLocation', label: 'Office Location', placeholder: 'Building/Room number', required: false, maxLength: 30 },
      { key: 'email', label: 'Email', placeholder: 'Enter email address', required: true, maxLength: 100 },
      { key: 'accessLevel', label: 'Access Level', placeholder: 'Level 1/2/3', required: true, type: 'select', options: ['Level 1', 'Level 2', 'Level 3', 'Admin', 'Executive'] },
    ],
    design: {
      theme: 'corporate',
      primaryColor: colorThemes.corporate.primary,
      accentColor: colorThemes.corporate.accent,
      bgGradient: colorThemes.corporate.gradient,
      pattern: 'circuit',
      layout: 'classic',
    },
  },
  {
    id: 'visitor-pass',
    name: 'Visitor Pass',
    type: 'visitor',
    description: 'Temporary visitor identification pass',
    icon: '🎫',
    fields: [
      { key: 'organizationName', label: 'Visiting Organization', placeholder: 'Enter organization name', required: true, maxLength: 100 },
      { key: 'visitorName', label: 'Visitor Name', placeholder: 'Enter full name', required: true, maxLength: 50 },
      { key: 'visitorId', label: 'Pass Number', placeholder: 'Auto-generated', required: true, maxLength: 20 },
      { key: 'visitDate', label: 'Visit Date', placeholder: 'MM/DD/YYYY', required: true, type: 'date' },
      { key: 'visitTime', label: 'Time In', placeholder: 'HH:MM', required: true },
      { key: 'purpose', label: 'Purpose of Visit', placeholder: 'Meeting/Interview/Delivery', required: true, maxLength: 100 },
      { key: 'hostName', label: 'Host Name', placeholder: 'Person to meet', required: true, maxLength: 50 },
      { key: 'validUntil', label: 'Valid Until', placeholder: 'Time/Date', required: true },
    ],
    design: {
      theme: 'sunset',
      primaryColor: colorThemes.sunset.primary,
      accentColor: colorThemes.sunset.accent,
      bgGradient: colorThemes.sunset.gradient,
      pattern: 'waves',
      layout: 'modern',
    },
  },
  {
    id: 'sports-club',
    name: 'Sports Club Card',
    type: 'sports',
    description: 'Membership card for sports and fitness clubs',
    icon: '⚽',
    fields: [
      { key: 'clubName', label: 'Club Name', placeholder: 'Enter club name', required: true, maxLength: 100 },
      { key: 'memberName', label: 'Member Name', placeholder: 'Enter full name', required: true, maxLength: 50 },
      { key: 'memberId', label: 'Member ID', placeholder: 'Enter member ID', required: true, maxLength: 20 },
      { key: 'sport', label: 'Sport/Activity', placeholder: 'Football/Tennis/Gym', required: true, maxLength: 50 },
      { key: 'membershipLevel', label: 'Membership Level', placeholder: 'Bronze/Silver/Gold', required: true, type: 'select', options: ['Bronze', 'Silver', 'Gold', 'Platinum', 'VIP'] },
      { key: 'joinDate', label: 'Join Date', placeholder: 'MM/DD/YYYY', required: true, type: 'date' },
      { key: 'validUntil', label: 'Valid Until', placeholder: 'MM/DD/YYYY', required: true, type: 'date' },
      { key: 'emergencyContact', label: 'Emergency Contact', placeholder: 'Phone number', required: true, maxLength: 20 },
    ],
    design: {
      theme: 'vibrant',
      primaryColor: colorThemes.vibrant.primary,
      accentColor: colorThemes.vibrant.accent,
      bgGradient: colorThemes.vibrant.gradient,
      pattern: 'geometric',
      layout: 'modern',
    },
  },
  {
    id: 'health-insurance',
    name: 'Health Insurance Card',
    type: 'health',
    description: 'Medical insurance and health services card',
    icon: '🏥',
    fields: [
      { key: 'insurerName', label: 'Insurance Provider', placeholder: 'Enter provider name', required: true, maxLength: 100 },
      { key: 'memberName', label: 'Member Name', placeholder: 'Enter full name', required: true, maxLength: 50 },
      { key: 'memberId', label: 'Member ID', placeholder: 'Enter member ID', required: true, maxLength: 30 },
      { key: 'groupNumber', label: 'Group Number', placeholder: 'Enter group number', required: true, maxLength: 20 },
      { key: 'planType', label: 'Plan Type', placeholder: 'HMO/PPO/EPO', required: true, type: 'select', options: ['HMO', 'PPO', 'EPO', 'POS', 'HDHP'] },
      { key: 'effectiveDate', label: 'Effective Date', placeholder: 'MM/DD/YYYY', required: true, type: 'date' },
      { key: 'copay', label: 'Copay Amount', placeholder: '$XX', required: false, maxLength: 10 },
      { key: 'rxBin', label: 'RX BIN', placeholder: 'Enter RX BIN', required: false, maxLength: 20 },
    ],
    design: {
      theme: 'mint',
      primaryColor: colorThemes.mint.primary,
      accentColor: colorThemes.mint.accent,
      bgGradient: colorThemes.mint.gradient,
      pattern: 'dots',
      layout: 'horizontal',
    },
  },
];

export function getTemplateById(id: string): CardTemplate | undefined {
  return cardTemplates.find(template => template.id === id);
}

export function getTemplatesByType(type: string): CardTemplate[] {
  return cardTemplates.filter(template => template.type === type);
}