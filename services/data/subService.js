import {
    addSubscription,
    getSubscriptionsByGuildId,
    removeSubscription
} from "../../db/subscriptions.js";
import {getGuild} from "../../db/guild.js";

export async function listSubscriptions(guildId) {
    if(await getGuild(guildId) === null) {
        throw new Error("Guild not found in database. Please register the guild first.");
    }

    return await getSubscriptionsByGuildId(guildId);
}

export async function follow(guildId, channelId, rId, cronExpr, roleId = null) {
    if(await getGuild(guildId) === null) {
        throw new Error("Guild not found in database. Please register the guild first.");
    }

    return addSubscription(guildId, channelId, rId, cronExpr, roleId);
}
export async function unfollow(guildId, channelId, rId) {
    return removeSubscription(guildId, channelId, rId);
}
