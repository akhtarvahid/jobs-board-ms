import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationsBetweenUserAndStory1746857026110 implements MigrationInterface {
    name = 'AddRelationsBetweenUserAndStory1746857026110'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "story" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "story" ADD CONSTRAINT "FK_2f8345c3a6d1057ccf612e65a09" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "story" DROP CONSTRAINT "FK_2f8345c3a6d1057ccf612e65a09"`);
        await queryRunner.query(`ALTER TABLE "story" DROP COLUMN "userId"`);
    }
}
