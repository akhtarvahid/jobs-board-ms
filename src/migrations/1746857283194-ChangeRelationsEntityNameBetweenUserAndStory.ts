import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeRelationsEntityNameBetweenUserAndStory1746857283194 implements MigrationInterface {
    name = 'ChangeRelationsEntityNameBetweenUserAndStory1746857283194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "story" DROP CONSTRAINT "FK_2f8345c3a6d1057ccf612e65a09"`);
        await queryRunner.query(`ALTER TABLE "story" RENAME COLUMN "userId" TO "ownerId"`);
        await queryRunner.query(`ALTER TABLE "story" ADD CONSTRAINT "FK_07fb425a48f0c809bf2be4253a8" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "story" DROP CONSTRAINT "FK_07fb425a48f0c809bf2be4253a8"`);
        await queryRunner.query(`ALTER TABLE "story" RENAME COLUMN "ownerId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "story" ADD CONSTRAINT "FK_2f8345c3a6d1057ccf612e65a09" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
