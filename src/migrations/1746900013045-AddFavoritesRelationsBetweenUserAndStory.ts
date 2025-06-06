import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavoritesRelationsBetweenUserAndStory1746900013045 implements MigrationInterface {
    name = 'AddFavoritesRelationsBetweenUserAndStory1746900013045'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favorites_story" ("userId" integer NOT NULL, "storyId" integer NOT NULL, CONSTRAINT "PK_bd3df1569171b5def678060005a" PRIMARY KEY ("userId", "storyId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_35b75bfdfcfb69152debd4ecbb" ON "user_favorites_story" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_dbd7db088869f3deab29bdf5f4" ON "user_favorites_story" ("storyId") `);
        await queryRunner.query(`ALTER TABLE "user_favorites_story" ADD CONSTRAINT "FK_35b75bfdfcfb69152debd4ecbbe" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorites_story" ADD CONSTRAINT "FK_dbd7db088869f3deab29bdf5f48" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites_story" DROP CONSTRAINT "FK_dbd7db088869f3deab29bdf5f48"`);
        await queryRunner.query(`ALTER TABLE "user_favorites_story" DROP CONSTRAINT "FK_35b75bfdfcfb69152debd4ecbbe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dbd7db088869f3deab29bdf5f4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35b75bfdfcfb69152debd4ecbb"`);
        await queryRunner.query(`DROP TABLE "user_favorites_story"`);
    }

}
