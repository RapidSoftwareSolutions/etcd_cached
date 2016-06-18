/**
 * Created by iddo on 6/17/16.
 */
"use strict";
var request = require('request');
var NodeCache = require( "node-cache" );

class EtcdCache {

    static toObj(a) {
        if (typeof a != 'object') {
            try {
                a = JSON.parse(a);
            } catch (e) {
                a = {
                    errorCode: 0,
                    message: "Invalid response from ETCD server"
                };
            }
        }

        return a;

    }

    static marshallError(a) {
        a = EtcdCache.toObj(a);
        if (a.hasOwnProperty("errorCode"))
            return a.message;
        return null;
    }

    constructor (baseURL, ttl) {
        this.ETCD_URL = baseURL;
        this.ttl = ttl;

        this.cache = new NodeCache({ stdTTL: this.ttl, checkperiod: this.ttl });
    }

    register(key, value, cb) {
        request.put(this.ETCD_URL+key, {rejectUnauthorized: false, form:{value:value}}, (err,httpResponse,body) => {
            if (!err) err = EtcdCache.marshallError(body);
            cb(err);
        });
    }

    deRegister(key, cb) {
        request.delete(this.ETCD_URL+key, {rejectUnauthorized: false}, (err,httpResponse,body) => {
            if(!err) err = EtcdCache.marshallError(body);
            this.cache.del(key, (err, count) => {
                cb(err);
            });
        });
    }

    get(key, cb) {
        this.cache.get(key, (err, val) => {
            if (err || !val || val == undefined) { //Cache miss
                request.get(this.ETCD_URL+key, {rejectUnauthorized: false}, (err, httpResponse, body) => {
                    body = EtcdCache.toObj(body);
                    if(!err) err = EtcdCache.marshallError(body);
                    if (err == "Key not found") cb(null, null)
                    else if (err) cb(null, err);
                    else {
                        this.cache.set(key, body.node.value);
                        cb(body.node.value, null);
                    }
                });
            } else { //Cache hit
                cb(val, null);
            }
        });
    }
}

module.exports = EtcdCache;