export interface LoginDto {
  email: string;
  password: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

export interface SetPasswordDto {
  token: string;
  password: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  homephone: string;
}

export interface UserTableDto {
  id: number;
  firstName: string;
  lastName: string;
}

export interface UpdateAccountDto {
  phone?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  cardNo?: string;
  companyId?: string;
}

export interface UpdateAccountRequestDto {
  phoneNumber?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
}

export interface CreateEmployeeDto {
  email?: string;
  password?: string;
  homephone?: string;
  firstName?: string;
  lastName?: string;
  accountRole: 0;
}

export interface CompanyTableDto {
  id: number;
  name: string;
  phone: string;
  address: string;
  licenseNo: string;
}

export interface UpdateAccountInfo {
  homephone: string;
  cardNo: string;
}

export interface UpdateCompany {
  name: string;
  phone: string;
  address: string;
  licenseNo: string;
}
export interface AccountsActionsDto {
  label: string;
  status: string;
  action: any;
}
export interface NewAccountDto {
  email: string;
  fName: string;
  lName: string;
  homePhone: string;
  type: any;
}

export interface AdminFilterDto {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  searchBy?: string;
  searchKeyword?: string;
}