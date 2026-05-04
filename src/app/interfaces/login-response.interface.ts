export interface LoginResponse {
  idUser: number;
  accessToken: string;
  tokenType: 'Bearer' | string;
  expiresIn: number;
}
