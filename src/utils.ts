import {ZodObject, ZodRawShape, ZodSchema} from "zod";

export function validate<T>(object: any, schema: ZodSchema<T>) {
    return schema.safeParse(object);
}

export function validatePartial<T extends ZodRawShape>(object: any, schema: ZodObject<T>) {
    return schema.partial().safeParse(object);
}

export const ErrorMessage = (e: any) => {
    return {message: e instanceof Error ? e.message : 'An unknown error occurred'};
};

export enum StatusCode {
    NOT_FOUND = 404,
    SERVER_ERROR = 500,
    BAD_REQUEST = 400,
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    UNAUTHORIZED = 401
}

export const APIMessage =  (message: string) => {
    return {message: JSON.parse(message)}
};

export enum StatusMessage {
    NOT_FOUND = "Not found",
    NO_CONTENT = "No content",
    DELETED = "Deleted successfully",
    CREATED = "Created successfully",
    UPDATED = "Updated successfully",
    UNAUTHORIZED = "Unauthorized"
    
}

export enum SocketEvent {
    NOTIFICATION = "notification",
    REGISTER = "register",
    CONNECTION = "connection"
}

