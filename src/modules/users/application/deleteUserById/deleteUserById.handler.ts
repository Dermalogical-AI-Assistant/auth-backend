import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserByIdCommand } from "./deleteUserById.command";
import { PrismaService } from "src/database";
import { ValidationService } from "src/modules/services/validation.service";
import { KafkaProducerService } from "src/modules/kafka/services";
import { UserTopic } from "src/common/topic/user.topic";

@CommandHandler(DeleteUserByIdCommand)
export class DeleteUserByIdHandler
  implements ICommandHandler<DeleteUserByIdCommand>
{
  constructor(
    private readonly dbContext: PrismaService,
    private readonly validationService: ValidationService,
    private readonly kafkaProducer: KafkaProducerService
  ) {}

  public async execute(command: DeleteUserByIdCommand): Promise<void> {
    const userId = command.id;
    await this.validationService.validateUserExistsById(userId);
    await this.dbContext.user.delete({ where: { id: userId } });
    await this.kafkaProducer.sendMessage(UserTopic.DELETE_USER, userId);
  }
}
