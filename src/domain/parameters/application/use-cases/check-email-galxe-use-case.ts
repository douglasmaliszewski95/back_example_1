import { LogLevel, LogOrigin } from "../../../../core/enums/log-enum";
import { PLAYER_STATUS } from "../../../../core/enums/player-status-enum";
import { IncredbullGalxeApiGateway } from "../../../../infra/gateways/incredbull-galxe-api-gateway";
import { ApplicationLogRepository } from "../../../season/application/repositories/application-log-repository";
import { AuthPlayerProvider } from "../../../user/application/auth-provider/auth-player-provider";
import { PlayersRepository } from "../../../user/application/repositories/players-repository";
import { Player } from "../../../user/enterprise/entities/player";
import { ParametersRepository } from "../repositories/parameters-repository";

export class CheckEmailGalxeUseCase {
  constructor(
    private campaignGateway: IncredbullGalxeApiGateway,
    private playersRepository: PlayersRepository,
    private authPlayerProvider: AuthPlayerProvider,
    private parametersRepository: ParametersRepository,
    private applicationLogRepository: ApplicationLogRepository,
  ) { }

  execute = async () => {
    const parameters = await this.parametersRepository.list();
    const players = await this.playersRepository.fetchAllPlayers();
    // const filterParams = parameters.filter(x => !players.some(y => y.providerPlayerId === x.userId));
    for (const param of parameters) {
      const isPlayer = players.find(x => x.providerPlayerId === param.userId);
      if (!isPlayer) {
        const galxeInfo = await this.campaignGateway.getInfoGalxeUser(param.refreshTokenGalxe);
        if (!galxeInfo?.GalxeID) {
          await this.applicationLogRepository.create({
            content: `failed to get data from galxe user id ${param.userId}, refreshTokenGalxe expired`,
            level: LogLevel.ERROR,
            origin: LogOrigin.CHECK_EMAIL_GALXE
          });
          continue;
        }
        const updateParameter = await this.parametersRepository.updateTokenGalxe(param.id as number, galxeInfo.RefreshTokenGalxe, param.refreshToken, param.userId);
        if (!updateParameter) {
          await this.applicationLogRepository.create({
            content: `failed to update token galxe for user id ${param.userId}`,
            level: LogLevel.ERROR,
            origin: LogOrigin.CHECK_EMAIL_GALXE
          });
          continue;
        }
        if (galxeInfo.Email) {
          // transform anonoymous user to a player
          const session = await this.authPlayerProvider.refreshSession(param.refreshToken);
          if (!session) {
            await this.applicationLogRepository.create({
              content: "failed to get session",
              level: LogLevel.ERROR,
              origin: LogOrigin.CHECK_EMAIL_GALXE
            });
            continue;
          }

          let updatedPlayer;
          let data = {
            supabaseEmail: galxeInfo.Email ?? "",
            galxeDiscordId: galxeInfo.DiscordUserID ?? undefined,
            galxeEmail: galxeInfo.Email ?? undefined,
            galxeId: galxeInfo.GalxeID ?? undefined,
            galxeTwitterId: galxeInfo.TwitterUserID ?? undefined,
            galxeTelegramId: galxeInfo.TelegramUserID ?? undefined,
            providerPlayerId: param.userId,
            status: PLAYER_STATUS.ACTIVE,
            origin: 'email',
            username: galxeInfo.Name,
            wallet: galxeInfo.Wallet,
            inviteCode: galxeInfo.Name
          };

          const playerAlreadyRegistered = await this.playersRepository.findPlayerByProviderId(param.userId);
          if (playerAlreadyRegistered !== null) {
            updatedPlayer = await this.playersRepository.updatePlayer(param.userId, data);
          } else {
            updatedPlayer = await this.playersRepository.create(Player.create({ ...data, email: galxeInfo.Email ?? "", }));
          }

          if (!updatedPlayer) {
            await this.applicationLogRepository.create({
              content: "failed to create player",
              level: LogLevel.ERROR,
              origin: LogOrigin.CHECK_EMAIL_GALXE
            });
            return;
          }
          await this.authPlayerProvider.updateLoginAnonymous({
            accessToken: session.token,
            address: galxeInfo.Email,
            refreshToken: session.refreshToken,
            userId: param.userId
          })
        }
      }
    }
  }
}