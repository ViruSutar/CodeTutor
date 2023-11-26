import { entities } from "./Entities"
import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    synchronize:true,
    port: 5432,
    username: "viraj",
    password: "viraj",
    database: "codetutor",
    entities: entities,
})

export default AppDataSource;


