// import RedisSingleton from "../config/redis.js"
// const redisClient = RedisSingleton.getClient();

// Using DB table to save some deployment cost for this POC
import { AppDataSource } from '../config/db.js';
import {RedisCache} from "./Cache.js";
const redisRepo = AppDataSource.getRepository(RedisCache);

const putValue = async (key, value) => {
    // await redisClient.set(key, value);
    await redisRepo.save({key,  value});
}

const putValueWithExpire = async (key, value, timeAsSec) => {
    const expiration = new Date(Date.now() + timeAsSec * 1000);

    // Check if the entry already exists
    let cacheEntry = await redisRepo.findOne({ where: { key } });

    if (cacheEntry) {
        // Update the existing entry
        cacheEntry.value = value;
        cacheEntry.expiration = expiration;
    } else {
        // Create a new entry
        cacheEntry = await redisRepo.save({
            key,
            value,
            expiration
        });
    }
    //
    // console.log(cacheEntry);

    // await redisClient.set(key, value);
    // await redisClient.expire(key, timeAsSec, "LT")
}


const removeKey = async (key) => {
    // delete the entry
    await redisRepo.delete({key});
    console.log('Cache entry deleted');
}

const getValue = async (key) => {

    // Find the cache entry by key
    const cacheEntry = await redisRepo.findOne({ where: { key } });

    if (cacheEntry) {
        // Check if the entry has expired
        if (cacheEntry.expiration && new Date() > cacheEntry.expiration) {
            // If expired, delete the entry
            await redisRepo.delete({key});
            console.log('Cache entry expired and deleted');
            return null;
        }

        // Return the value if not expired
        console.log(cacheEntry.value);
        return JSON.parse(cacheEntry.value);
    }else {
        // Return null if the entry is not found
        console.log('Cache entry not found');
        return null;
    }

        // const result = await redisClient.get(key);
        // console.log(result);
        // return JSON.parse(result);
}

export {putValue, putValueWithExpire, getValue, removeKey};


