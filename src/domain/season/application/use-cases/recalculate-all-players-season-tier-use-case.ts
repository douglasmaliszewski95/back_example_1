import { PlayerSeasonPointsRepository } from "../repositories/player-season-points-repository";
import { SeasonsRepository } from "../repositories/seasons-repository";

export class RecalculateAllPlayersASeasonTierUseCase {

  constructor(private seasonsRepository: SeasonsRepository, private playerPointsRepository: PlayerSeasonPointsRepository) { }

  execute = async (): Promise<void> => {
    const activeSeason = await this.seasonsRepository.findActive();

    if (!activeSeason || !activeSeason.id) {
      console.log('No active season found');
      return;
    }

    const players = await this.playerPointsRepository.getDescendingPlayersPointsForSeason(activeSeason.id);
    const totalOfPlayersOnSeason = players.filter(p => p.points > 0).length;
    const allOfThePlayersOnSeason = players.length;

    if (totalOfPlayersOnSeason === 0) {
      console.log('No players found for the active season');
      return;
    }

    const allSamePoints = players.every(player => player.points === players[0].points);

    if (allSamePoints) {
      for (const player of players) {
        await this.playerPointsRepository.updatePlayerPointsRegister(player.id ?? 0, {
          newTier: 3,
          progress: 0
        });
      }
      console.log('All players have the same points, all set to tier 3');
      return;
    }

    const tier1Threshold = Math.floor(totalOfPlayersOnSeason * 0.25) === 0 ? Math.ceil(totalOfPlayersOnSeason * 0.25) : Math.floor(totalOfPlayersOnSeason * 0.25);
    const tier2Threshold = Math.floor(totalOfPlayersOnSeason * 0.50) === 0 ? Math.ceil(totalOfPlayersOnSeason * 0.50) : Math.floor(totalOfPlayersOnSeason * 0.50);

    for (let i = 0; i < allOfThePlayersOnSeason; i++) {
      let tier;
      let positionPercentage: number;
      const player = players[i];

      if (player.points === 0) {
        positionPercentage = 0;
        tier = 3;
      } else if (i < tier1Threshold) {
        tier = 1;
        positionPercentage = 100; // 100% para todos os jogadores no tier 1
      } else if (i < tier2Threshold) {
        tier = 2;
        const relativePosition = i - tier1Threshold;
        positionPercentage = 99 - ((relativePosition / (tier2Threshold - tier1Threshold)) * 50);
      } else {
        tier = 3;
        const relativePosition = i - tier2Threshold;
        positionPercentage = 49 - ((relativePosition / (totalOfPlayersOnSeason - tier2Threshold)) * 50);
      }

      await this.playerPointsRepository.updatePlayerPointsRegister(players[i].id ?? 0, {
        newTier: tier,
        lastTier: players[i].tier,
        progress: positionPercentage
      });
    }
  }
}