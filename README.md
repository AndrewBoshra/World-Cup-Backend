# World Cup Backend

Backend for a World Cup ticketing platform — stadiums, teams, matches, seat reservations and payments.

## Stack

Express · MongoDB (Mongoose) · JWT · PayPal Checkout SDK · multer

## Features

- JWT authentication with role-based access for users and administrators
- Stadium, team and match management
- Seat reservation against a match, with availability handling
- Payment through the PayPal Checkout API
- Image upload via multer
- Database seeding from `data-seed.json`

## Running it

```bash
npm install
node seeder.js     # optional: seed reference data
npm run start
```

Configuration (Mongo URI, JWT secret, PayPal credentials) comes from environment variables.

## API

A Postman collection covering every endpoint is included as `Fifa.postman_collection.json`.
