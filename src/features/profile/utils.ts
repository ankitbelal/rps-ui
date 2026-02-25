export interface ProfileData{
    id:string;
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    gender:string;
    DOB:string;
    address1:string;
    address2:string|null;
}

export interface ProfileApiResponse {
    success:boolean;
    statusCode:number;
    message:string;
    data:ProfileData[];
}