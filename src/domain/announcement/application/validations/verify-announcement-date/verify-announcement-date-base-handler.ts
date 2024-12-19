import { Handler } from "./handler";
import { EndDateIsGreaterThanStartDateHandler } from "./handlers/end-date-is-greater-than-start-date-handler";
import { StartDateIsGreaterThanCurrentdateHandler } from "./handlers/start-date-is-greater-than-current-date-handler";

export class VerifyAnnouncementDateBaseHandler {
  private handler: Handler;

  constructor() {
    this.handler = new StartDateIsGreaterThanCurrentdateHandler();
    this.handler
      .setHandler(new EndDateIsGreaterThanStartDateHandler());
  }

  public validate(startDate?: Date, endDate?: Date) {
    this.handler.verify(startDate, endDate);
  }
}