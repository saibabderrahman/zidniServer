
import { ForbiddenException } from "@nestjs/common";

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













  