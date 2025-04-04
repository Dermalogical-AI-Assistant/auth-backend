import { ApiPropertyOptional } from "@nestjs/swagger";
import { Gender, RoleType } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsEnum,
  IsISO8601,
  IsOptional,
  IsUrl,
  Matches,
  MaxLength,
} from "class-validator";

export class UpdateUserByIdRequestBody {
  @ApiPropertyOptional({
    description: "Name",
    maxLength: 255,
    example: "Jasmine",
  })
  @IsOptional()
  @Matches("^[A-Za-z ]+$", "", {
    message: "Name must be alphabetical",
  })
  @MaxLength(255, { message: "Name cannot exceed 255 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name?: string;

  @ApiPropertyOptional({
    description: "Location",
    maxLength: 255,
    example: "Vietnam",
  })
  // @Matches("^[a-zA-Z\\s]+$", "", {
  //   message: "Location must be alphabetical",
  // })
  @IsOptional()
  @MaxLength(255, { message: "Location cannot exceed 255 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  location?: string;

  @ApiPropertyOptional({
    description: "Avatar",
    maxLength: 255,
  })
  @IsOptional()
  @MaxLength(255, { message: "Avatar url cannot exceed 255 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({
    description: "Email",
    maxLength: 255,
    example: "jasmine@gmail.com",
  })
  @IsOptional()
  @Matches("^[a-zA-Z0-9_]+@[a-z]+.(com)", "", {
    message: "Email is not the right format",
  })
  @MaxLength(255, { message: "Email cannot exceed 255 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  email?: string;

  @ApiPropertyOptional({
    description: "Email",
    maxLength: 255,
    example: "jasmine@gmail.com",
  })
  @IsOptional()
  @Matches(/^\+?\d{1,15}$/, {
    message: "Phone is not the right format",
  })
  // ^\+? → Allows an optional + for country codes.
  // \d{1,15}$ → Ensures the phone number contains only digits (up to 15 digits, per international standards).
  @MaxLength(15, { message: "Phone cannot exceed 15 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  phone?: string;

  @ApiPropertyOptional({
    description: "Date of birth of user",
    example: "2002-07-05",
  })
  @IsOptional()
  @IsISO8601()
  dob?: Date;

  @ApiPropertyOptional({
    description: "Gender of user",
    example: Gender.FEMALE,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ description: "Role of user", example: RoleType.USER })
  @IsOptional()
  @IsEnum(RoleType)
  role?: RoleType;
}
