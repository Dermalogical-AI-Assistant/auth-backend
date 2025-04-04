import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Prisma } from "@prisma/client";
import { GetUsersQuery } from "./getUsers.query";
import { GetUsersRequestQuery } from "./getUsers.request-query";
import { GetUsersQueryResponse, GetUsersResponse } from "./getUsers.response";
import { filterString } from "src/common/utils/string";
import { PrismaService } from "src/database";
import { getOrderByDefault } from "src/common/utils/order";

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  public async execute({
    query,
  }: GetUsersQuery): Promise<GetUsersQueryResponse> {
    const { perPage, page } = query;

    const { total, users } = await this.getUsers(query);

    const response = {
      meta: {
        page: page + 1,
        perPage,
        total,
      },
      data: users,
    };

    return response as GetUsersQueryResponse;
  }

  private async getUsers(options: GetUsersRequestQuery) {
    const { search, genders, page, perPage, order, roleTypes } = options;

    const andWhereConditions: Prisma.Enumerable<Prisma.UserWhereInput> = [];

    if (search) {
      andWhereConditions.push({
        OR: [
          {
            name: filterString(search),
          },
          {
            email: filterString(search),
          },
        ],
      });
    }

    if (roleTypes?.length) {
      andWhereConditions.push({
        role: {
          in: roleTypes,
        },
      });
    }

    if (genders?.length) {
      andWhereConditions.push({
        gender: {
          in: genders,
        },
      });
    }

    const [total, users] = await Promise.all([
      this.dbContext.user.count({
        where: {
          AND: andWhereConditions,
        },
      }),
      this.dbContext.user.findMany({
        where: {
          AND: andWhereConditions,
        },
        select: {
          id: true,
          name: true,
          gender: true,
          email: true,
          location: true,
          phone: true,
          avatar: true,
          dob: true,
          role: true,
        },
        orderBy: getOrderByDefault(order),
        skip: page * perPage,
        take: perPage,
      }),
    ]);

    return { total, users };
  }
}
