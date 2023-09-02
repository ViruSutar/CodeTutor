import { DataSource } from "typeorm"
import { entities } from "./Entities"


export default new DataSource({
    type: "postgres",
    host: "localhost",
    synchronize:true,
    port: 5432,
    username: "viraj",
    password: "viraj",
    database: "codetutor",
    entities: entities,
})


