import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetNewCustomersCountQuery } from "./getNewCustomersCount.query";
import { GetNewCustomersCountQueryResponse } from "./getNewCustomersCount.response";
import { PrismaService } from "src/database";
import { RoleType } from "@prisma/client";
import * as dayjs from 'dayjs';

@QueryHandler(GetNewCustomersCountQuery)
export class GetNewCustomersCountHandler implements IQueryHandler<GetNewCustomersCountQuery> {
  constructor(private readonly dbContext: PrismaService) { }

  public async execute(): Promise<GetNewCustomersCountQueryResponse> {
    const now = dayjs();

    const startOfCurrentMonth = now.startOf('month').toDate();
    const endOfCurrentMonth = now.endOf('month').toDate();

    const [newCustomersCount, totalUsersCount] = await Promise.all([
      this.dbContext.user.count({
        where: {
          role: RoleType.USER,
          createdAt: {
            gte: startOfCurrentMonth,
            lte: endOfCurrentMonth,
          },
        },
      }),
      this.dbContext.user.count({
        where: {
          role: RoleType.USER,
        },
      }),
    ]);

    return {
      newCustomersCount,
      totalUsersCount,
      incrementalRate: newCustomersCount / totalUsersCount * 100
    }
  }
}
