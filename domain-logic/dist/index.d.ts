import type { ZodTypeAny } from 'zod';
declare type Errors = Record<string, string>;
declare type Result = {
    success: true;
    data: any;
} | {
    success: false;
    errors: Errors;
};
export declare type ActionResult = Result | Promise<Result>;
export declare const onResult: (onError: (r: any) => any, onSuccess: (r: any) => any, r: Result) => any;
export declare const success: (r: any) => Result;
export declare const error: (r: Errors) => Result;
export declare type Transport = 'http' | 'websocket' | 'terminal';
export declare type Action = {
    transport: Transport;
    mutation: boolean;
    parser?: ZodTypeAny;
    action: (input: any) => ActionResult;
};
export declare type Actions = Record<string, Action>;
export declare const tasks: Actions;
export declare type DomainActions = Record<string, Actions>;
declare const rules: DomainActions;
export declare const findAction: (namespace: string, actionName: string) => Action | undefined;
export default rules;
