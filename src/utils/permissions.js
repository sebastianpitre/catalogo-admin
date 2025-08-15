export const hasPermission = (user, codename) => {
  const groupPerms = user?.groups?.flatMap(group =>
    group.permissions ? group.permissions.map(p => p.codename) : []
  ) || [];

  const userPerms = user?.user_permissions?.map(p => p.codename) || [];

  const allPerms = new Set([...groupPerms, ...userPerms]);
  return allPerms.has(codename);
};


export const isInGroup = (user, groupName) => {
  return user?.groups?.some(group => group.name === groupName);
};
