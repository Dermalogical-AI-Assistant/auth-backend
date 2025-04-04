import {
  Controller,
  Delete,
  Param,
  UseGuards,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DeleteUserByIdCommand } from "./deleteUserById.command";
import { DeleteUserByIdRequestParam } from "./deleteUserById.request-param";
import { RoleGuard } from "src/common/role/role.guard";
import { Role } from "src/common/role/role.decorator";
import { AuthenGuard } from "src/common/guard/authen.guard";
import { RoleType } from "@prisma/client";

@ApiTags("User")
@Controller({
  path: "users",
  version: "1",
})
@ApiBearerAuth()
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class DeleteUserByIdEndpoint {
  constructor(protected commandBus: CommandBus) {}

  @ApiOperation({ description: "Delete user by id" })
  @Delete(":id")
  public delete(@Param() { id }: DeleteUserByIdRequestParam): Promise<void> {
    return this.commandBus.execute<DeleteUserByIdCommand, void>(
      new DeleteUserByIdCommand(id)
    );
  }
}
