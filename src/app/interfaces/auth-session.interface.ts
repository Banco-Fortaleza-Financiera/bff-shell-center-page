export interface AuthSession {
  authenticated: true;
  idUser: number;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: string;
  sessionId: string;
  deviceIp: string;
  createdAt: string;
}
