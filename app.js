const shop_Weinquelle = require('./shops/shop_weinquelle')
const shop_GetraenkeWeltWeiser = require('./shops/shop_getraenkeweltweiser')
const shop_DeinWhisky = require('./shops/shop_deinwhisky')
const file_Manager = require('./file-manager')
const email_Service = require('./email-service')

const test = require('./test')

// test()

const app = async () => {

    const shops = [
        {
            name: 'weinquelle',
            class: shop_Weinquelle
        }, 
        {
            name: 'getraenkeWeltWeiser',
            class: shop_GetraenkeWeltWeiser
        }, 
        // {
        //     name: 'deinWhiskey',
        //     class: shop_DeinWhisky
        // }, 
    ]

    await email_Service.askOutPutEmail();
    await email_Service.authenticateWithGoogle();

    // setTimeout(() => {
    //     // trigger parses
    // }, 300000)

    shops.forEach( async (shop) => {

        const arrivals = await shop.class.parseArrivals()
        console.log('available articles for ' + shop.name + ': ', arrivals.length)

        const newArrivals = await file_Manager.compareWithRecentData(arrivals, shop.name)
        console.log('newArrivals for ' + shop.name + ': ', newArrivals.length)

        // await email_Service.sendReleaseAlarmEmail(newArrivals, shop.name)

    })

}

app()