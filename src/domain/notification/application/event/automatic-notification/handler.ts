import { AutomaticNotificationParams } from "../send-automatic-notification-event.types";

export interface Handler {
  setHandler(handler: Handler): Handler;
  sendNotification(params: AutomaticNotificationParams): void;
}
