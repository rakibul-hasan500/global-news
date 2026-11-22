import {responseHandler} from "@/utils/responseHandler";

export const zodErrorHandler = (validation: any): string => {
    const errorMessage: string = validation?.error?.issues?.map((issue: any)=> issue?.message)?.[0] || "Something went wrong"
    return responseHandler("E", errorMessage)
}