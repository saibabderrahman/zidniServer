export interface AdminInterface {
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
  socketId?: string;
  resetPasswordToken?: string;
  resetPasswordTime?: Date;
  classes?: [];

  }