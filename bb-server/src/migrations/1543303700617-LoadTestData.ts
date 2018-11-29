import { MigrationInterface, QueryRunner } from "typeorm";

export class LoadTestData1543303700617 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<any> {
		// load load_test_data.sql into string and execute
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		// load delete_test_data.sql into string and execute
	}

}
