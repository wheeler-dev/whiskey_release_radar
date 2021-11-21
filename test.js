const puppeteer = require('puppeteer')
const { JSDOM } = require('jsdom')
const fs = require('fs')

// can not log to console inside puppeteers page.evaluate() function
// as a workaround we create a new JSDOM from the pagecontent for development
module.exports = async () => {

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
            // console.log('title: ', title)

            const link = child.getElementsByClassName('artListDesc')[0].firstChild.firstChild.href
            // console.log('link: ', link)

            let price = child.getElementsByClassName('artListPrice')[0].innerHTML.trim()
            price = price.substr(0, price.indexOf(' '))
            // console.log('price: ', price)

            // i++
            // console.log(i, '---------------------------------------------------------------------------------------------------------------')

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

        // fs.readFile('lastCollection.json', 'utf-8', (err, data) => {
        //     const dataAr = JSON.parse(data)
        //     console.log(dataAr)
        // });

        // fs.writeFile('lastCollection.json', JSON.stringify(allElements), 'utf-8', () => {
        //     console.log('wrote to file')
        // })

        // let array1 = []
        // let array2 = []

        // fs.readFile('lastCollection.json', 'utf-8', (err, data) => {
        //     array1 = JSON.parse(data)
        //     string1 = data
        //     string1 = string1.replace(/\\"/g, '"');
        //     // console.log(array1)

        //     fs.readFile('lastCollectionPLUS1.json', 'utf-8', (err, data) => {
        //         array2 = JSON.parse(data)
        //         string2 = data
        //         // console.log(array2)

        //         console.log('a1: ', array1.length)
        //         console.log('a2: ', array2.length)

        //         array2.forEach((element) => {
        //             if (string1.indexOf(element.title) === -1) {
        //                 console.log('neu: ', element)
        //             }
        //             // console.log(element.title)
        //             // console.log(string1.indexOf(element.title))
        //         })

        //     });
        // });


        // console.log(array1)
        // console.log(array2)


        // await browser.close()
    } catch (error) {
        console.error(error)
    }
}