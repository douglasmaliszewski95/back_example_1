import { Player } from "../../../domain/user/enterprise/entities/player";

export class PlayerPresenter {
  static toHttp(player: Player) {
    return {
      id: player.id,
      username: player.username,
      wallet: player.wallet,
      galxeDiscordId: player.galxeDiscordId,
      galxeTwitterId: player.galxeTwitterId,
      galxeEmail: player.galxeEmail,
      email: player.email
    }
  }
}