import _ from 'lodash'
export function getProjectsNames (user) {
  return user.organisation_project_user_user &&
    user.organisation_project_user_user.length > 0
    ? _.chain(user.organisation_project_user_user).map('project').map('name').value() : []
}

export function isOrgAdmin (user) {
  return user.is_admin
}
