import { upsertToken } from "../../db/token.js";

export async function recordToken(token, label, menuId) {
    if (!token || token.length === 0) return;
    return upsertToken(token, label, menuId);
}

