import { NotFoundException } from "@nestjs/common";
import { GetUserByIdQuery } from "./getUserById.query";
import { GetUserByIdQueryResponse } from "./getUserById.response";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "src/database";

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly dbContext: PrismaService) {}

  private async getUserById(id: string) {
    const user = await this.dbContext.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        phone: true,
        avatar: true,
        gender: true,
        dob: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found!");
    }

    return user;
  }

  public async execute(
    query: GetUserByIdQuery
  ): Promise<GetUserByIdQueryResponse> {
    const user = await this.getUserById(query.id);
    return user;
  }
}
