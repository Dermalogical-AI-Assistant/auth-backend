import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Gender, RoleType } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from "class-validator";

export class CreateUserRequestBody {
  @ApiProperty({
    description: "Name",
    maxLength: 255,
    example: "Jasmine",
  })
  @Matches("^[A-Za-z ]+$", "", {
    message: "Name must be alphabetical",
  })
  @MaxLength(255, { message: "Name cannot exceed 255 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name: string;

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

  @ApiProperty({
    description: "Email",
    maxLength: 255,
    example: "jasmine@gmail.com",
  })
  @Matches("^[a-zA-Z0-9_]+@[a-z]+.(com)", "", {
    message: "Email is not the right format",
  })
  @MaxLength(255, { message: "Email cannot exceed 255 characters" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  email: string;

  @ApiPropertyOptional({
    description: "Email",
    maxLength: 255,
    example: "0123456789",
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

  @ApiProperty({
    description: "Date of birth of user",
    example: "2002-07-05",
  })
  @IsISO8601()
  dob: Date;

  @ApiProperty({
    description: "Gender of user",
    example: Gender.FEMALE,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ description: "Role of user", example: RoleType.USER })
  @IsEnum(RoleType)
  role: RoleType;

  @ApiProperty({
    description: "Password",
    example: "tramdethuongquadia",
  })
  @IsString()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  password: string;
}
