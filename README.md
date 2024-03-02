## Backend Documentation
This backend template is designed to provide a starting point for Node.js applications using Express and Passport for authentication. It includes basic authentication functionality, a modular structure for scalability, and documentation to guide developers through setup and usage.

## Purpose
The project aims to expedite the development of backend systems for web applications by providing a structured template with essential features pre-configured. Developers can leverage this template to kickstart their projects, focusing more on application-specific logic rather than setting up authentication and backend infrastructure from scratch.

## Requirements
To run this backend template properly, ensure you have the following prerequisites:
- Node.js installed on your system
- MySQL or compatible database server
- Basic understanding of Node.js and Express

## Setup
1. Clone this repository to your local machine.
2. Navigate to the project directory and run `npm install` to install dependencies.
3. Create a mysql database as described below.
4. Create a `.env` file in the project root and set up environment variables as described in the documentation.
5. Run `npm run dev` to start the development server.
6. Access the backend APIs at the specified port (default: 3000) and integrate them with your frontend application.

---

## Some more details:
### About env variables
The `.env` file must contain the following variables (see `example.env` file):
- `PORT`: Port number for the server to listen on.
- `FRONT_END_URL`: URL of the frontend application. (used for CORS)
- `DB_HOST`: Host address of the database.
- `DB_USER`: Username for the database.
- `DB_PASSWORD`: Password for the database.
- `DB_NAME`: Name of the database.

### About Express
Express is a Node.js web application framework that provides a robust set of features for web and mobile applications.
See more [here](https://expressjs.com) 

### About CORS
CORS (Cross-Origin Resource Sharing) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served. It is important to setup in the right way the cors middleware in order to properly use the api (see above .env configuration)

### About passport
Passport is authentication middleware for Node.js. It is extremely flexible and can be used with any Node.js web framework, such as Express.
See more [here](https://www.passportjs.org) 

### Backend structure
The backend structure consists of:
- `templateBackend.js`: Main server file handling middleware setup, routes, and server initialization.
- `passportConfig.js`: Configuration for Passport authentication.
- `routes/`: Directory containing route handlers.
- `connection.js`: File handling the database connection.

### Database connection
The database connection is established using the `connection.js` file, where database credentials are retrieved from environment variables and a connection pool is created using the `mysql` package, of course you can easily edit the `templateBackend.js`, `passportConfig.js`, `connection.js` and the routes under `routes` to use other databases (or eventualy a simple js list, but it's not optimal for production)

### Database queries
Database queries are performed using the `mysql` package. Queries for user authentication, registration, and user data retrieval are defined in various route handlers. 
See more about SQL [here](https://www.w3schools.com/sql)
See more about the mysql package  [here](https://www.npmjs.com/package/mysql)

### Database structure used in this example
The database used for this template contains only a `Users` table with the following structure:

| Field      | Type         | Description         |
|------------|--------------|---------------------|
| Id         | INT          | Unique user ID      |
| Username   | TEXT         | User's username     |
| Password   | TEXT         | User's password     |
| ImageUrl   | TEXT         | URL of user's image |

### API Documentation
#### Authentication

##### Login

- **URL**: `/login`
- **Method**: `POST`
- **Body**:
  - `username`: User's username.
  - `password`: User's password.
- **Success Response**: A session cookie is set upon successful login.
- **Error Response**: `401` with an error message if authentication fails.

##### Register

- **URL**: `/register`
- **Method**: `POST`
- **Body**:
  - `username`: Desired username.
  - `password`: Desired password.
  - `confirmPassword`: Confirmation of the password.
- **Success Response**: `200` with message "User Created successfully".
- **Error Response**: `422` if user already exists or passwords do not match.

#### User Endpoints

##### Get User Information

- **URL**: `/user`
- **Method**: `GET`
- **Authentication Required**: Yes
- **Success Response**: `200` with user information.
- **Error Response**: `401` if user is not authenticated.

##### Logout

- **URL**: `/logout`
- **Method**: `POST`
- **Success Response**: `200` with message "logged out".

##### User Image Update

- **URL**: `/api/user`
- **Method**: `POST`
- **Body**:
  - `image`: New image URL.
  - `id`: User's ID.
- **Authentication Required**: Yes
- **Success Response**: `200` with message "Image Updated Successfully".
- **Error Response**: `401` if not authenticated, `422` if required fields are missing.

##### User Password Update

- **URL**: `/api/user`
- **Method**: `PATCH`
- **Body**:
  - `password`: New password.
  - `confirmPassword`: Confirmation of the new password.
  - `id`: User's ID.
- **Authentication Required**: Yes
- **Success Response**: `200` with message "User Password Updated successfully".
- **Error Response**: `401` if not authenticated, `422` if passwords do not match or required fields are missing.

#### Error Codes

- `401` - Unauthorized: Authentication is required and has failed or has not yet been provided.
- `422` - Unprocessable Entity: The request was well-formed but was unable to be followed due to semantic errors.


---

## Production
For production deployment, it's recommended to:
- Configure environment variables in a secure manner.
- Use a process manager like PM2 to maintain the application uptime and manage process scaling.
- Set up proper logging and error handling to monitor the application in production environments.