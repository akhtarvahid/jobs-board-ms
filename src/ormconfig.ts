import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const getTypeOrmConfig: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5056,
    username: 'medium',
    password: 'medium',
    database: 'medium',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
}
export default getTypeOrmConfig;