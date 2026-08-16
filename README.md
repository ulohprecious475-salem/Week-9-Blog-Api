# Blog API

A RESTful Blog API built with **Node.js, Express.js, MongoDB, and Mongoose**. The API provides user authentication, article CRUD operations, article search, request validation, pagination, and ownership-based authorization.

## Features

* User registration and login
* JWT-based authentication
* Password hashing with bcrypt
* Create, read, update, and delete articles
* Article search using MongoDB text indexes
* Pagination for retrieving articles
* Ownership-based authorization for updating and deleting articles
* Request validation using Joi
* Centralized error handling
* Request logging
* MongoDB integration with Mongoose
* Environment-based configuration
* CORS support
* MVC/layered project structure

## Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JSON Web Token (JWT)**
* **bcrypt**
* **Joi**
* **dotenv**
* **CORS**
* **Nodemon**

## Project Structure

```text
blog-api-week9/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── article.controller.js
│   │   └── user.controller.js
│   │
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   ├── loggers.js
│   │   └── requireAuth.js
│   │
│   ├── models/
│   │   ├── article.model.js
│   │   └── user.model.js
│   │
│   ├── routes/
│   │   ├── article.route.js
│   │   └── user.route.js
│   │
│   ├── services/
│   │   └── auth.service.js
│   │
│   ├── validations/
│   │   ├── post.validation.js
│   │   └── user.validation.js
│   │
│   └── app.js
│
├── index.js
├── package.json
├── README.md
├── .env.example
└── .gitignore
```

## Architecture

The project follows an **MVC/layered architecture** to separate different responsibilities within the application.

```text
Client
   │
   ▼
Routes
   │
   ▼
Validation / Middleware
   │
   ▼
Controllers
   │
   ├── Services
   │
   ▼
Models
   │
   ▼
MongoDB
```

### Routes

Routes define the API endpoints and determine which middleware and controller should handle each request.

### Controllers

Controllers handle HTTP requests and responses and coordinate the application's operations.

### Services

Services contain reusable business logic. The authentication service is responsible for generating JWT tokens.

### Models

Models define the structure of documents stored in MongoDB using Mongoose schemas.

### Middleware

Middleware handles authentication, request logging, and centralized error handling.

### Validations

Joi validation is separated into dedicated validation files to validate incoming request data before it reaches the controllers.

## Authentication

The API uses **JSON Web Tokens (JWT)** for authentication.

After successfully logging in, a user receives a JWT token.

Protected endpoints require the token in the request header:

```http
Authorization: Bearer <your_token>
```

The authentication middleware:

1. Reads the `Authorization` header.
2. Extracts the Bearer token.
3. Verifies the token using the JWT secret.
4. Finds the associated user.
5. Attaches the authenticated user to `req.user`.
6. Allows the request to continue.

Article ownership is also checked before an authenticated user can update or delete an article.

## API Endpoints

### Authentication

| Method | Endpoint             | Description         | Authentication |
| ------ | -------------------- | ------------------- | -------------- |
| POST   | `/api/users/sign-up` | Register a new user | No             |
| POST   | `/api/users/login`   | Log in a user       | No             |

### Articles

| Method | Endpoint               | Description          | Authentication   |
| ------ | ---------------------- | -------------------- | ---------------- |
| POST   | `/api/articles`        | Create an article    | Required         |
| GET    | `/api/articles`        | Get all articles     | Required         |
| GET    | `/api/articles/search` | Search articles      | Required         |
| GET    | `/api/articles/:id`    | Get an article by ID | Required         |
| PUT    | `/api/articles/:id`    | Update an article    | Required + Owner |
| DELETE | `/api/articles/:id`    | Delete an article    | Required + Owner |

## User Registration

### Request

```http
POST /api/users/sign-up
Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "message": "User registered Successfully"
}
```

Passwords are hashed using bcrypt before being stored in the database.

## User Login

### Request

