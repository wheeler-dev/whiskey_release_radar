// parser for fassgeist.de

export default class ShopFassgeist {

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
  
            const productList = document.getElementsByClassName('product-list')[0];
            const products = Array.from(productList.children);
  
            const allElementsOnCurrentPage = [];
  
            products.forEach((product) => {
  
              const title = product.getElementsByClassName('product-item__title')[0].innerHTML;
              const link = product.getElementsByClassName('product-item__title')[0].href;
              const price = product.getElementsByClassName('price')[0].innerHTML;
  
              const singleElement = {
                title,
                link,
                price
              };
  
              allElementsOnCurrentPage.push(singleElement);
  
            });
  
            return allElementsOnCurrentPage;
          });
  
          itemsToPush.forEach((item) => {
            data.push(item);
          });
  
          nextPageExists = await page.evaluate(async () => {
  
            let nextPageExistsReturn = false;
            const toolbar = document.getElementsByClassName('pagination')[0];
  
            if (toolbar.getElementsByClassName('pagination__next')[0]) {
              nextPageExistsReturn = true;
              toolbar.getElementsByClassName('pagination__next')[0].click();
            }
  
            return nextPageExistsReturn;
          });
  
          await page.waitForNetworkIdle();
        }
  
        arrivals = data;
        await page.close();
  
      } catch (error) {
        console.error(error);
      }
  
      return arrivals;
  
    }
  
  }