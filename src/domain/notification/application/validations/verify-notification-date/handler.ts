export interface Handler {
  setHandler(handler: Handler): Handler;
  verify(startDate?: Date, endDate?: Date): void;
}