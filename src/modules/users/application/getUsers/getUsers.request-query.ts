import { ApiPropertyOptional } from "@nestjs/swagger";
import { Gender, Prisma, RoleType } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { GetUsersOrderByEnum } from "../../user.enum";
import { IsOrderQueryParam } from "src/common/decorator/order.decorator";

export class GetUsersRequestQuery {
  @ApiPropertyOptional({
    description: "Search by name or email or country",
    example: "Tram",
  })
  @IsOptional()
  @IsString()
  search?: string | null;

  @ApiPropertyOptional({
    description: `List of values: \n  Available values: ${Object.values(
      Gender
    )}`,
    type: String,
  })
  @IsOptional()
  @Transform(({ value }) => value && (value.split(",") as Gender[]))
  @IsArray()
  genders?: Gender[];

  @ApiPropertyOptional({
    description: "Number of records to skip and then return the remainder",
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => value - 1)
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 1;

  @ApiPropertyOptional({
    description: "Number of records to return and then skip over the remainder",
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  perPage?: number = 10;

  @ApiPropertyOptional({
    description: `Filter by roles, role values just include ${Object.values(RoleType).join(", ")}`,
    example: RoleType.ADMIN,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(RoleType, { each: true })
  @Transform(({ value }) => value && value.split(",").map((role: string) => RoleType[role.trim()] || role.trim()))
  roleTypes: RoleType[];

  @ApiPropertyOptional({
    description: `Order by keyword. \n\n  Available values: ${Object.values(
      GetUsersOrderByEnum
    )}`,
    example: `${GetUsersOrderByEnum.email}:${Prisma.SortOrder.asc}`,
  })
  @IsOptional()
  @IsString()
  @IsOrderQueryParam("order", GetUsersOrderByEnum)
  order?: string;
}
