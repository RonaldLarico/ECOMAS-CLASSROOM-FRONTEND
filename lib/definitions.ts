export interface Corporation {
  id: number;
  name: string;
  resolution: string;
  description: string;
  ruc: string;
  email: string;
  image?: string;
  observation?: string;
  createdAt: Date;
  updatedAt: Date;

  users: User[];
  //institute: CorporationOnInstitute[];
  //studentCourse: CorporationOnStudentCourse[];
  //studentGraduate: CorporationOnStudentGraduate[];
  graduate: CorporationOnGraduate[];
  //module: CorporationOnModule[];
}


export type Institute = {
  id: number; // Autoincrementing ID
  name: string; // Required name
  description?: string; // Optional description
  image?: string; // Optional image URL
  observation?: string; // Optional observation
  createdAt: Date; // Created timestamp
  updatedAt: Date; // Updated timestamp
  corporation: CorporationOnInstitute[]; // Array of CorporationOnInstitute references
};

export type CorporationOnInstitute = {
  corporationId: number;
  instituteId: number;
  corporation: Corporation;
  institute: Institute;
};


interface Exam {}

interface Module {}

interface CorporationOnGraduate {}

export interface StudentOnGraduate {
  state: boolean;
  studentGraduateId: number;
  graduateId: number;
  studentGraduate: StudentGraduate; // Ensure 'StudentGraduate' is defined elsewhere in your codebase
  graduate: Graduate; // Ensure 'Graduate' is defined elsewhere in your codebase
}


export interface Graduate {
  id: number;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  state: boolean;
  startAd: Date;
  endAd: Date;
  totalPrice: number;
  credits: string;
  observation?: string;
  checkImage: boolean;
  createdAt: Date;
  updatedAt: Date;

  exam: Exam[];
  corporation: CorporationOnGraduate[];
  module: Array<{
    id: number;
    name: string;
    code: string;
    topics: string[];
  }>;
  // Uncomment and adjust the corporation field if needed
  // corporation: Array<{
  //   corporationId: number;
  //   graduateId: number;
  //   corporation: {
  //     id: number;
  //     name: string;
  //     image: string | null;
  //   };
  // }>;
  studentGraduate: Array<{
    state: boolean;
    studentGraduateId: number;
    graduateId: number;
    studentGraduate: StudentGraduate;
  }>;
}

export interface StudentGraduate {
  id: number;
  fullName: string;
  typeDocument: string;
  documentNumber: string;
  password: string;
  email: string;
  role: Role; // Ensure 'Role' is defined elsewhere in your codebase
  birthDate?: Date;
  phone: string;
  phoneOption?: string;
  address?: string;
  gender?: Gender; // Ensure 'Gender' is defined elsewhere in your codebase
  code: string;
  state: boolean;
  active: boolean;
  occupation?: string;
  partialNote?: number;
  finalNote?: number;
  form?: string;
  dniImage?: string;
  imageTitle?: string;
  voucher?: string;
  observation?: string;
  createdAt: Date;
  updatedAt: Date;
  passwordReset: Password[]; // Ensure 'Password' is defined elsewhere in your codebase
 // result: Result[]; // Ensure 'Result' is defined elsewhere in your codebase
  quota: QuotaGraduate[]; // Ensure 'QuotaGraduate' is defined elsewhere in your codebase
  //studentModule: StudentModule[]; // Ensure 'StudentModule' is defined elsewhere in your codebase
  corporation: CorporationOnStudentGraduate[]; // Ensure 'CorporationOnStudentGraduate' is defined elsewhere in your codebase
  graduate: StudentOnGraduate[]; // Ensure 'StudentOnGraduate' is defined elsewhere in your codebase
  //imageCertificate: ImageCertificateGraduate[]; // Ensure 'ImageCertificateGraduate' is defined elsewhere in your codebase
  //notification: NotificationStudent[]; // Ensure 'NotificationStudent' is defined elsewhere in your codebase
}

export interface CorporationOnStudentGraduate {
  corporationId: number;
  styudentGraduateId: number;
  corporation: Corporation;
  studentGraduate: StudentGraduate;
}
export interface Password {
  id: number;
  token: string;
  expiresAt: Date;
  userId?: number;
  user?: User; // Ensure 'User' is defined elsewhere in your codebase
  studentCourseId?: number;
  //studentCourse?: StudentCourse; // Ensure 'StudentCourse' is defined elsewhere in your codebase
  studentGraduateId?: number;
  studentGraduate?: StudentGraduate; // Ensure 'StudentGraduate' is defined elsewhere in your codebase
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHERS = "OTHERS"
}

