import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStory1746855392347 implements MigrationInterface {
    name = 'CreateStory1746855392347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "story" ("id" SERIAL NOT NULL, "slug" character varying NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL DEFAULT '', "body" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "modifiedAt" TIMESTAMP NOT NULL DEFAULT now(), "tagList" text NOT NULL, "favoritesCount" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_28fce6873d61e2cace70a0f3361" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "story"`);
    }

}
