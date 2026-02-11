# Sales App Backend (Study Project)

This repository contains the backend code for a sales application. It includes the following components:

- **API**: An Express.js server that handles incoming HTTP requests and routes them to the appropriate controllers.
- **Controllers**: The business logic of the application, responsible for handling requests and interacting with the database.
- **Workers**: Background processes that handle tasks such as importing sales data from CSV files.
- **Infrastructure**: The code that sets up the application's infrastructure, including the database, message broker, and file storage.

## Getting Started

To get started with the application, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install`.
3. Set up the environment variables in the `.env` file.
4. Start the application by running `npm start`.

## Features

The application supports the following features:

- **Sales Management**: Create sales records.
- **CSV Import**: Import sales data from CSV files.

## Stacks Used

The following stacks are used in the project:

- **Node.js**: The project is built using Node.js, which is a JavaScript runtime that allows you to run JavaScript code outside of a web browser.
- **Express.js**: The API is built using Express.js, which is a popular web application framework for Node.js. It provides a simple and flexible way to handle HTTP requests and build web applications.
- **RabbitMQ**: The project uses RabbitMQ as a message broker for real-time notifications. RabbitMQ is an open-source message broker that supports various messaging patterns, including publish/subscribe and request/reply.
- **CSV**: The project imports sales data from CSV files, which is a common format for storing tabular data. The `csv-parser` package is used to parse the CSV files and extract the data.
- **Docker**: The project may use Docker for containerization. Docker allows you to package your application and its dependencies into a container, making it easy to deploy and run consistently across different environments.

## Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue. To contribute code, fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.