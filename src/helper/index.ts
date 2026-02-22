export const getRoleByType = (
  role: string = "",
): "admin" | "teacher" | "student" => {
  if (role.toLowerCase() === "a") {
    return "admin";
  } else if (role.toLowerCase() === "t") {
    return "teacher";
  } else {
    return "student";
  }
};
