import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';

export default async () => {

    try {
        const URL = 'https://www.weisshaus.de/whisky/?p=40';
        const browser = await puppeteer.launch({ 
            headless: false, 
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();

        await page.goto(URL);

        await page.setViewport({
            width: 1200,
            height: 800
        });

        // can not log to console inside puppeteers page.evaluate() function
        // as a workaround we create a new JSDOM from the pagecontent for development
        const pageContent = await page.content();
        const dom = new JSDOM(pageContent);
        const { document } = dom.window;

        let productListContainer = document.getElementsByClassName('listing--container')[0];
        let products = Array.from(productListContainer.getElementsByClassName('listing')[0].children);

        products.forEach((product, index) => {
            const productInfo = product.getElementsByClassName('product--info')[0];

            if (productInfo) {
                let title = productInfo.getElementsByClassName('product--title')[0].title;
                title = title.replace(/&amp;/g, '&');
                let link = productInfo.getElementsByClassName('product--title')[0].href;

                // let priceInfo = productInfo.getElementsByClassName('product--price-info')[0]

                let price = productInfo.getElementsByClassName('price--default')[0].innerHTML;
                price = price.substr(0, price.indexOf('&nbsp;€')).replace(/\n/g, '') + '€';

                let p = {
                    title: title,
                    link: link,
                    price: price
                };

                console.log(p);
            } else {
                // do nothing - not a productlisting but a promotion message
            }
        });

        // let nextButton = document.getElementsByClassName('listing--bottom-paging')[0].getElementsByClassName('right')[0].getElementsByClassName('icon--arrow-right')[0].length > 0

        let nextPageAvailable = document.getElementsByClassName('listing--bottom-paging')[0]
            .getElementsByClassName('right')[0]
            .getElementsByClassName('icon--arrow-right').length > 0;

        console.log(nextPageAvailable);

        // await browser.close()
    } catch (error) {
        console.error(error);
    }
};