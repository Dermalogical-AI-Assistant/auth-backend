export enum GetUsersOrderByEnum {
  name = 'name',
  email = 'email',
  phone = 'phone',
  location = 'location',
  dateOfBirth = 'dateOfBirth',
  createdAt = 'createdAt',
}

export enum PatchUserByIdAction {
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
}