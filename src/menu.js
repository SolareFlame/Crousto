const fs = require('fs');

function getData(row_data) {
    try {
        const menuMatch = row_data.match(/<ul class="meal_foodies">([\s\S]*?)<\/ul>/);
        const dateMatch = row_data.match(/<time class="menu_date_title">([\s\S]*?)<\/time>/);

        return {
            menu: menuMatch ? menuMatch[1] : null,
            date: dateMatch ? dateMatch[1] : null
        };
    } catch (error) {
        console.error("Error reading the file:", error);
        return { menu: null, date: null };
    }
}

function getMenu(menuData) {
    const regex_li = /<li>(.*?)<\/li>/g;
    const menuItems = [];

    let match_li;
    while ((match_li = regex_li.exec(menuData)) !== null) {
        let item = match_li[1];

        if (item.startsWith("Self<ul><li>")) {
            item = item.slice(12);
        }

        menuItems.push(item);
    }
    return menuItems;
}


function getDate(data) {
    return data.date.replace("Menu du ", "");
}

function formatMenu(menu) {
    let res = ""
    let tempmenu = menu;

    tempmenu[0] = "🥬 Entrée: " + tempmenu[0];

    tempmenu.forEach((item) => {
        if (item.startsWith("Plats:")) item = "🍽️ " + item;
        if (item.startsWith("Garnitures:")) item = "🥗 " + item;
        if (item.startsWith("Dessert:")) item = "🍰 " + item;

        item = item.replace(/^(.*?):/g, "**$1**:"); // Bold the first word before ":"
        item = item.replace(/:/g, ":\n"); // Add a new line after ":"
        item = item.replace(/\//g, "\n"); // Add a new line after "/"
        item = item.replace(/\n /g, "\n- "); // Add a "-" after a new line

        res += item + "\n";
        if(menu[menu.indexOf(item) + 1] && menu[menu.indexOf(item) + 1].includes(":")) res += "\n";
    });

    fs.writeFileSync("../test.txt", res);
    return res;
}

module.exports = { getData, getMenu, getDate, formatMenu };
