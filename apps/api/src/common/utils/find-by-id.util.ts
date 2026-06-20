import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isValidObjectId, Model, HydratedDocument } from 'mongoose';

/**
 * Generic helper to find a document by ID with validation and error handling.
 */
export async function findDocumentById<T>(
  model: Model<T>,
  id: string,
  entityName: string,
): Promise<HydratedDocument<T>> {
  if (!isValidObjectId(id)) {
    throw new BadRequestException(`Invalid ${entityName} ID`);
  }
  const doc = await model.findById(id);
  if (!doc) {
    throw new NotFoundException(`${entityName} not found`);
  }
  return doc as HydratedDocument<T>;
}

/**
 * Validates if a string is a valid MongoDB ObjectId.
 */
export function validateObjectId(id: string, entityName: string): void {
  if (!isValidObjectId(id)) {
    throw new BadRequestException(`Invalid ${entityName} ID`);
  }
}
