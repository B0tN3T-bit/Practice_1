"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateItem1787040642698 = void 0;
class CreateItem1787040642698 {
    name = 'CreateItem1787040642698';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`item\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`description\` varchar(255) NULL,
        \`done\` tinyint NOT NULL DEFAULT 0,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`item\``);
    }
}
exports.CreateItem1787040642698 = CreateItem1787040642698;
//# sourceMappingURL=1787040642698-CreateItem.js.map