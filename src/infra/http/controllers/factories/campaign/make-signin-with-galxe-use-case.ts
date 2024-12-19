import { SigninWithGalxeUseCase } from "../../../../../domain/campaign/application/use-cases/signin-with-galxe-use-case";
import { IncredbullGalxeApiGateway } from "../../../../gateways/incredbull-galxe-api-gateway";

export function makeSigninWithGalxeUseCase() {
  const gateway = new IncredbullGalxeApiGateway();
  const sut = new SigninWithGalxeUseCase(gateway);
  return sut;
}