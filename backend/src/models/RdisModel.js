import RedisSingleton from "../config/redis.js"

const redisClient = RedisSingleton.getClient();

const putValue = async (key, value) => {
    await redisClient.set(key, value);
}

const putValueWithExpire = async (key, value, timeAsSec) => {
    await redisClient.set(key, value);
    await redisClient.expire(key, timeAsSec, "LT")
}

const getValue = async (key) => {
    const result = await redisClient.get(key);
    console.log(result);
    return JSON.parse(result);
}

export {putValue, putValueWithExpire, getValue};