import { IMenuItem } from 'routers/routes'

//unuse
export const hasPermissionRouter = (route: IMenuItem, menuRoles: string[]) => {
  const submoduleArrray = Array.isArray(route.permissionModule)
    ? route.permissionModule
    : route.permissionModule
      ? [route.permissionModule]
      : []
  const actionArrray = Array.isArray(route.actionPermission)
    ? route.actionPermission
    : route.actionPermission
      ? [route.actionPermission]
      : []
  let isValidPermission = true

  submoduleArrray.forEach((module) => {
    if (!menuRoles.includes(module)) isValidPermission = false
  })
  actionArrray.forEach((module) => {
    if (!menuRoles.includes(module)) isValidPermission = false
  })
  return isValidPermission
}
