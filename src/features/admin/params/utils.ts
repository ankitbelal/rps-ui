export interface Params{
    id:number;
    code:string;
    name:string;
}

export interface ParamsApiResponse {
    success:boolean;
    statusCode:number;
    message:string;
    data:Params[];
    total:number;
    page:number;
    limit:number;
    lastPage:number;
}

export interface QueryParams{
    search:string;
    page:number;
    limit:number;
}

export interface EvaluationParameterFormData {
    code: string;
    name: string;
}