import os from 'os';


export default {
  RABBITMQ_URL: 'amqp://guest:guest@127.0.0.1:5672/autopin?heartbeat=30',
  RABBITMQ_MANAGEMENT_URL: 'http://guest:guest@127.0.0.1:15672',
  MONGODB_URL: 'mongodb://localhost:27017/autopin',
  RABBITMQ_MANAGEMENT_METRICS_PATH: '/api/queues/autopin/bot',
  HOSTNAME: os.hostname()
};
