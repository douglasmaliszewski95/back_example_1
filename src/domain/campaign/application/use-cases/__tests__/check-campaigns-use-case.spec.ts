import { beforeEach, describe, it, expect } from 'vitest';
import { FakeCampaignsGateway } from "../../../../../../tests/gateway/fake-campaigns-gateway";
import { ApplicationLogRepositoryInMemory } from "../../../../../../tests/repository/application-log-repository-in-memory";
import { CampaignsRepositoryInMemory } from "../../../../../../tests/repository/campaigns-repository-in-memory";
import { ApplicationLogRepository } from "../../../../season/application/repositories/application-log-repository";
import { CheckCampaignsUseCase } from "../check-campaigns-use-case";

let campaignsGateway: FakeCampaignsGateway;
let campaignsRepository: CampaignsRepositoryInMemory;
let applicationLogRepository: ApplicationLogRepository
let sut: CheckCampaignsUseCase;

describe("Check Campaigns", () => {
  beforeEach(() => {
    campaignsGateway = new FakeCampaignsGateway()
    campaignsRepository = new CampaignsRepositoryInMemory();
    applicationLogRepository = new ApplicationLogRepositoryInMemory();
    sut = new CheckCampaignsUseCase(
      campaignsGateway,
      campaignsRepository,
      applicationLogRepository,
    );
  });

  it("should be able to identify if a campaign is starting", async () => {
    await sut.execute();

    expect(campaignsRepository.campaigns.length).greaterThan(0);
  });

  it("should be able to identify if a campaign is ending", async () => {
    await sut.execute();

    const inactivatedCampaigns = await campaignsRepository.campaigns.filter(campaign => !campaign.active);
    expect(inactivatedCampaigns.length).toBe(1);
  });
});