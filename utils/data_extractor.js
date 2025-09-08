import * as cheerio from "cheerio";

export function parseHtml(html) {
    const decoded = html
        .replace(/\\u003C/g, "<")
        .replace(/\\u003E/g, ">")
        .replace(/\\"/g, '"');

    const $ = cheerio.load(decoded);

    const sections = [];

    $("h2").each((_, el) => {
        const title = $(el).text().trim();
        const content = $(el).next("p").html()
            ?.replace(/<br\s*\/?>/gi, "\n")
            ?.replace(/<img[^>]*alt=["']?([^"']+)["']?[^>]*>/gi, "[$1]")
            ?.replace(/<[^>]+>/g, "")
            ?.trim();

        if (content) {
            sections.push({ title, content });
        }
    });

    return {sections };
}
