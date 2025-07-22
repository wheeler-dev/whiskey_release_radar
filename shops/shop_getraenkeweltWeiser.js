// parser for getraenkewelt-weiser.de

export default class ShopGetraenkeWeltWeiser {
    static async parseArrivals(browser, URL) {
        let arrivals = undefined;

        try {
            const page = await browser.newPage();
            await page.goto(URL);

            // scrape data from the current page then press next page button
            let nextPageExists = true;
            let data = [];

            while (nextPageExists) {
                let itemsToPush = await page.evaluate(() => {
                    let productList = document.getElementsByClassName('productList')[0];
                    let htmlCollection = productList.getElementsByClassName('panel-body')[0];
                    const children = [...htmlCollection.children];

                    let allElementsOnCurrentPage = [];

                    children.forEach((child) => {
                        const title = child.getElementsByClassName('artListDesc')[0].firstChild.firstChild.title;
            
                        const link = child.getElementsByClassName('artListDesc')[0].firstChild.firstChild.href;
            
                        let price = child.getElementsByClassName('artListPrice')[0].innerHTML.trim();
                        price = price.substr(0, price.indexOf(' ')) + '€';
            
                        let singleElement = {
                            title: title,
                            link: link,
                            price: price
                        };
                        allElementsOnCurrentPage.push(singleElement);
                    });

                    return allElementsOnCurrentPage;
                });

                itemsToPush.forEach((item) => {
                    data.push(item);
                });

                nextPageExists = await page.evaluate(() => {
                    let productList = document.getElementsByClassName('productList')[0];
    
                    let pagination = productList.getElementsByClassName('pagination')[0];
                    const paginationListItems = [...pagination.children];

                    let nextPageExistsReturn = false;

                    paginationListItems.forEach((listEl) => {
                        if (listEl.firstChild.title === "Nächste Seite") {
                            nextPageExistsReturn = true;
                            listEl.firstChild.click();
                        }
                    });

                    return nextPageExistsReturn;
                });

                if (nextPageExists) {
                    await page.waitForNavigation();
                }
            }

            arrivals = data;
            await page.close();

        } catch (error) {
            console.error(error);
        }

        return arrivals;
    }
}