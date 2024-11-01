import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730398287351 implements MigrationInterface {
    name = 'Migration1730398287351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pictures" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "url" character varying NOT NULL, "hero_id" integer NOT NULL, CONSTRAINT "PK_7aa5e10dd31983e9f05b9f1fc85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "heroes" ("id" SERIAL NOT NULL, "nickname" character varying NOT NULL, "real_name" character varying NOT NULL, "origin_description" character varying NOT NULL, "superpowers" character varying NOT NULL, "catch_phrase" character varying, CONSTRAINT "PK_9db096e6a3c6fe87c82c0af18fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pictures" ADD CONSTRAINT "FK_00ca779e643014340b96f9d82c5" FOREIGN KEY ("hero_id") REFERENCES "heroes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pictures" DROP CONSTRAINT "FK_00ca779e643014340b96f9d82c5"`);
        await queryRunner.query(`DROP TABLE "heroes"`);
        await queryRunner.query(`DROP TABLE "pictures"`);
    }

}
