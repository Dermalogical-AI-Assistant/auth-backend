import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import * as dayjs from "dayjs";
import { UpdateUserByIdCommand } from "./updateUserById.command";
import { UpdateUserByIdRequestBody } from "./updateUserById.request-body";
import { PrismaService } from "src/database";
import { ValidationService } from "src/modules/services";
import { KafkaProducerService } from "src/modules/kafka/services";
import { UserTopic } from "src/common/topic/user.topic";

@CommandHandler(UpdateUserByIdCommand)
export class UpdateUserByIdHandler
  implements ICommandHandler<UpdateUserByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly validationService: ValidationService,
    private readonly kafkaProducer: KafkaProducerService
  ) {}

  public async execute(command: UpdateUserByIdCommand): Promise<void> {
    return this.updateUserById(command.id, command.body);
  }

  private async updateUserById(
    id: string,
    body: UpdateUserByIdRequestBody
  ): Promise<void> {
    const { name, email, phone, dob, role, location, avatar, gender } = body;

    await this.validationService.validateUserExistsById(id);

    const user = await this.dbContext.user.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        role,
        location,
        gender,
        dob: dayjs(dob, { utc: true }).toDate(),
        avatar,
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
      }
    });

    await this.kafkaProducer.sendMessage(UserTopic.UPDATE_USER, user);
  }
}
