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

// const getTypeOrmConfig: PostgresConnectionOptions = {
//   type: 'postgres',
//   host: process.env.DB_HOST, // 'db' in Docker, 'localhost' in dev
//   port: parseInt(process.env.DB_PORT || '5056'),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   synchronize: false,
//   migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
// }
// export default getTypeOrmConfig;


