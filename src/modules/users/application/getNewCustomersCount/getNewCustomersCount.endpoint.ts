import { Controller, Get, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetNewCustomersCountQuery } from "./getNewCustomersCount.query";
import { GetNewCustomersCountQueryResponse } from "./getNewCustomersCount.response";
import { PaginatedOutputDto } from "src/common/dto/pageOutput.dto";
import { Role } from "src/common/role/role.decorator";
import { RoleType } from "@prisma/client";
import { RoleGuard } from "src/common/role/role.guard";
import { AuthenGuard } from "src/common/guard/authen.guard";

@ApiTags("User")
@Controller({
  path: "new-customers-count",
  version: "1",
})
@ApiBearerAuth()
@UseGuards(AuthenGuard, RoleGuard)
@Role(RoleType.ADMIN)
export class GetNewCustomersCountEndpoint {
  constructor(protected queryBus: QueryBus) { }

  @ApiOperation({ description: "Get new customers count by month" })
  @Get()
  public get(
  ): Promise<PaginatedOutputDto<GetNewCustomersCountQueryResponse>> {
    return this.queryBus.execute<
      GetNewCustomersCountQuery,
      PaginatedOutputDto<GetNewCustomersCountQueryResponse>
    >(new GetNewCustomersCountQuery());
  }
}
