const shop_Weinquelle = require('./shops/shop_weinquelle')
const shop_GetraenkeWeltWeiser = require('./shops/shop_getraenkeweltWeiser')
const shop_DeinWhisky = require('./shops/shop_deinwhisky')
const file_manager = require('./file_manager')

const test = require('./test')

// test()

const app = async () => {

    // setTimeout(() => {
    //     // trigger parses
    // }, 300000)

    const arrivalsWeinquelle = await shop_Weinquelle.parseArrivals()
    // const arrivalsGetraenkeWeltWeiser = await shop_GetraenkeWeltWeiser.parseArrivals()
    // const arrivalsDeinWhiskey = await shop_DeinWhisky.parseArrivals()

    const newArrivalsWeinquelle = await file_manager.compareWithRecentData(arrivalsWeinquelle, 'weinquelle')
    // const newArrivalsGetraenkeWeltWeiser = await file_manager.compareWithRecentData(arrivalsGetraenkeWeltWeiser, 'getraenkeWeltWeiser')
    // const newArrivalsDeinWhiskey = await file_manager.compareWithRecentData(arrivalsDeinWhiskey, 'deinWhiskey')
    
    console.log('newArrivalsWeinquelle: ', newArrivalsWeinquelle)
    // console.log('newArrivalsGetraenkeWeltWeiser: ', newArrivalsGetraenkeWeltWeiser)
    // console.log('newArrivalsDeinWhiskey: ', newArrivalsDeinWhiskey)
}

app()