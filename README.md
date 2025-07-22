# **Whiskey_Release_Radar**

### **A web scraping micro service to track new whiskey releases via email**

### **About:**

This application uses [puppeteer](https://github.com/puppeteer/puppeteer) to frequently check the available products of several different liquor online shops based in germany.
Once the available products have been extracted they will be safed into a JSON file in the /storage subdirectory and another run will be queued.
Products consist of a title and price attribute, as well as a link to the products detail page where it can be bought.
On every subsequent run, the new product list will be compared to the previously stored one to aquire any newly released products.
A list of those new releases will then be sent to the provided email adress.

### **Prerequisites:**

> This app needs to be authorized with a google account to send e-mails through it.<br/>
> The gmail api needs to be activated for this account in the [google api console](https://console.cloud.google.com/apis).<br/>
> A more detailed guide on how to setup an account for usage with google apis can be found [here](https://developers.google.com/identity/protocols/oauth2).
> After creating credentials, the generated _credentials.json_ file needs to be placed at the root of this project.<br/>
> Helpful tip: Setting your _credentials.json_ `"redirect_uris"` to `["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]` for your desktop application may help, if you encountering redirect issues during the authentication process.

### **How to run:**

> - _npm install_<br/>
> - _npm run start_

### **How it works:**

On start up you will be asked to provide the email adress that will receive emails, when new releases are available, on the command line.<br/>
Afterwards the application will try to authenticate with google and therefore print a sign in link to the console.

> If you encounter the message: _"Error loading client secret file"_<br/>
> Make sure you stored your google accounts _credentials.json_ at the root of the project folder, as described above.

Follow the link, log into the google account, grant the requested access and copy the generated token back into the console to complete the app authentication process.<br/>
If a previously stored token is available and still valid, this step will be skipped.<br/>
After startup, the application will keep track of new products available on a 10-minute intervall (which can be changed by setting the parameter in the app.js init function). It is recommended to keep intervals of at least a couple of minutes, as some sites might block access for certain ip adresses if visited too frequently.

![App Overview](docs/component-diagram-wrr.svg)

The different shop classes contain the [puppeteer](https://github.com/puppeteer/puppeteer) scaping logic for each indivial shop.
The shops parseArrivals function returns all the products available on the scraped page.

The file manager class compares the scraped data to the most recently saved data (if there is any) to determine which products are new arrivals, then saves the scraped data to a JSON file.

New arrivals will be passed to the email service and sent through the authenticated account to the provided email adress.

<br/>

### **Currently supported shops:**

> - https://www.weinquelle.com/whisky/Neuheiten.html<br/>
> - https://www.getraenkewelt-weiser.de/category.php/whisky/neuheiten<br/>
> - https://whic.de/neuheiten<br/>
> - https://fassgeist.de/collections/all<br/>
> - https://www.deinwhisky.de/neues/<br/>
> - https://www.homeofmalts.com/whisky/<br/>
> - https://www.whiskyworld.de/alle-whiskies<br/>
> - https://www.weisshaus.de/whisky<br/>

### Planned for future releases:

**Adding additional shops:**

> - https://www.whisky.de/
> - http://www.whiskey-and-more.de/shop
> - https://www.conalco.de/
> - https://whisky-fox.de/
> - https://www.wein-bastion.de/
> - https://diewhiskybotschaft.de/
> - https://www.der-schnapsstodl.de/
> - https://www.wein-bastion.de/
> - https://www.whiskyburg.de/

**Ready app for server deployment:**

- implement more sophisticated error logging and handling, as of right now parsing errors can cause a crash
- implement some sort of information system that sends out alerts if a shop hasn't had any new arrivals for a while, because its scraping logic stopped working for some reason
- implement scraper running on a scheduled cron job

**Additional functionality / Improvement ideas:**

- let the user define keywords and price range to filter the arrivals title and price attributes that are sent to them
- improve release e-mail layout
- upload scraped json data to a google sheet or database, gather price data over longer time periods
- set up an express server and expose an api to subscribe to
- build a frontend/website to consume api
- set up a twitter account to tweet new arrivals
