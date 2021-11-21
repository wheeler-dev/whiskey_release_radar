// parser for getraenkewelt-weiser.de

const puppeteer = require('puppeteer')

module.exports = class shop_GetraenkeWeltWeiser {

    static async parseArrivals() {

        let arrivals = undefined

        try {
            const URL = 'https://www.getraenkewelt-weiser.de/category.php/whisky/neuheiten'
            const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            const page = await browser.newPage()

            await page.goto(URL)
            // await page.setViewport({
            //     width: 1200,
            //     height: 800
            // });

            // scrape data from the current page then press next page button
            let nextPageExists = true
            let data = []

            while (nextPageExists) {

                let itemsToPush = await page.evaluate(() => {
                    let productList = document.getElementsByClassName('productList')[0];
                    let htmlCollection = productList.getElementsByClassName('panel-body')[0];
                    const children = [...htmlCollection.children];

                    let allElementsOnCurrentPage = []

                    children.forEach((child) => {
                        const title = child.getElementsByClassName('artListDesc')[0].firstChild.firstChild.title
            
                        const link = child.getElementsByClassName('artListDesc')[0].firstChild.firstChild.href
            
                        let price = child.getElementsByClassName('artListPrice')[0].innerHTML.trim()
                        price = price.substr(0, price.indexOf(' '))
            
                        let singleElement = {
                            title: title,
                            link: link,
                            price: price
                        }
                        allElementsOnCurrentPage.push(singleElement)
                    });

                    return allElementsOnCurrentPage
                })

                itemsToPush.forEach((item) => {
                    data.push(item);
                })

                nextPageExists = await page.evaluate(() => {
                    let productList = document.getElementsByClassName('productList')[0];
    
                    let pagination = productList.getElementsByClassName('pagination')[0]
                    const paginationListItems = [...pagination.children]

                    let nextPageExistsReturn = false

                    paginationListItems.forEach((listEl) => {
                        if (listEl.firstChild.title === "Nächste Seite") {
                            nextPageExistsReturn = true
                            listEl.firstChild.click();
                        }
                    })

                    return nextPageExistsReturn
                })

                if (nextPageExists) {
                    await page.waitForNavigation()
                }
            }

            console.log('scraped articles getraenkewelt-weiser.de: ', data.length)
            arrivals = data
            await browser.close()

        } catch (error) {
            console.error(error)
        }

        return arrivals

    }

}