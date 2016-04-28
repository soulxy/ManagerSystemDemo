import Redis from "ioredis";
import {Store} from "koa-session2";

export default class RedisStore extends Store {
    constructor() {
        super();
        this.redis = new Redis();
    }

    async get(sid) {
        // return await (this.redis.get(`SESSION:${sid}`));
        try{
            let oRedis = await (this.redis.get(`SESSION:${sid}`));
            return JSON.parse(oRedis);
        }catch(e){
            return {
                errro:e
            };
        }


    }

    async set(session, opts) {
        if(!opts.sid) {
            opts.sid = this.getID(24);
        }
        await this.redis.set(`SESSION:${opts.sid}`, session);
        return opts.sid;
    }

    async destory(sid) {
        return await this.redis.del(sid);
    }
}
