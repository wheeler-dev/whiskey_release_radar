// parser for deinwhisky.de and homeofmalts.com

export default class ShopDeinWhiskyHomeOfMalts {
    static async parseArrivals(browser, URL) {
        let arrivals = undefined;

        try {
            const page = await browser.newPage();
            await page.goto(URL);

            // press the load more button until all the elements are loaded
            let loadMoreButtonExists = true;

            while (loadMoreButtonExists) {
                await this.scrollToBottom(page);

                loadMoreButtonExists = await page.evaluate(() => {
                    let buttonCollection = document.getElementsByClassName('js--load-more');
                    let loadMoreButtonExistsReturn = false;

                    if (buttonCollection[0] && buttonCollection[0].innerText === 'Weitere Artikel laden') {
                        buttonCollection[0].click();
                        loadMoreButtonExistsReturn = true;
                    } else {
                        loadMoreButtonExistsReturn = false;
                    }

                    return loadMoreButtonExistsReturn;
                });
            }

            const data = await page.evaluate(() => {
                let htmlCollection = document.getElementsByClassName('listing')[0];
                const children = [...htmlCollection.children];

                let allElements = [];

                children.forEach((child) => {
                    if (child.tagName === 'SCRIPT') {
                        // do nothing
                    } else {
                        const title = child.getElementsByClassName('product--title')[0].title;
                        const link = child.getElementsByClassName('product--title')[0].href;
                        let price = child.getElementsByClassName('price--default')[0].innerHTML.trim();
                        price = price.substr(0, price.indexOf('&nbsp;€')) + '€';

                        let singleElement = {
                            title: title,
                            link: link,
                            price: price
                        };
                        allElements.push(singleElement);
                    }
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

    // for some reason (probably related to puppeteer/chromium) the scroll to bottom and loadmorebutton check does not work when the tab for this shop isnt focused in non-headless mode
    // when run in headless mode everything seems to be working fine
    static async scrollToBottom(page) {
        // scroll to the bottom of the page
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        // wait for the script to load more elements or the button to manually load more
        await page.waitForNetworkIdle();
      
        // check if browser is still at the bottom of the page or more content has been loaded
        let atBottomOfPage = await page.evaluate('(window.innerHeight + window.scrollY) >= document.body.offsetHeight');
        if (!atBottomOfPage) {
            this.scrollToBottom(page);
        } else {
            return;
        }
    }

    // https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore/53527984#53527984
    // static async scrollToBottom(page) {
    //     await page.evaluate(async (page) => {
    //         await new Promise( async (resolve, reject) => {
    //             var totalHeight = 0;
    //             var distance = 100;
    //             var timer = setInterval(() => {
    //                 var scrollHeight = document.body.scrollHeight;
    //                 window.scrollBy(0, distance);
    //                 totalHeight += distance;

    //                 if (totalHeight >= scrollHeight) {
    //                     clearInterval(timer);
    //                     resolve();
    //                 }
    //             }, 0);
    //         });
    //     });
    // }

    // courtesy of https://github.com/mbalabash/puppeteer-autoscroll-down
    // static async scrollPageToBottom(
    //     page,
    //     scrollSize = 250,
    //     scrollDelay = 100,
    //     scrollStepsLimit = null
    //   ) {
    //     const lastScrollPosition = await page.evaluate(
    //       async (pixelsToScroll, delayAfterStep, stepsLimit) => {
    //         const getElementScrollHeight = (element) => {
    //           if (!element) return 0
    //           const { scrollHeight, offsetHeight, clientHeight } = element
    //           return Math.max(scrollHeight, offsetHeight, clientHeight)
    //         }

    //         const scrollToBottom = (resolve) => {
    //           let lastPosition = 0

    //           const intervalId = setInterval(() => {
    //             const { body } = document
    //             const availableScrollHeight = getElementScrollHeight(body)

    //             window.scrollBy(0, pixelsToScroll)
    //             lastPosition += pixelsToScroll

    //             if (
    //               lastPosition >= availableScrollHeight ||
    //               (stepsLimit !== null && lastPosition >= pixelsToScroll * stepsLimit)
    //             ) {
    //               clearInterval(intervalId)
    //               resolve(lastPosition)
    //             }
    //           }, delayAfterStep)
    //         }

    //         return new Promise(scrollToBottom)
    //       },
    //       scrollSize,
    //       scrollDelay,
    //       scrollStepsLimit
    //     )

    //     return lastScrollPosition
    //   }
}