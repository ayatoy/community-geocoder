import chai from 'chai';
const assert = chai.assert;
import fs from 'fs'
import path from 'path'

import request from 'supertest'
import { app } from '../src/server'

describe('Tests for `src/server.js` with address list.', () => {
  const data = fs.readFileSync(path.join(path.dirname(__filename), '/addresses.txt'), {encoding: 'utf-8'}).split(/\n/)
  for (let i = 0; i < data.length; i++) {
    if (data[i]) {
      it(`should find the address "${data[i]}" as expected.`, done => {
        request(app)
          .post('/')
          .send({ address: data[i] })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .then(res => {
            assert.property(res.body, 'code')
            assert.include([5, 12], res.body.code.length)
            done()
          })
          .catch(err => done(err))
      });
    }
  }
})
