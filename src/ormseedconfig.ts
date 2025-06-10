import getTypeOrmConfig from "./ormconfig";

const ormseedconfig = {
    ...getTypeOrmConfig,
    migrations: ['src/seeds/*.ts']
}

export default ormseedconfig;