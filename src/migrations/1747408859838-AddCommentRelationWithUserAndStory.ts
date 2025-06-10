import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentRelationWithUserAndStory1747408859838 implements MigrationInterface {
    name = 'AddCommentRelationWithUserAndStory1747408859838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "storyId" integer`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_fe13edd1431a248a0eeac11ae43" FOREIGN KEY ("storyId") REFERENCES "story"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_b8804d1590ac402b52f3e945162" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_b8804d1590ac402b52f3e945162"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_fe13edd1431a248a0eeac11ae43"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "ownerId"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "storyId"`);
    }

}
