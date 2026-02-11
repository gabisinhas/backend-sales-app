export class Payment {
  constructor({ method, currency }) {
    if (!method) {
      throw new Error("Payment method is required");
    }

    if (!currency) {
      throw new Error("Currency is required");
    }

    this.method = method;
    this.currency = currency;
    Object.freeze(this);
  }
}
