import { IUser } from './user.model';

export interface ILoginUserRequest {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface IUserResponse {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role: string;
}

export interface IAuthResponse {
  user: IUserResponse;
  token: string;
  message: string;
}

export interface IOtpRequest {
  phone: string;
}

export interface IOtpVerify {
  phone: string;
  otp: string;
}
