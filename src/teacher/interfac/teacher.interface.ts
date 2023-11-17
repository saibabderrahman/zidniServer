export interface TeacherInterface {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: number;
  zipCode?: number;
  address: string;
  role?: string;
  avatar?: string;
  description?: string;
  active?: boolean;
  accepted?: boolean;
  withdrawMethodBankName?: string;
  withdrawMethodBankAccountNumber?: number;
  withdrawMethodBankHolderName?: string;
  availableBalance?: number;
  socketId?: string;
  resetPasswordToken?: string;
  resetPasswordTime?: Date;
  classes?: [];

  }