// parser for whiskyworld.de

export default class ShopWhiskyWorld {

    static async parseArrivals(browser, URL) {
  
      let arrivals = undefined;
  
      try {
        const page = await browser.newPage();
  
        await page.goto(URL);
  
        // scrape data from the current page then press next page button
        let nextPageExists = true;
        let data = [];
  
        while (nextPageExists) {
  
          let section;
  
          let itemsToPush = await page.evaluate(() => {
  
            section = document.getElementById('content');
            const productList = section.getElementsByClassName('grid-x')[2];
            const products = Array.from(productList.children);
  
            const allElementsOnCurrentPage = [];
  
            products.forEach((product, index) => {
  
              const productContainer = product.getElementsByClassName('product-container')[0];
  
              let title = productContainer.getElementsByClassName('item-brand')[0].innerHTML + ' ' + productContainer.getElementsByClassName('item-description')[0].innerHTML;
              title = title.replace(/&amp;/g, '&');
              const link = productContainer.children[0].href;
              const price = productContainer.getElementsByClassName('uvp')[0].innerHTML;
              price = price.substr(0, price.indexOf('&nbsp;€')) + '€';
  
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
  
            if (section.getElementsByClassName('pagination-next')[0].children.length > 0) {
              nextPageExistsReturn = true;
              section.getElementsByClassName('pagination-next')[0].children[0].click();
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