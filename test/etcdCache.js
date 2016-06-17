/**
 * Created by iddo on 6/17/16.
 */
"use strict";
var expect    = require("chai").expect;
var EtcdCache = require('./../index');

const demoURL = "https://root:NMGNDTFJAPXJQKGZ@aws-us-east-1-portal.15.dblayer.com:11188/v2/keys/";
const demoInst = new EtcdCache(demoURL, 30);

describe("EtcdCache", () => {

    describe("Object Converter", () => {

        it("Converts a valid string to object", () => {
            var original = {a:1};
            var string = JSON.stringify(original);
            var after = EtcdCache.toObj(string);
            expect(after).to.deep.equal(original);
        });

        it("Converts a valid object to object", () => {
            var original = {a:1};
            var after = EtcdCache.toObj(original);
            expect(after).to.deep.equal(original);
        });

        it("Converts an invalid string to error object", () => {
            var original = "str";
            var after = EtcdCache.toObj(original);
            expect(after).to.deep.equal({
                errorCode: 0,
                message: "Invalid response from ETCD server"
            });
        });
    });

    describe("Error Marshaller", () => {

        it("Should return error naturally", () => {
            var obj = {
                errorCode: 200,
                message: "a"
            };
            expect(EtcdCache.marshallError(obj)).to.equal("a");
        });

        it("Should return formatting error", () => {
            expect(EtcdCache.marshallError(("hello"))).to.equal("Invalid response from ETCD server");
        });

        it("Shouldn't return error", () => {
            var obj = {
                m: "hello"
            };
            expect(EtcdCache.marshallError(obj)).to.equal(null);
        });
    });

    describe("Register", ()=> {
        it("Should register", (done) => {
            demoInst.register("Hello", "World", (err) => {
                expect(err).to.equal(null);
                done();
            });
        });
    });

    describe("Get", () => {
        it("Should get", (done) => {
            demoInst.register("Hello", "World", (err) => {
                expect(err).to.equal(null);
                demoInst.get("Hello", (val, err) => {
                    expect(err).to.equal(null);
                    expect(val).to.equal("World");
                    done();
                });
            });
        });
    });

    describe("Deregister", () => {
        it("Should not exist", (done) => {
            demoInst.register("Hello", "World", (err) => {
                expect(err).to.equal(null);
                demoInst.get("Hello", (val, err) => {
                    expect(err).to.equal(null);
                    expect(val).to.equal("World");
                    demoInst.deRegister("Hello", (err) => {
                        expect(err).to.equal(null);
                        demoInst.get("Hello", (val, err) => {
                            expect(err).to.equal(null);
                            expect(val).to.equal(null);
                            done();
                        });
                    });
                });
            });
        });
    });
});