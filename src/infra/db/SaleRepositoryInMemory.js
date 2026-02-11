export class SaleRepositoryInMemory {
  constructor() {
    this.sales = new Map();
  }

  async save(sale) {
    if (this.sales.has(sale.saleId)) {
      return; 
    }

    this.sales.set(sale.saleId, sale);
  }

  async existsBySaleId(saleId) {
    return this.sales.has(saleId);
  }
}
