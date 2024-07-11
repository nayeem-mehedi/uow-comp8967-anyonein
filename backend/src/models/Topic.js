import { EntitySchema } from "typeorm";

export const Topic = new EntitySchema({
    name: "Topic",
    tableName: "topics",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        name: {
            type: "varchar"
        }
    }
});
