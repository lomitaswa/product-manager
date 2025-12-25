import dotenv from 'dotenv';
dotenv.config();

export const env = {
    port: process.env.PORT || 3000,
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT || 5432)
    },
    rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost',
    jwtSecret: process.env.JWT_SECRET || 'your-default-secret'
};