import { promisify } from 'util';
import { createClient } from 'redis';

/**
 * Represents a redis client
 */
class RedisClient {
    /**
     * Class that creates a new RedisCLient instance.
     */
    constructor() {
        this.client = createClient();
        this.client.on('error', (err) => {
            console.error('Redis client failed to connect:', err.message || err.toString());
            this.isClientConnected = false;
        });
        this.client.on('connect', () => {
            this.isClientConnected = true;
        });
    }
    isAlive() {
        return this.isClientConnected;
    }

    async get(key) {
        return promisify(this.client.GET).bind(this.client)(key);
    }
    
    async set(key, value, duration) {
        await promisify(this.client.SETEX)
            .bind(this.client)(key, duration, value);
    }

    async del(key) {
        await promisify(this.client.DEL).bind(this.client)(key);
    }
}

export const redisClient = new RedisClient();
export default redisClient;
