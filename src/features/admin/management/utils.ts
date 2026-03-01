export interface GradeRange {
    id:number;
    minGPA:string;
    maxGPA:string;
    grade:string;
    remarks:string;
    createdAt:string;
}

export interface ListGradeResponse {
    success:boolean;
    statusCode:number;
    message:string;
    data:GradeRange[];
}

interface User {
    name:string;
}

export interface PromotionLogs{
    id:number;
    actCode:string;
    action:string;
    comment:string;
    user:User;
    createdAt:string;
}

export interface PromotionApiResponse {
    success:boolean;
    statusCode:number;
    message:string;
    data:PromotionLogs[];
    total:number;
    page:number;
    lastPage:number;
    limit:number;
}

export interface Params {
    type:string;
    page:number;
    limit:number;
}