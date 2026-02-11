import { SaleCreatedEvent } from "../events/SaleCreatedEvent.js";

export class Sale {
  constructor({
    saleId,
    saleDate,
    customer,
    product,
    quantity,
    unitPrice,
    discount = 0,
    paymentMethod,
    salesChannel,
    salespersonId,
    currency
  }) {
    // --------------------
    // Required fields
    // --------------------
    this.validateRequiredFields({
      saleId,
      saleDate,
      customer,
      product,
      quantity,
      unitPrice,
      currency
    });

    // --------------------
    // Identity & basics
    // --------------------
    this.saleId = saleId;
    this.saleDate = new Date(saleDate);

    // --------------------
    // Aggregates
    // --------------------
    this.customer = customer; // { customerId, name, email }
    this.product = product;   // { productCode, name }

    // --------------------
    // Money & quantity
    // --------------------
    this.quantity = Number(quantity);
    this.unitPrice = Number(unitPrice);
    this.discount = Number(discount);

    // --------------------
    // Context
    // --------------------
    this.paymentMethod = paymentMethod;
    this.salesChannel = salesChannel;
    this.salespersonId = salespersonId;
    this.currency = currency;

    // --------------------
    // State
    // --------------------
    this.status = "PENDING";

    // --------------------
    // Derived data
    // --------------------
    this.totalAmount = this.calculateTotal();

    // --------------------
    // Domain Events
    // --------------------
    this.domainEvents = [];
    this.addDomainEvent(new SaleCreatedEvent(this));
  }

  // ====================
  // Business Rules
  // ====================

  calculateTotal() {
    if (this.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    if (this.unitPrice <= 0) {
      throw new Error("Unit price must be greater than zero");
    }

    if (this.discount < 0) {
      throw new Error("Discount cannot be negative");
    }

    const grossAmount = this.quantity * this.unitPrice;
    const total = grossAmount - this.discount;

    if (total < 0) {
      throw new Error("Total amount cannot be negative");
    }

    return Number(total.toFixed(2));
  }

  // ====================
  // Domain Events
  // ====================

  addDomainEvent(event) {
    this.domainEvents.push(event);
  }

  clearDomainEvents() {
    this.domainEvents = [];
  }

  // ====================
  // Validation
  // ====================

  validateRequiredFields(fields) {
    for (const [key, value] of Object.entries(fields)) {
      if (value === undefined || value === null) {
        throw new Error(`Missing required field: ${key}`);
      }
    }
  }
}
