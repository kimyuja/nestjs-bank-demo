import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as config from 'config';

// const dbConfig = config.get('db');

// export const typeORMConfig: TypeOrmModuleOptions = {
//     type: dbConfig.type,
//     host: process.env.RDS_HOSTNAME || dbConfig.host,
//     port: process.env.RDS_PORT || dbConfig.port,
//     username: process.env.RDS_USERNAME || dbConfig.username,
//     password: process.env.RDS_PASSWORD || dbConfig.password,
//     database: process.env.RDS_DB_NAME || dbConfig.database,
//     entities: [__dirname + '/../**/*.entity.{js,ts}'],
//     synchronize: false
// }

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'passwd',
    database: 'bank-app',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
}