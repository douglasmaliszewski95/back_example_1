import { AutomaticNotificationParams } from "../../send-automatic-notification-event.types";
import { Handler } from "../handler";

export abstract class AbstractNotificationHandler implements Handler {
  private nextHandler!: Handler;

  setHandler(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  async sendNotification(params: AutomaticNotificationParams) {
    if (this.nextHandler) {
      await this.nextHandler.sendNotification(params);
    }
  }
}
