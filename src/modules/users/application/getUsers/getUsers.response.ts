import { ApiProperty } from '@nestjs/swagger';
import { Gender, RoleType } from '@prisma/client';
import { PaginatedOutputDto } from 'src/common/dto/pageOutput.dto';

export class GetUsersResponse {
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

export class GetUsersQueryResponse extends PaginatedOutputDto<GetUsersResponse> {
  @ApiProperty({
    description: 'List of users',
    isArray: true,
  })
  data: GetUsersResponse[];
}
