# Getting Started with node server App

## Installation

Enter to the server folder

```bash
cd server
```

Install the node_modules

```bash
npm i
```

## Available Scripts

you can run:

### `npm start`

- It will run the app with node
- The page will not reload if you make edits.

### `npm run dev`

- Runs the app with nodemon
- The page will reload if you make edits
- The print at the terminal will be purple with the message:

`server run on: http://:localhost : 8181`

And if there are no login errors you should see the message painted in purple:

`connected to MongoDb!`

### Available Routes

#### Register a new user

```http
  POST /api/users/register
```

#### Login a user

```http
  POST /api/users/login
```

#### For Information about a user

```http
  GET /api/users/userInfo
```

You will need to provide a token to get an answer from this api

#### To receive all business cards

```http
  GET /api/cards/cards
```

#### To get a business card of a specific business

```http
  GET /api/cards/card/:id
```

#### To receive all business cards of the registered user

```http
  GET /api/cards/my-cards
```

You will need to provide a token to get an answer from this api

#### To create a new business card

```http
  POST /api/cards/
```

You will need to provide a token to get an answer from this api

#### To update a business card

```http
  PUT /api/cards/:id
```

You will need to provide a token to get an answer from this api

#### To delete a business card

```http
  DELETE /api/cards/:id
```

You will need to provide a token to get an answer from this api
