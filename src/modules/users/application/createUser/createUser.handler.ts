import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "./createUser.command";
import { CreateUserRequestBody } from "./createUser.request-body";
import { PrismaService } from "src/database";
import * as dayjs from "dayjs";
import { hashString } from "src/common/utils/string";
import { LoginUserDto } from "src/common/dto/loginUser.dto";
import { RoleType } from "@prisma/client";
import { BadRequestException } from "@nestjs/common";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute(command: CreateUserCommand): Promise<LoginUserDto> {
    await this.validateUserExists(command.body.email);

    return await this.createUser(command.body);
  }

  private async createUser(body: CreateUserRequestBody): Promise<LoginUserDto> {
    const {
      name,
      location,
      avatar,
      dob,
      phone,
      role,
      email,
      password,
      gender,
    } = body;

    const hashedPassword = hashString(password);

    const user = await this.dbContext.user.create({
      data: {
        name,
        email,
        gender,
        avatar,
        location,
        phone,
        role,
        dob: dayjs(dob, { utc: true }).toDate(),
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        dob: true,
        gender: true,
        avatar: true,
        role: true,
      },
    });

    return user;
  }

  private async validateUserExists(email: string) {
    const user = await this.dbContext.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) {
      throw new BadRequestException("User with this email existed!");
    }
    return user;
  }
}
