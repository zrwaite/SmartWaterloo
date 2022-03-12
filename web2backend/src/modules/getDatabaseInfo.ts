import pool from "../database/db";
import {decrypt} from "./encryption";
const encryptedUserKeys = [
	{iv: "nickname_iv", name: "nickname"}
]
const defaultUser = {
	nickname:""
}

type defaultEntry = typeof defaultUser;
const parseRow = (defaultReturn:defaultEntry, encryptedKeys:{iv:string, name:string}[], rows: any[]) => {
	let result = defaultReturn;
	encryptedKeys.forEach((pair) => {
		result[pair.name as keyof typeof defaultReturn] = decrypt({iv: rows[0][pair.iv], content: rows[0][pair.name]})
	})
	return result;
}
const getEntries = async (multi: boolean, idKey:string, idValue:string, tableName: string, defaultReturn:defaultEntry, encryptedKeys:{iv:string, name:string}[]) => {
	console.log("hello");
	let entries:any;
	let status;
	let queryParams = "";
	let errors = []
	encryptedKeys.forEach((pair, i) => queryParams += `${i?", ":""}${pair.iv}, ${pair.name}`);
	try {
		if (multi) {
			entries = await pool.query(`SELECT ${queryParams} FROM ${tableName}`)
		} else {
			entries = await pool.query(
				`SELECT ${queryParams} FROM ${tableName} WHERE ${idKey} = $1 LIMIT 1`,
				[idValue]
			)
		}
		console.log(entries.rows);
		if (entries.rows) {
			let results = [];
			for (let i = 0; i<entries.rows.length; i++) {
				results.push(parseRow(defaultReturn, encryptedKeys, entries.rows));
			}
			status = 200;
			entries = results;
		} else status = 404;
	} catch (e) {
		console.log(e)
		errors.push(e);
		status = 400;
	}
	return {status: status, entries: entries, errors: errors};
}
const getUser = async (userid:string) => {
	const {status, entries, errors} = await getEntries(false, "userid", userid, "users", defaultUser, encryptedUserKeys);
	return {status: status, user: entries[0], errors: errors}
}
const getUsers = async () => {
	const {status, entries, errors} = await getEntries(true, "", "", "users", defaultUser, encryptedUserKeys);
	return {status: status, users: entries, errors: errors}
}
export {getUser, getUsers}