import { Response } from 'express';
import { ICommonResponse, IPaginatedResponse, IPagination } from '../interfaces/common';

/**
 * Type guard to check if response is paginated
 */
const isPaginatedResponse = <T>(data: ICommonResponse<T> | IPaginatedResponse<T>): data is IPaginatedResponse<T> => {
  return 'meta' in data;
};

const sendResponse = <T>(res: Response, data: ICommonResponse<T> | IPaginatedResponse<T>): void => {
  const responseData: ICommonResponse<T> | IPaginatedResponse<T> = {
    success: data.success,
    message: data.message,
    data: data.data,
  };

  if (isPaginatedResponse(data)) {
    (responseData as IPaginatedResponse<T>).meta = data.meta;
  }

  res.status(200).json(responseData);
};

export default sendResponse;
