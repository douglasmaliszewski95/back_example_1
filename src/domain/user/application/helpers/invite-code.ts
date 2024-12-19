import { env } from "../../../../infra/env";

export function createInviteCodeLink(inviteCode: string | null) {
  if (!inviteCode || inviteCode.trim() === "") return null;
  return (env.PLAYER_FRONTEND_BASEURL + "/invite/" + encodeURIComponent(inviteCode)).trim();
}