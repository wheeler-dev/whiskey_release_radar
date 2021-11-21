const shop_Weinquelle = require('./shops/shop_weinquelle')
const shop_DeinWhisky = require('./shops/shop_deinwhisky')
const shop_GetraenkeWeltWeiser = require('./shops/shop_getraenkeweltWeiser')

const test = require('./test')

// test()

const app = async () => {

    // setTimeout(() => {
    //     // trigger parses
    // }, 300000)

    const arrivalsWeinquelle = await shop_Weinquelle.parseArrivals()
    const arrivalsGetraenkeWeltWeiser = await shop_GetraenkeWeltWeiser.parseArrivals()
    const arrivalsDeinWhiskey = await shop_DeinWhisky.parseArrivals()
}

app()