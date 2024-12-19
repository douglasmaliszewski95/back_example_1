interface PlayerData {
  galxeId: string;
  userId: string;
  termsAccepted: boolean;
  refreshToken: string;
  refreshTokenGalxe: string;
  inviteCode: string;
}

interface ParametersResponseDTO {
  id: number;
  galxeId: string;
  userId: string;
  termsAccepted: boolean;
  refreshToken: string;
  refreshTokenGalxe: string;
  createdAt: Date;
  inviteCode: string;
}

export {
  PlayerData,
  ParametersResponseDTO
};
