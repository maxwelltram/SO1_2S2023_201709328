const config = {
    redis: {
        host: "172.20.0.2",
        retries: 3,
        time_to_retry: 100,
        time_live: 3600 
    }
}

module.exports = config;
