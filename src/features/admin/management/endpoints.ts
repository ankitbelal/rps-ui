type EndPointType ={
    [key:string]:string;
}

export const ManagementApiEndpoints:EndPointType ={
    LIST_GRADE_RANGE:"/result/grading-system",
    ADD_GRADINGS:"/result/add-grading",
    PROMOTION_LOGS:"/audit-trail",
    PROMOTE_STUDENT:"/students/promote-students"
}