/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
export const UserRolesEnum = {
    ADMIN: "ADMIN",
    USER: "USER",
  };

export const AvailableUserRoles = Object.values(UserRolesEnum);
