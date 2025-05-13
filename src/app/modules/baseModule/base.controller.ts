import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/**
 * Template controller class with common CRUD operations
 */
class BaseController {
  /**
   * Get all resources
   * @param req Express request
   * @param res Express response
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    res.status(StatusCodes.OK).json({
      message: 'Get all resources',
      data: [],
    });
  };

  /**
   * Get a single resource by ID
   * @param req Express request
   * @param res Express response
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    res.status(StatusCodes.OK).json({
      message: `Get resource with ID: ${id}`,
      data: null,
    });
  };

  /**
   * Create a new resource
   * @param req Express request
   * @param res Express response
   */
  create = async (req: Request, res: Response): Promise<void> => {
    res.status(StatusCodes.CREATED).json({
      message: 'Resource created successfully',
      data: req.body,
    });
  };

  /**
   * Update an existing resource
   * @param req Express request
   * @param res Express response
   */
  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    res.status(StatusCodes.OK).json({
      message: `Resource with ID: ${id} updated successfully`,
      data: {
        id,
        ...req.body,
      },
    });
  };

  /**
   * Delete a resource
   * @param req Express request
   * @param res Express response
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    res.status(StatusCodes.OK).json({
      message: `Resource with ID: ${id} deleted successfully`,
    });
  };
}

export default new BaseController();
