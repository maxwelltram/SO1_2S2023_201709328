"use strict";

const Redis = require("ioredis");

class RedisConnection {
    constructor() {
        this.client = new Redis({
            host: '172.20.0.2', // reemplaza esto con tu host
            port: 6379, // reemplaza esto con tu puerto
        });

        this.client.on('connect', () => {
            console.log('Conectado a Redis');
        });

        this.client.on('error', (err) => {
            console.log('Error de Redis:', err);
        });
    }

    async get(key){
        return await this.client.get(key);
    }

    async set(key, value){
        return await this.client.set(key, value);
    }

    async keys(pattern){
        return await this.client.keys(pattern);
    }
}

// Uso
const redisClient = new RedisConnection();
