export class SaleCreatedEvent {
  constructor(sale) {
    this.eventName = "SaleCreated";
    this.occurredAt = new Date();
    this.payload = {
      saleId: sale.saleId,
      saleDate: sale.saleDate,
      customer: sale.customer,
      product: sale.product,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
      discount: sale.discount,
      totalAmount: sale.totalAmount,
      currency: sale.currency,
      paymentMethod: sale.paymentMethod,
      salesChannel: sale.salesChannel,
      salespersonId: sale.salespersonId,
      status: sale.status
    };

    Object.freeze(this.payload);
    Object.freeze(this);
  }
}
