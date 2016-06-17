This package gives very easy access to etcd, with local cache.

##Installation

    npm install etcd_cached

##Initialization

    var EtcdCache = require('etcd_cached');
    var etcd = new EtcdCache("URL", 60);

The constructor has 2 arguments:

- **URL**: the URL of the etcd directory
- **TTL**: the TTL for the cache. Use 0 for infinite;


##Registration

To add a value to a key:

    etcd.register("Key", "Value", (err) => {

    });

##De-registration

To remove a key:

    etcd.deRegister("Key", (err) => {

    });

##Getting a value

To get a value for a key:

    etcd.get("Key", (val, err) => {

    });