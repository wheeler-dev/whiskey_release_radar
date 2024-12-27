// parser for weinquelle.com

export default class ShopWeinquelle {
    static async parseArrivals(browser, URL) {
        let arrivals = undefined;

        try {
            const page = await browser.newPage();
            await page.goto(URL);
            
            const data = await page.evaluate(() => {
                let htmlCollection = document.getElementsByClassName('sortrows')[0];
                const children = [...htmlCollection.children];

                let allElements = [];
                children.forEach((child) => {
                    const title = child.getElementsByClassName('art-title-link')[0].innerHTML;
                    const link = child.getElementsByClassName('art-title-link')[0].href;

                    // check if price is available at all
                    const priceAvailable = child.getElementsByClassName('art-price')[0];

                    let price = undefined;

                    if (priceAvailable) {
                        // if there is an oldPrice the selector will be different
                        const oldPrice = priceAvailable.getElementsByClassName('old')[0];

                        if (oldPrice) {
                            price = child.getElementsByClassName('art-price')[0].children[2].innerHTML + '€';
                        } else {
                            price = child.getElementsByClassName('art-price')[0].children[1].innerHTML + '€';
                        }
                    } else {
                        // no price available
                    }

                    let singleElement = {
                        title: title,
                        link: link,
                        price: price
                    };
                    allElements.push(singleElement);
                });

                return allElements;
            });
            
            arrivals = data;
            await page.close();

        } catch (error) {
            console.error(error);
        }

        return arrivals;
    }
}