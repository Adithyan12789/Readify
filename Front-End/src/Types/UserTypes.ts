export interface UserInfo {
    id: string;
    name: string;
    email: string;
    phone: number;
    isBlocked?: boolean;
}


export interface AuthState {
    userInfo: UserInfo | null;
}

export interface UserCredentials {
    email: string;
    password: string;
  }
  
  /**  user registration Credentials */
  export interface RegisterCredentials {
    name: string;
    email: string;
    phone: number;
    password: string;
  }
  
  /** OTP-based verification Credentials */
  export interface OtpCredentials {
    email: string;
    otp: string;
  }
  
  /**  user authentication Response */
  export interface UserResponse {
    isAdmin: boolean;
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }