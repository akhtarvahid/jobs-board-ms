import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFollows1747059927175 implements MigrationInterface {
    name = 'CreateFollows1747059927175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "follows" ("id" SERIAL NOT NULL, "followerId" character varying NOT NULL, "followingId" character varying NOT NULL, "followedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "follows"`);
    }

}