export enum TestType {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE",
  TRUE_FALSE = "TRUE_FALSE"
}

export enum TypeNotify {
  QUOTA = "QUOTA",
  SESSION = "SESSION"
}

export enum TypeUser {
  COURSE = "COURSE",
  GRADUATE = "GRADUATE"
}


// Definimos la interfaz User
export interface User {
  id: number;
  documentNumber: string;
  password: string;
  state: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  staff?: Staff;
  //passwordReset: Password[];
  corporationId?: number;
  corporation?: Corporation;
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  ADVISORY = "ADVISORY",
  FINANCE = "FINANCE",
  ACCOUNTING = "ACCOUNTING",
  IMAGE = "IMAGE",
  STAFF = "STAFF"
}

export interface Staff {
  id: number;
  fullName: string;
  email: string;
  photo?: string;
  //gender: Gender;
  birthDate?: Date;
  phone: string;
  bankName?: string;
  numberBank?: string;
  payment?: number;
  paymentCorporation?: string;
  liquidation?: string;
  observation?: string;
  userId: number;
  user: User;
  //staffPayment: StaffPayment[];
}

export interface QuotaGraduate {
  id: number;
  name: string;
  price: number; // Make sure to handle this as a decimal where needed
  state: boolean;
  date: Date;
  observation?: string;
  vouchers: string[];
  createdAt: Date;
  updatedAt: Date;
  studentGraduateId: number;
  studentGraduate: StudentGraduate; // Ensure 'StudentGraduate' is defined elsewhere in your codebase
  paymentRegister: PaymentRegisterGraduate[]; // Ensure 'PaymentRegisterGraduate' is defined elsewhere in your codebase
}

export interface DuplicatePayment {
  id: number;
  numberOperation: string;
  nameBank: string;
  amount: string;
  date: string;
  hour: string;
  quotaGraduateId: number;
  studentGraduate: StudentGraduate;
  message: string;
}

export interface PaymentRegisterGraduate {
  id: number;
  nameBank: string;
  amount?: number; // Make sure to handle this as a decimal where needed
  numberOperation?: string;
  date: Date;
  hour: string;
  quotaGraduateId: number;
  quotaGraduate: QuotaGraduate; // Ensure 'QuotaGraduate' is defined elsewhere in your codebase
}


export interface PaymentRegister {
  id: number;
  nameBank: string;
  amount?: number; 
  numberOperation?: string;
  date: Date;
  hour: string;
  studentGraduateId?: number;
  studentGraduate?: StudentGraduate;
  studentCourseId?: number;
  studentCourse?: StudentCourse; 
}

export interface StudentCourse {
  id: number;
  fullName: string;
  documentNumber: string;
  typeDocument: string;
  password: string;
  email: string;
  birthDate?: Date;
  phone: string;
  phoneOption?: string;
  address?: string;
  gender?: Gender; // Ensure 'Gender' is defined elsewhere in your codebase
  code: string;
  role: Role; // Ensure 'Role' is defined elsewhere in your codebase
  state: boolean;
  occupation?: string;
  voucher?: string;
  observation?: string; // I corrected this from 'obsercation' to 'observation'
  createdAt: Date;
  updatedAt: Date;
  passwordReset: Password[]; // Ensure 'Password' is defined elsewhere in your codebase
/*   quota: QuotaModule[]; // Ensure 'QuotaModule' is defined elsewhere in your codebase */
  paymentRegister: PaymentRegister[]; // Ensure 'PaymentRegister' is defined elsewhere in your codebase
/*   corporation: CorporationOnStudentCourse[]; // Ensure 'CorporationOnStudentCourse' is defined elsewhere in your codebase
  module: StudentOnCourse[]; // Ensure 'StudentOnCourse' is defined elsewhere in your codebase
  imageCertificate: ImageCertificateCourse[]; // I corrected this from 'ImageCertificateCurse' to 'ImageCertificateCourse'
  notification: NotificationStudent[]; // Ensure 'NotificationStudent' is defined elsewhere in your codebase */
}
