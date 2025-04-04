import { PassportModule } from "@nestjs/passport";
import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { UserModule } from "./modules/users";
import { AuthModule } from "./modules/auth";
import { SelfModule } from "./modules/self";
import { KafkaModule } from "./modules/kafka";

@Module({
  imports: [
    UserModule,
    AuthModule,
    PassportModule,
    SelfModule,
    KafkaModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
