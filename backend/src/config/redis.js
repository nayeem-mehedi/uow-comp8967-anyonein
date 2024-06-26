import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class RedisSingleton {
    constructor() {
      if (!RedisSingleton.instance) {
        this.client = createClient({
          url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        });
  
        this.client.on('error', (err) => {
          console.error('Redis client error', err);
        });
  
        this.client.connect();
  
        RedisSingleton.instance = this;
      }
  
      return RedisSingleton.instance;
    }
  
    getClient() {
      return this.client;
    }
  }
  
  const instance = new RedisSingleton();
  Object.freeze(instance);
  
  export default instance;
