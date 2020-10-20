import * as config from "config";
import * as mysql from "mysql2/promise";

const c:any = config.get("database");

const Pool = mysql.createPool({
	host: c.host,
	user: c.user,
	password: c.password,
	database: c.name,
	connectionLimit: 100,
	supportBigNumbers: true,
	waitForConnections: true
});

export { Pool };
