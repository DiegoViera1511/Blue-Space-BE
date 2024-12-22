import {ZodObject, ZodRawShape, ZodSchema} from "zod";

export function validate<T>(object: any, schema: ZodSchema<T>) {
    return schema.safeParse(object);
}

export function validateUpdate<T extends ZodRawShape>(object: any, schema: ZodObject<T>) {
    return schema.partial().safeParse(object);
}

export const ErrorMessage = (e: any) => {
    return { message: e instanceof Error ? e.message : 'An unknown error occurred' };
};