import app from './app.js';
import { env } from './config/env.js';
import { initDB } from './config/db.js';
import { initRabbitMQ } from './services/rabbitmq.service.js';

async function bootstrap() {
    await initDB();
    await initRabbitMQ();

    app.listen(env.port, () => {
        console.log(`Server running on port ${env.port}`);
    });
}

bootstrap();