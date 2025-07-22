import ShopWeinquelle from './shops/shop_weinquelle.js';
import ShopGetraenkeWeltWeiser from './shops/shop_getraenkeweltweiser.js';
import ShopDeinWhiskyHomeOfMalts from './shops/shop_deinWhisky_homeOfMalts.js';
import ShopWhic from './shops/shop_whic.js';
import ShopFassgeist from './shops/shop_fassgeist.js';
import ShopWhiskyWorld from './shops/shop_whiskyworld.js';
import ShopWeisshaus from './shops/shop_weisshaus.js';

export default [
    {
        name: 'weinquelle',
        class: ShopWeinquelle,
        url: 'https://www.weinquelle.com/whisky/Neuheiten.html'
    }, 
    {
        name: 'getraenkeWeltWeiser',
        class: ShopGetraenkeWeltWeiser,
        url: 'https://www.getraenkewelt-weiser.de/category.php/whisky/neuheiten'
    }, 
    {
        name: 'deinWhiskey',
        class: ShopDeinWhiskyHomeOfMalts,
        url: 'https://www.deinwhisky.de/neues/'
    }, 
    {
        name: 'whic',
        class: ShopWhic,
        url: 'https://whic.de/neuheiten'
    }, 
    {
        name: 'fassgeist',
        class: ShopFassgeist,
        url: 'https://fassgeist.de/collections/all'
    }, 
    {
        name: 'homeOfMalts',
        class: ShopDeinWhiskyHomeOfMalts,
        url: 'https://www.homeofmalts.com/whisky/'
    }, 
    {
        name: 'whiskyWorld',
        class: ShopWhiskyWorld,
        url: 'https://www.whiskyworld.de/alle-whiskies'
    },
    {
        name: 'weisshaus',
        class: ShopWeisshaus,
        url: 'https://www.weisshaus.de/whisky/'
    }, 
]