import amqp from "amqplib";

let channel;

export async function getRabbitChannel() {
  if (channel) return channel;

  const connection = await amqp.connect("amqp://localhost");
  channel = await connection.createChannel();

  return channel;
}
