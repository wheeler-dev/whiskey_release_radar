
// parser for whic.de

export default class ShopWhic {

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
  
            const productList = document.getElementsByClassName('products-grid')[0];
            const products = Array.from(productList.children);
  
            const allElementsOnCurrentPage = [];
  
            products.forEach((product) => {
  
              const title = product.getElementsByClassName('product-name')[0].children[0].innerHTML;
              const link = product.getElementsByClassName('product-name')[0].children[0].href;
  
              let price;
  
              // check if price exists
              if (product.getElementsByClassName('price-box')[0]) {
  
                if (product.getElementsByClassName('regular-price')[0]) {
  
                  price = product.getElementsByClassName('regular-price')[0].getElementsByClassName('price')[0].innerHTML.trim() + '€';
  
                } else if (product.getElementsByClassName('special-price')[0]) {
  
                  price = product.getElementsByClassName('special-price')[0].getElementsByClassName('price')[0].innerHTML.trim() + '€';
  
                } else {
  
                  price = product.getElementsByClassName('price')[0].innerHTML.trim() + '€';
  
                }
  
              } else {
                price = '';
              }
  
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
  
          nextPageExists = await page.evaluate(() => {
  
            let nextPageExistsReturn = false;
            const toolbar = document.getElementsByClassName('toolbar-bottom')[0];
  
            if (toolbar.getElementsByClassName('toolbar-next-page')[0]) {
              nextPageExistsReturn = true;
              toolbar.getElementsByClassName('toolbar-next-page')[0].click();
            }
  
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