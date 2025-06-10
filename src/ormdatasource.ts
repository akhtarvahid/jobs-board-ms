import { DataSource } from 'typeorm';
import getTypeOrmConfig from '@app/ormconfig';

export default new DataSource(getTypeOrmConfig);
