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
            // console.log('--->',`${sid}`);
            let oRedis = await (this.redis.get(`SESSION:${sid}`));
            // console.log('---get-->',oRedis == 'object' ? oRedis : JSON.parse(oRedis));
            return typeof oRedis == 'object' ? oRedis : JSON.parse(oRedis);
        }catch(e){
            return {
                error:e
            };
        }


    }

    async set(session, opts) {
        if(!opts.sid) {
            opts.sid = this.getID(24);
        }
        await this.redis.set(`SESSION:${opts.sid}`, JSON.stringify(session));
        return opts.sid;
    }

    async destory(sid) {
        return await this.redis.del(sid);
    }
}
