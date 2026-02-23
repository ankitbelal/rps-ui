export const getRoleByType = (
  role: string = "",
): "superadmin" | "admin" | "teacher" | "student" => {
  if (role.toLocaleLowerCase() === "sa") {
    return "superadmin";
  } else if (role.toLowerCase() === "a") {
    return "admin";
  } else if (role.toLowerCase() === "t") {
    return "teacher";
  } else {
    return "student";
  }
};
