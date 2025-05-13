# Auth-Core Example with Express TypeScript Starter

This repository demonstrates the implementation of two projects:

1. [Auth-Core](https://github.com/maulikatwork/auth-core) - A reusable authentication library
2. [Node-Express-TS-Starter-Boilerplate](https://github.com/maulikatwork/Node-Express-TS-Starter-Boilerplate) - A comprehensive Node.js Express TypeScript starter

This example shows how to integrate the Auth-Core library with a Node.js Express TypeScript application.

## Features

- **TypeScript** - Modern, type-safe JavaScript superset
- **Express** - Fast, unopinionated web framework for Node.js
- **Authentication** - Multiple auth strategies via Auth-Core:
  - Email + Password
  - Phone Number + OTP
  - OAuth logins (Google, Apple, GitHub)
- **REST API** - Structured API with versioning support
- **MongoDB Integration** - Ready-to-use Mongoose setup
- **Modular Architecture** - Feature-based structure for easy scalability
- **Request Validation** - Joi validation middleware for request data
- **Error Handling** - Global error handler with appropriate status codes
- **Logging** - Advanced logging with Winston and Morgan (console + file)
- **Security** - Helmet configuration for HTTP headers
- **API Rate Limiting** - Protection against brute force attacks
- **CORS** - Configurable Cross-Origin Resource Sharing
- **Environment Configuration** - Using dotenv for flexible configuration
- **Code Quality** - ESLint and Prettier integration
- **Hot Reloading** - Fast development with ts-node-dev
- **Production Ready** - PM2 integration for process management

## Project Structure

```
.
├── src/                        # Source code
│   ├── app/                    # Application code
│   │   ├── errors/             # Custom error classes
│   │   ├── middlewares/        # Express middlewares
│   │   ├── modules/            # Feature modules
│   │   │   └── baseModule/     # Base module template
│   │   │       ├── base.controller.ts
│   │   │       ├── base.model.ts
│   │   │       ├── base.routes.ts
│   │   │       ├── base.service.ts
│   │   │       └── base.validator.ts
│   │   └── routers/            # Router definitions
│   ├── config/                 # Configuration files
│   ├── interfaces/             # TypeScript interfaces
│   ├── shared/                 # Shared utilities
│   ├── utils/                  # Utility functions
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── Docs/                       # Documentation
├── logs/                       # Application logs
├── dist/                       # Compiled output
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── ecosystem.config.json       # PM2 configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for database features)

## Setup and Installation

1. **Clone the repository**

```bash
git clone https://github.com/maulikatwork/auth-core-example
cd auth-core-example
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure environment variables**

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=5002
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=90d
```

4. **Start development server**

```bash
npm run dev
# or
yarn dev
```

The server will start on port 5002 (or the port specified in your .env file).

5. **Test the API**

Import the Postman collection from `Docs/postman_collection.json` to test all available endpoints.

The collection includes requests for:

- Authentication (login, logout, profile)
- Base module endpoints
- OAuth integration

6. **Build for production**

```bash
npm run build
# or
yarn build
```

7. **Start production server**

```bash
npm start
# or
yarn start
```

## Development Guidelines

### Creating a New Module

The project follows a modular structure. Each feature should be organized as a module with the following components:

1. **Model** - Database schema and interface
2. **Controller** - Request handlers
3. **Service** - Business logic
4. **Routes** - API endpoints
5. **Validator** - Request validation schemas

To create a new module, follow these steps:

1. **Create a new directory in `src/app/modules/`**

```bash
mkdir src/app/modules/userModule
```

2. **Create the required files based on the baseModule template:**

```bash
touch src/app/modules/userModule/user.model.ts
touch src/app/modules/userModule/user.controller.ts
touch src/app/modules/userModule/user.service.ts
touch src/app/modules/userModule/user.routes.ts
touch src/app/modules/userModule/user.validator.ts
```

3. **Model Implementation Example:**

```typescript
// user.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
```

4. **Validator Implementation Example:**

```typescript
// user.validator.ts
import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required().min(2).messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().min(6).messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('user', 'admin').default('user'),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name must be at least 2 characters',
  }),
  email: Joi.string().email().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be valid',
  }),
  role: Joi.string().valid('user', 'admin'),
});

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: string;
}
```

5. **Service Implementation Example:**

```typescript
// user.service.ts
import User, { IUser } from './user.model';
import { CreateUserInput, UpdateUserInput } from './user.validator';

class UserService {
  getAll = async (): Promise<IUser[]> => {
    return User.find();
  };

  getById = async (id: string): Promise<IUser | null> => {
    return User.findById(id);
  };

  create = async (data: CreateUserInput): Promise<IUser> => {
    return User.create(data);
  };

  update = async (id: string, data: UpdateUserInput): Promise<IUser | null> => {
    return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  };

  delete = async (id: string): Promise<boolean> => {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  };
}

export default new UserService();
```

6. **Controller Implementation Example:**

```typescript
// user.controller.ts
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import userService from './user.service';

class UserController {
  getAll = async (req: Request, res: Response): Promise<void> => {
    const users = await userService.getAll();

    res.status(StatusCodes.OK).json({
      message: 'Users retrieved successfully',
      data: users,
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await userService.getById(id);

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: `User with ID: ${id} not found`,
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: 'User retrieved successfully',
      data: user,
    });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const user = await userService.create(req.body);

    res.status(StatusCodes.CREATED).json({
      message: 'User created successfully',
      data: user,
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updatedUser = await userService.update(id, req.body);

    if (!updatedUser) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: `User with ID: ${id} not found`,
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const success = await userService.delete(id);

    if (!success) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: `User with ID: ${id} not found`,
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: 'User deleted successfully',
    });
  };
}

export default new UserController();
```

7. **Routes Implementation Example:**

```typescript
// user.routes.ts
import express from 'express';
import userController from './user.controller';
import { createUserSchema, updateUserSchema } from './user.validator';
import requestValidator from '../../middlewares/requestValidator';

const userRouter = express.Router();

userRouter.get('/', userController.getAll);
userRouter.get('/:id', userController.getById);
userRouter.post('/', requestValidator(createUserSchema), userController.create);
userRouter.put('/:id', requestValidator(updateUserSchema), userController.update);
userRouter.delete('/:id', userController.delete);

export default userRouter;
```

8. **Register the routes in `src/app/routers/version1.ts`:**

```typescript
// version1.ts
import express from 'express';
import baseRouter from '../modules/baseModule/base.routes';
import userRouter from '../modules/userModule/user.routes';

const routersVersionOne = express.Router();

routersVersionOne.use('/base', baseRouter);
routersVersionOne.use('/users', userRouter);

export default routersVersionOne;
```

### Best Practices

1. **Modular Architecture**

   - Keep each module self-contained with its own model, controller, service, routes, and validator
   - Minimize dependencies between modules

2. **Separation of Concerns**

   - Models: Define schema and database interactions
   - Services: Implement business logic
   - Controllers: Handle HTTP requests and responses
   - Validators: Define and validate request schemas
   - Routes: Define API endpoints

3. **Error Handling**

   - Use the global error handler for consistent error responses
   - Create custom error classes for specific error cases

4. **Validation**

   - Validate all incoming requests using Joi schemas
   - Return descriptive validation error messages

5. **Asynchronous Programming**

   - Use async/await for all asynchronous operations
   - Catch and handle errors appropriately

6. **Security**
   - Always validate and sanitize user inputs
   - Use proper authentication and authorization
   - Apply rate limiting for API endpoints
   - Set secure HTTP headers using Helmet

## Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the application for production
- `npm start` - Run the application in production mode
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code using Prettier

## License

ISC
