import { entities } from "./Entities"
import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    synchronize:true,
    username: "viraj",
    password: "Viraj@2402",
    database: "codetutor",
    entities: entities,
})

export default AppDataSource;


