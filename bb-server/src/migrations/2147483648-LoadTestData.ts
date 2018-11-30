import { readFileSync } from "fs";
import { MigrationInterface, QueryRunner } from "typeorm";

export class LoadTestData2147483648 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		const sql = readFileSync("./sql/load_test_data.sql").toString();
		return queryRunner.query(sql);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		const sql = readFileSync("./sql/delete_test_data.sql").toString();
		return queryRunner.query(sql);
	}

}
