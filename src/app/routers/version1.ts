import express from 'express';
import baseRouter from '../modules/baseModule/base.routes';
import authRouter from '../modules/auth/auth.routes';

const routersVersionOne = express.Router();

// Base router
routersVersionOne.use('/base', baseRouter);

// Auth routes
routersVersionOne.use('/auth', authRouter);

// Basic routes can be added here
// Example:
// routersVersionOne.use('/example', exampleRouter);

export default routersVersionOne;
