'use strict';

const express = require('express');
const request = require('supertest');
const expect = require('chai').expect;
const createValidateMiddleware = require('../lib').createValidateMiddleware;
const validate = require('../lib').validate;

describe('createValidateMiddleware', () => {

  describe('not async', () => {

    it('should assign inValid to false', (done) => {
      const middleWare = createValidateMiddleware({
        query: {
          name: {
            presence: true
          }
        }
      });

      const app = express();
      app.get('/', middleWare, (req, res) => {
        try {
          expect(req.isValid).equal(false);
          done();
        } catch (err) {
          done(err);
        }
        res.sendStatus(200);
      });

      request(app).get('/').end();
    });

    it('should populate validationMessages', (done) => {
      const middleWare = createValidateMiddleware({
        query: {
          name: {
            presence: true
          }
        }
      });

      const app = express();
      app.get('/', middleWare, (req, res) => {
        try {
          expect(req.validationMessages).eql({name: ['Name can\'t be blank']});
          done();
        } catch (err) {
          done(err);
        }
        res.sendStatus(200);
      });

      request(app).get('/').end();
    });

    it('should assign inValid to true', (done) => {
      const middleWare = createValidateMiddleware({
        query: {
          name: {
            presence: true
          }
        }
      });

      const app = express();
      app.get('/', middleWare, (req, res) => {
        try {
          expect(req.isValid).equal(true);
          done();
        } catch (err) {
          done(err);
        }
        res.sendStatus(200);
      });

      request(app).get('/?name=Luke').end();
    });

  });

  describe('is async', () => {

    beforeEach(() => {
      validate.validators.myAsyncValidator = function (value) {
        return new validate.Promise((resolve, reject) => {
          setImmediate(() => {
            if (value === 'foo') {
              resolve();
            } else {
              resolve('is not foo');
            }
          });
        });
      };
    });

    afterEach(() => {
      delete validate.validators.myAsyncValidator;
    })

    it('should assign inValid to false', (done) => {
      const middleWare = createValidateMiddleware({
        query: {
          name: {
            myAsyncValidator: true
          }
        },
        isAsync: true
      });

      const app = express();
      app.get('/', middleWare, (req, res) => {
        try {
          expect(req.isValid).equal(false);
          done();
        } catch (err) {
          done(err);
        }
        res.sendStatus(200);
      });

      request(app).get('/').end();
    });

    it('should populate validationMessages', (done) => {
      const middleWare = createValidateMiddleware({
        query: {
          name: {
            myAsyncValidator: true
          }
        },
        isAsync: true
      });

      const app = express();
      app.get('/', middleWare, (req, res) => {
        try {
          expect(req.validationMessages).eql({name: ['Name is not foo']});
          done();
        } catch (err) {
          done(err);
        }
        res.sendStatus(200);
      });

      request(app).get('/').end();
    });

    it('should assign inValid to true', (done) => {
      const middleWare = createValidateMiddleware({
        query: {
          name: {
            myAsyncValidator: true
          }
        },
        isAsync: true
      });

      const app = express();
      app.get('/', middleWare, (req, res) => {
        try {
          expect(req.isValid).equal(true);
          done();
        } catch (err) {
          done(err);
        }
        res.sendStatus(200);
      });

      request(app).get('/?name=foo').end();
    });

  });

});
