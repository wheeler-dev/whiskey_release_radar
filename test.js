const puppeteer = require('puppeteer')
const { JSDOM } = require('jsdom')
const fs = require('fs')
const file_manager = require('./file-manager')

// can not log to console inside puppeteers page.evaluate() function
// as a workaround we create a new JSDOM from the pagecontent for development
module.exports = async () => {


    // fs.readFile('./storage/weinquelle_modified' + '.json', 'utf-8', async (err, data) => {
    //     const value = JSON.parse(data)
    //     console.log('length: ', value.length)
    //     const ergebnis = await file_manager.compareWithRecentData(value, 'weinquelle')
    //     console.log('newArrivalsWeinquelle: ', ergebnis)
    // })


    // return



    try {
        const URL = 'https://www.getraenkewelt-weiser.de/category.php/whisky/neuheiten'
        const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()

        await page.goto(URL)

        await page.setViewport({
            width: 1200,
            height: 800
        });

        const pageContent = await page.content();
        const dom = new JSDOM(pageContent);
        const { document } = dom.window;

        let productList = document.getElementsByClassName('productList')[0];
        let htmlCollection = productList.getElementsByClassName('panel-body')[0];
        const children = [...htmlCollection.children];

        let i = 0
        let allElements = []
        children.forEach((child) => {
            // console.log(child.getAttributeNames())
            // console.log(child.getAttribute('id'))

            const title = child.getElementsByClassName('artListDesc')[0].firstChild.firstChild.title

            const link = child.getElementsByClassName('artListDesc')[0].firstChild.firstChild.href

            let price = child.getElementsByClassName('artListPrice')[0].innerHTML.trim()
            price = price.substr(0, price.indexOf(' '))
            
            let singleElement = {
                title: title,
                link: link,
                price: price
            }
            allElements.push(singleElement)

        });

        let pagination = productList.getElementsByClassName('pagination')[0]
        let paginationListItems = [...pagination.children]

        console.log(paginationListItems)

        paginationListItems.forEach((listEl) => {
            if (listEl.firstChild.title === "Nächste Seite") {
                console.log('el: ', listEl.firstChild.href)
            } else {
            }
        })

        console.log(allElements)
        console.log(allElements.length)

        // await browser.close()
    } catch (error) {
        console.error(error)
    }
}