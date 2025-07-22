import { existsSync, readFileSync, writeFile } from 'fs';

export default class FileManager {
    static async compareWithRecentData(newDataArray, shopName) {
        let newArrivals = [];

        // check if previously stored data exists
        const recentDataStored = existsSync(`./storage/${shopName}.json`);

        if (!recentDataStored) {
            this.storeToFile(newDataArray, shopName, true);
            return [];
        }

        const recentDataString = readFileSync(`./storage/${shopName}.json`, 'utf-8');

        newDataArray.forEach((element) => {
            if (recentDataString.indexOf(JSON.stringify(element.title)) === -1) {
                newArrivals.push(element);
            }
        });

        // update the stored file with latest data
        this.storeToFile(newDataArray, shopName, false);

        return newArrivals;
    }

    static async storeToFile(dataArray, shopName, created) {
        writeFile(
            `./storage/${shopName}.json`,
            JSON.stringify(dataArray),
            'utf-8',
            () => {
                created 
                    ? console.log('CREATED storage file: ', shopName)
                    : console.log('UPDATED storage file: ', shopName);
            }
        );
    }
}