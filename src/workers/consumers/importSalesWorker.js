import amqp from "amqplib";
import fs from "fs";
import csv from "csv-parser";

import { ImportSaleUseCase } from "../../application/use-cases/ImportSaleUseCase.js";
import { SaleRepositoryInMemory } from "../../infra/db/SaleRepositoryInMemory.js";
import { QUEUES } from "../../infra/rabbit/queues.js";
import { FileStorage } from "../../infra/storage/fileStorage.js";
import { logger } from "../../shared/logger/logger.js";

async function startWorker() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUES.IMPORT_SALES, { durable: true });

  logger.info("Import Sales Worker started");
  logger.info("Waiting for messages");

  const saleRepository = new SaleRepositoryInMemory();
  const importSaleUseCase = new ImportSaleUseCase(saleRepository);
  const fileStorage = new FileStorage();

  channel.consume(QUEUES.IMPORT_SALES, async msg => {
    if (!msg) return;

    let payload;

    try {
      payload = JSON.parse(msg.content.toString());
    } catch (error) {
      logger.error("Invalid message format", { error: error.message });
      channel.ack(msg);
      return;
    }

    const { filePath, fileHash, originalName } = payload;

    if (!filePath || !fileHash) {
      logger.warn("Message missing required fields", payload);
      channel.ack(msg);
      return;
    }

    try {
      logger.info("Starting file processing", {
        file: originalName,
        hash: fileHash
      });

      const alreadyProcessed =
        await fileStorage.isAlreadyProcessed(fileHash);

      if (alreadyProcessed) {
        logger.info("File already processed. Skipping.", { fileHash });
        channel.ack(msg);
        return;
      }

      await processCsvSequentially(filePath, importSaleUseCase);

      await fileStorage.markAsProcessed(fileHash);

      logger.info("File processed successfully", { fileHash });
      channel.ack(msg);

    } catch (error) {
      logger.error("Error processing file", {
        error: error.message,
        filePath
      });

      channel.nack(msg, false, false);
    }
  });
}

async function processCsvSequentially(filePath, importSaleUseCase) {
  const stream = fs.createReadStream(filePath).pipe(csv({ separator: "," }));

  for await (const row of stream) {
    try {
      const input = mapCsvRowToInput(row);
      const result = await importSaleUseCase.execute(input);

      logger.info("Row processed", {
        saleId: input.saleId,
        status: result?.status
      });

    } catch (error) {
      logger.error("Error importing row", {
        saleId: row.sale_id,
        reason: error.message
      });
    }
  }
}

function mapCsvRowToInput(row) {
  return {
    saleId: row.sale_id,
    saleDate: row.sale_date,
    customer: {
      customerId: row.customer_id,
      name: row.customer_name,
      email: row.customer_email
    },
    product: {
      productCode: row.product_code,
      name: row.product_name
    },
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    discount: Number(row.discount || 0),
    paymentMethod: row.payment_method,
    salesChannel: row.sales_channel,
    salespersonId: row.salesperson_id,
    currency: row.currency
  };
}

startWorker().catch(error => {
  logger.error("Worker failed to start", {
    reason: error.message
  });
});