```http
POST /api/users/login
Content-Type: application/json
```

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "message": "logged In",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "your_jwt_token"
}
```

The returned JWT should be included when accessing protected endpoints.

## Create Article

### Request

```http
POST /api/articles
Authorization: Bearer <your_token>
Content-Type: application/json
```

```json
{
  "title": "Getting Started with Node.js",
  "content": "Node.js allows developers to build server-side applications using JavaScript."
}
```

The authenticated user is automatically assigned as the article author.

### Response

```json
{
  "message": "Article created successfully",
  "data": {
    "title": "Getting Started with Node.js",
    "content": "Node.js allows developers to build server-side applications using JavaScript.",
    "author": "user_id"
  }
}
```

## Get All Articles

```http
GET /api/articles
Authorization: Bearer <your_token>
```

Pagination can be controlled using query parameters:

```http
GET /api/articles?page=1&limit=10
```

* `page` — Page number
* `limit` — Number of articles to return

## Get Article by ID

```http
GET /api/articles/:id
Authorization: Bearer <your_token>
```

Example:

```http
GET /api/articles/64abc123...
```

## Search Articles

Articles can be searched using MongoDB text search.

```http
GET /api/articles/search?q=node
Authorization: Bearer <your_token>
```

The search uses the text index defined on the article's `title` and `content` fields.

## Update Article

Only the user who owns an article can update it.

### Request

```http
PUT /api/articles/:id
Authorization: Bearer <your_token>
Content-Type: application/json
```

```json
{
  "title": "Updated Node.js Article",
  "content": "Updated article content with more information."
}
```

## Delete Article

Only the article owner can delete an article.

```http
DELETE /api/articles/:id
Authorization: Bearer <your_token>
```

### Response

```json
{
  "message": "Article deleted successfully"
}
```

## Validation

The API uses **Joi** to validate incoming requests.

### User Validation

Registration validates:

* Name
* Email
* Password

Login validates:

* Email
* Password

### Article Validation

Creating an article validates:

* Title — minimum 5 characters and maximum 200 characters
* Content — minimum 20 characters

Updating an article validates:

* Title — minimum 5 characters and maximum 200 characters
* Content — minimum 20 characters

Validation is handled through middleware before requests reach the controllers.

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### `.env.example`

The repository should contain a `.env.example` file without real credentials:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
```

**Never commit your actual `.env` file or expose your MongoDB credentials or JWT secret.**

## Installation

Clone the repository:

```bash
git clone <your-github-repository-url>
```

Navigate into the project:

```bash
cd blog-api-week9
```

Install the dependencies:

```bash
npm install
```

Create a `.env` file and configure the required environment variables.

## Running the Application

### Development

Run the application using Nodemon:

```bash
npm run dev
```

### Production

Run the application with:

```bash
npm start
```

The server will run on the port specified by the `PORT` environment variable.

## Error Handling

The application uses centralized error-handling middleware to provide consistent error responses.

Example:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes include:

| Status | Meaning               |
| ------ | --------------------- |
| 400    | Bad Request           |
| 401    | Unauthorized          |
| 403    | Forbidden             |
| 404    | Not Found             |
| 500    | Internal Server Error |

## Security

The API implements several security practices:

* Passwords are hashed using bcrypt.
* JWT authentication protects private routes.
* JWT secrets are stored in environment variables.
* MongoDB credentials are stored in environment variables.
* Article ownership is verified before updates and deletions.
* `.env` should be excluded from version control.

## Deployment

The API can be deployed to **Render** or another Node.js-compatible hosting platform.

Configure the following environment variables in the deployment platform:

```text
PORT
MONGODB_URI
JWT_SECRET
```

The production start command is:

```bash
npm start
```

After deployment, the API can be accessed using the URL provided by the hosting platform.

## Author

**Precious Uloh**

Backend Developer

* GitHub: https://github.com/ulohprecious475-salem
* LinkedIn: https://www.linkedin.com/in/precious-uloh-9059a42b5

## License

This project is licensed under the ISC License.
