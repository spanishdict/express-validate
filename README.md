# express-validate

:straight_ruler: Query param and body validator middleware for Express.

## Install

```
npm i -S express-validate
```

## Usage

```js
const express = require('express');
const createValidateMiddleware = require('express-validate').createValidateMiddleware;

const app = express();

app.get('/', createValidateMiddleware({
  query: {
    name: {
      presence: true
    }
  }
}), function (req, res) {
  // isValid will be true if all query params passes constrains.
  if (!req.isValid) {
    // If any query param is invalid, `validationMessages` will be populated.
    req.validationMessages
  }
})
```

## API

### `createValidateMiddleware(opts)`

- `opts.query: Object` Query param validator
- `opts.isAsync: boolean` (Optional) Assign to true if we want to use any async valiator. See [writting an async validator of validate.js](http://validatejs.org/#custom-validator-async).
