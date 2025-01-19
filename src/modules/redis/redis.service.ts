import { Injectable } from '@nestjs/common';
import { InventoriesRepository } from 'src/modules/inventories/inventories.repo';

const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient();

const setnxAsync = promisify(redisClient.setnx).bind(redisClient);
const pexpire = promisify(redisClient.pexpire).bind(redisClient);

@Injectable()
export class RedisService {
    constructor(
        private inventoryRepository: InventoriesRepository) {

    }
    async accquireLock(productId, quantity, cartId) {
        const key = `lock_v2025_${productId}`;
        const retryTimes = 10;
        const expire = 3000;

        for (let i = 0; i < retryTimes; i++) {
            const result = await setnxAsync(key, cartId);
            if (result === 1) {
                const isReversation = await this.inventoryRepository.reservationInventory(productId, quantity, cartId);
                if (isReversation) {
                    await pexpire(key, expire);
                    return key;
                }

                return null;
            }
            else {
                await new Promise((resolve) => setTimeout(resolve, 50));
            }
        }
    }

    async releaseLock(productId, cartId) {
        const deleteAsync = promisify(redisClient.del).bind(redisClient);
        return await deleteAsync(`lock_v2025_${productId}`);
    }
}
