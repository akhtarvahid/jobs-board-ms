import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDB1746900013045 implements MigrationInterface {
  name = 'SeedDB1746900013045';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('Front-end'), ('Ui'), ('ReactDev'), ('Nestjs'), ('Nodejs')`,
    );

    await queryRunner.query(
      `INSERT INTO "user" (email, username, bio, image, password) VALUES ('akhtar@gmail.com', 'akhtar-ak', 'bio from Seeding', '', '$2b$10$nduVTuamVNuFALhzslP8dev3Avr552ouOUGEg6gRYuNsAz0K7SWoO')`,
    );

    await queryRunner.query(
      `INSERT INTO story (slug, title, description, body, "tagList", "ownerId") VALUES ('hello-1nuk', 'hello-title', 'hello world description', 'hello world body content', 'ui,react', 1), ('Learn-nestjs-h4kn', 'Learn-nestjs', 'Learn-nestjs description', 'Learn-nestjs body content data', 'nodejs,nestjs', 1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
