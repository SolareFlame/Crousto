import {countUsers} from "../../db/user.js";

export async function getTotalUsers() {
    return countUsers();
}