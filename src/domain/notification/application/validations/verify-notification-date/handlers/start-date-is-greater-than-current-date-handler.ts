import { HttpException } from "../../../../../../core/errors/HttpException";
import { HttpStatus } from "../../../../../../core/errors/http-status";
import { Handler } from "../handler";

export class StartDateIsGreaterThanCurrentdateHandler implements Handler {
  private nextHandler!: Handler;

  setHandler(handler: Handler): Handler {
    return this.nextHandler = handler;
  }

  verify(startDate: Date, endDate: Date): void {
    // PRECATION CAUSE BACKEND NEW DATE IS MILISECONDS AHEAD OF FRONTEND NEW DATE BECAUSE OF MILISECONDS TO REACH THIS FUNCTION
    const currentDate = new Date(new Date().getTime() - (10 * 1000));

    if (startDate < currentDate) {
      throw new HttpException(HttpStatus.UNPROCESSABLE_ENTITY, "Invalid start date");
    } else if (this.nextHandler != null) {
      return this.nextHandler.verify(startDate, endDate);
    }

    return;
  }
}