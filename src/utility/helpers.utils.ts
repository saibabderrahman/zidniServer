

import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  GoneException,
  HttpVersionNotSupportedException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  NotImplementedException,
  ImATeapotException,
  MethodNotAllowedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  PreconditionFailedException,
} from '@nestjs/common';
import { LoggerService } from 'src/logger.service';

export function filterNullEmptyPropertiesInArray(arr: any[]): any[] {
    return arr.map((obj) => filterNullEmptyProperties(obj));
  }
  
  export function filterNullEmptyProperties(obj: any): any {
    const filteredObj: any = {};
  
    for (const key in obj) {
      const value = obj[key];
  
      if (value !== null && !isEmpty(value)) {
        filteredObj[key] = value;
      }
    }
  
    return filteredObj;
  }
  
  function isEmpty(value: any): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
  
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length === 0;
    }
  
    return false;
  }

  export  interface Options  {
    page?: number;
    limit?: number;
  }


 export async function queryAndPaginate(queryBuilder, offset, limit) {
   const totalCount = await queryBuilder.getCount();
   const hasMore = totalCount > offset + limit;
   queryBuilder.skip(offset).take(limit);
   const data = await queryBuilder.getMany();
   return { totalCount, hasMore, data };
 }
export function validateOrderState(orderState: string, validStates: string[]): void {
  if (!validStates.includes(orderState)) {
    throw new ForbiddenException(`Sorry, you can't update the order in its current state. It must be one of: ${validStates.join(', ')}`);
  }
}

export function handleError(message: string, error: any ,logger:LoggerService ,service:string): void {
  logger.error(message, error, service);
  if (error instanceof BadRequestException) {
    throw new BadRequestException(error.message || 'Bad Request');
  } else if (error instanceof UnauthorizedException) {
    throw new UnauthorizedException(error.message || 'Unauthorized');
  } else if (error instanceof NotFoundException) {
    throw new NotFoundException(error.message || 'Not Found');
  } else if (error instanceof ForbiddenException) {
    throw new ForbiddenException(error.message || 'Forbidden');
  } else if (error instanceof NotAcceptableException) {
    throw new NotAcceptableException(error.message || 'Not Acceptable');
  } else if (error instanceof RequestTimeoutException) {
    throw new RequestTimeoutException(error.message || 'Request Timeout');
  } else if (error instanceof ConflictException) {
    throw new ConflictException(error.message || 'Conflict');
  } else if (error instanceof GoneException) {
    throw new GoneException(error.message || 'Gone');
  } else if (error instanceof HttpVersionNotSupportedException) {
    throw new HttpVersionNotSupportedException(error.message || 'HTTP Version Not Supported');
  } else if (error instanceof PayloadTooLargeException) {
    throw new PayloadTooLargeException(error.message || 'Payload Too Large');
  } else if (error instanceof UnsupportedMediaTypeException) {
    throw new UnsupportedMediaTypeException(error.message || 'Unsupported Media Type');
  } else if (error instanceof UnprocessableEntityException) {
    throw new UnprocessableEntityException(error.message || 'Unprocessable Entity');
  } else if (error instanceof InternalServerErrorException) {
    throw new InternalServerErrorException(error.message || 'Internal Server Error');
  } else if (error instanceof NotImplementedException) {
    throw new NotImplementedException(error.message || 'Not Implemented');
  } else if (error instanceof ImATeapotException) {
    throw new ImATeapotException(error.message || 'I\'m a teapot');
  } else if (error instanceof MethodNotAllowedException) {
    throw new MethodNotAllowedException(error.message || 'Method Not Allowed');
  } else if (error instanceof BadGatewayException) {
    throw new BadGatewayException(error.message || 'Bad Gateway');
  } else if (error instanceof ServiceUnavailableException) {
    throw new ServiceUnavailableException(error.message || 'Service Unavailable');
  } else if (error instanceof GatewayTimeoutException) {
    throw new GatewayTimeoutException(error.message || 'Gateway Timeout');
  } else if (error instanceof PreconditionFailedException) {
    throw new PreconditionFailedException(error.message || 'Precondition Failed');
  } else {
    throw new BadRequestException(error.message || 'Bad Request');
  }
}













  