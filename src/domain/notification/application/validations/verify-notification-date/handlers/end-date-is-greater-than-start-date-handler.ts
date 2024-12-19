import { HttpException } from "../../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../../core/errors/http-status";
import { Handler } from "../handler";

export class EndDateIsGreaterThanStartDateHandler implements Handler {
  private nextHandler!: Handler;

  setHandler(handler: Handler): Handler {
    return this.nextHandler = handler;
  }

  verify(startDate: Date, endDate: Date): void {

    if (endDate && startDate > endDate) {
      throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid end date");
    } else if (this.nextHandler != null) {
      return this.nextHandler.verify(startDate, endDate);
    }

    return;
  }
}