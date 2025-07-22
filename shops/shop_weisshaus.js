// parser for weisshaus.de

export default class ShopWeisshaus {
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
                    let productListContainer = document.getElementsByClassName('listing--container')[0];
                    let products = Array.from(productListContainer.getElementsByClassName('listing')[0].children);

                    let allElementsOnCurrentPage = [];

                    products.forEach((product, index) => {
                        const productInfo = product.getElementsByClassName('product--info')[0];
    
                        if (productInfo) {
                            let title = productInfo.getElementsByClassName('product--title')[0].title;
                            title = title.replace(/&amp;/g, '&');
                            let link = productInfo.getElementsByClassName('product--title')[0].href;
    
                            let price = productInfo.getElementsByClassName('price--default')[0].innerHTML;
                            price = price.substr(0, price.indexOf('&nbsp;€')).replace(/\n/g, '') + '€';
                            
                            let singleElement = {
                                title: title,
                                link: link,
                                price: price
                            };

                            allElementsOnCurrentPage.push(singleElement);
                        } else {
                            // do nothing - not a productlisting, but a promotion message
                        }
                    });

                    return allElementsOnCurrentPage;
                });

                itemsToPush.forEach((item) => {
                    data.push(item);
                });

                nextPageExists = await page.evaluate(async () => {
                    let nextPageExistsReturn = false;
                    
                    if (document.getElementsByClassName('listing--bottom-paging')[0]
                        .getElementsByClassName('right')[0]
                        .getElementsByClassName('icon--arrow-right').length > 0) {
                        nextPageExistsReturn = true;
                        document.getElementsByClassName('listing--bottom-paging')[0]
                            .getElementsByClassName('right')[0]
                            .getElementsByClassName('icon--arrow-right')[0]
                            .parentElement.click();
                    }

                    return nextPageExistsReturn;
                });

                // await page.waitForNetworkIdle()
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