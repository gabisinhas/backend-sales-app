import { getRabbitChannel } from "./rabbitConnection.js";
import { QUEUES } from "./queues.js";

export async function publishImportSales(message) {
  const channel = await getRabbitChannel();

  await channel.assertQueue(QUEUES.IMPORT_SALES, {
    durable: true
  });

  channel.sendToQueue(
    QUEUES.IMPORT_SALES,
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );

  console.log("Message published to RabbitMQ:", message);
}
