const fs = require('fs')


module.exports = class file_manager {

    static async compareWithRecentData(newDataArray, shopName) {

        let newArrivals = []

        // check if previously stored data exists
        const recentDataStored = fs.existsSync('./storage/' + shopName + '.json');

        if (!recentDataStored) {
            this.storeToFile(newDataArray, shopName)
            return []
        }

        const recentDataString = fs.readFileSync('./storage/' + shopName + '.json', 'utf-8');

        newDataArray.forEach((element) => {
            if (recentDataString.indexOf(JSON.stringify(element.title)) === -1) {
                newArrivals.push(element)
            }
        })

        // update the stored file with latest data
        // this.storeToFile(newDataArray, shopName)

        return newArrivals
    }

    static async storeToFile(dataArray, shopName) {

        fs.writeFile('./storage/' + shopName + '.json', JSON.stringify(dataArray), 'utf-8', () => {
            console.log('wrote to file: ', shopName)
        })

    }

}