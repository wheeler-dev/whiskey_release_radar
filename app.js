import shops from './shops.js';
import FileManager from './file-manager.js';
import EmailService from './email-service.js';
import puppeteer from 'puppeteer';
import chalk from 'chalk';
// import test from './test.js';

const app = async () => {

    // setup and authenticate
    // await EmailService.askOutPutEmail();
    // await EmailService.authenticateWithGoogle();

    // create browser instance

    const browser = await puppeteer.launch({ 
        headless: false, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });

    // start the process
    const init = async () => {

        console.log(chalk.bgYellow.black('Scraping Process started...'));
        console.log('--------------------------------');

        let promises = shops.map(shop => 
            shop.class.parseArrivals(browser, shop.url, shop.name)
        );

        Promise.allSettled(promises).then(async (results) => {
            let finalResults = [];

            for (const [index, result] of results.entries()) {
                if (result.status === 'fulfilled') {

                    // promise.allSettled method returns in the order of the shops.js array
                    const shop = shops[index];

                    // compare and store data
                    const newArrivals = await FileManager.compareWithRecentData(
                        result.value, 
                        shop.name
                    );

                    let shopResult = {
                        shop: shops[index].name,
                        articles: result.value.length,
                        new: newArrivals.length
                    };

                    // send email if there are new arrivals
                    if (newArrivals.length > 0) {
                        await EmailService.sendReleaseAlarmEmail(newArrivals, shopResult.shop);
                        console.log(chalk.greenBright.bold('Email has been sent.'))
                    }

                    finalResults.push(shopResult);

                } else if (result.status === 'rejected') {
                    // send error mail ?
                    console.log('rejected');
                }
            }

            console.log(chalk.bgGreen.black('Scraping Process finished.'));
            console.log('--------------------------------');
            console.table(finalResults);

            // returning function to keep it infinitely running on a loop
            // this should never resolve
            // eventually use a process manager like pm2 to avoid this
            setTimeout(() => {
                return init();
            }, 30000); // 10 minute break before next run
            // 600000
        });
    };

    await init();

    process.on('exit', async () => {
        await browser.close();
    });
};

// test()
app();