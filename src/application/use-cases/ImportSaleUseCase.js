import { Sale } from "../../domain/entities/Sale.js";

export class ImportSaleUseCase {
  constructor(saleRepository, eventDispatcher) {
    this.saleRepository = saleRepository;
    this.eventDispatcher = eventDispatcher;
  }

  async execute(input) {
    const alreadyExists = await this.saleRepository.existsBySaleId(input.saleId);

    if (alreadyExists) {
      return {
        status: "SKIPPED",
        saleId: input.saleId
      };
    }

    const sale = Sale.create(input);

    await this.saleRepository.save(sale);

    // Dispatch domain events
    for (const event of sale.domainEvents) {
      await this.eventDispatcher.dispatch(event);
    }

    sale.clearDomainEvents();

    return {
      status: "CREATED",
      saleId: sale.saleId,
      totalAmount: sale.totalAmount
    };
  }
}
