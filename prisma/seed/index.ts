import { useSeeder } from "./scripts/seeder";
import { useCleaner } from "./scripts/cleaner";

(async () => {
  const { init, seedStaking, seedPlayers, seedPlayersSeasonPoints, seedPlayersTotalPoints, seedAutomaticNotificationTemplates } =
    useSeeder();
  const { cleanPlayers } = useCleaner();

  // //Seed data
  // await init();
  // await seedStaking();
  // await seedPlayers();
  // await seedPlayersSeasonPoints();
  // await seedPlayersTotalPoints();
  await seedAutomaticNotificationTemplates();

  //Clean data
  // await cleanPlayers();
})();
