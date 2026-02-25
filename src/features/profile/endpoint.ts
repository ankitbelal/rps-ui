type EndPoint = {
    [key:string]:string;
}

const ProfileApiEndPoints:EndPoint ={
    ADMIN_PROFILE_DATA:"/admins?self=1",
    UPDATE_ADMIN_PROFILE:"/admins/self-edit",
    TEACHER_PROFILE_DATA:"/teacher?self=1",
    UPDATE_TEACHER_PROFILE:"/teacher/self-edit",
    UPDATE_PASSWORD:"/user/change-password"
}


export default ProfileApiEndPoints;