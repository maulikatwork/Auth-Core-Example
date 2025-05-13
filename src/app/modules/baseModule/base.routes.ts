import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import baseController from './base.controller';
import { createBaseSchema, updateBaseSchema } from './base.validator';
import requestValidator from '../../middlewares/requestValidator';

const baseRouter = express.Router();

baseRouter.get('/', baseController.getAll);

baseRouter.get('/:id', baseController.getById);

baseRouter.post('/', requestValidator(createBaseSchema), baseController.create);

baseRouter.put('/:id', requestValidator(updateBaseSchema), baseController.update);

baseRouter.delete('/:id', baseController.delete);

baseRouter.get('/template', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Template endpoint working successfully',
  });
});

export default baseRouter;
