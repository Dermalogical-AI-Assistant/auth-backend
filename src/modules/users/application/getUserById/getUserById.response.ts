import { Gender, RoleType } from "@prisma/client";
import { UserDto } from "src/generated";

export class GetUserByIdQueryResponse {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  email: string;
  location?: string;
  dob?: Date;
  gender: Gender;
  role: RoleType;
}