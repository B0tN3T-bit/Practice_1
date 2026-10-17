"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
const item_entity_1 = require("./items/item.entity");
const _1787040642698_CreateItem_1 = require("./migrations/1787040642698-CreateItem");
(0, dotenv_1.config)();
exports.default = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_DATABASE ?? 'simple_app',
    entities: [item_entity_1.Item],
    migrations: [_1787040642698_CreateItem_1.CreateItem1787040642698],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map