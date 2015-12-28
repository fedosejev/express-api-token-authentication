# Express token based authentication

Example of token based authentication with Node.js, Express.js, MongoDB and Mongoose.

## RESTful API endpoints

### POST `/api/users`

Create a new user.

+ Method: `POST`
+ URL: `/api/users`
+ Body:

```js
{
  "username": "art",
  "password": "secret"
}
```

### POST `/api/users/authenticate`

Authenticate user.

+ Method: `POST`
+ URL: `/api/users/authenticate`
+ Body:

```js
{
  "username": "art",
  "password": "secret"
}
```

### GET `/api/items?token=<token>`

Get items as an authenticated user.

+ Method: `GET`
+ URL: `/api/items?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlbWEiLCJpYXQiOjE0NTEzMTMxOTgsImV4cCI6MTQ1MTMxNjc5OH0.TOi73nhmqGYU_Ajo-ufKcPk5TMmycyNSW3jDghPAHLc`

Example of a token string: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlbWEiLCJpYXQiOjE0NTEzMTMxOTgsImV4cCI6MTQ1MTMxNjc5OH0.TOi73nhmqGYU_Ajo-ufKcPk5TMmycyNSW3jDghPAHLc`

## Install

`npm install`

## Run

`npm start`

## References

+ https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
