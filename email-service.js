import fs from 'fs';
import readline from 'readline';
import chalk from 'chalk';
import { google } from 'googleapis';

export default class EmailService {
    static outPutEmail = undefined;

    static SCOPES = [
        'https://mail.google.com/',
    ];

    static TOKEN_PATH = 'token.json';
    static oAuth2Client = null;

    static async askOutPutEmail() {
        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });

            rl.question(chalk.cyan.bold('Email adress to send new releases to: '), (email) => {
                rl.close();
                this.outPutEmail = email;
                resolve();
            });
        });
    }

    /**
     * Start oAuth flow
     */
    static async authenticateWithGoogle() {
        return new Promise((resolve, reject) => {
            // Load client secrets from a local file.
            fs.readFile('credentials.json', async (err, content) => {
                if (err) {
                    console.log(chalk.red.bold('Error loading client secret file:'), err);
                    reject();
                }
                // Authorize a client with credentials
                await this.authorize(JSON.parse(content));
                console.log(chalk.green.bold('Google Mail Authorization was successful.'));
                resolve();
            });
        });
    }

    /**
     * Create an OAuth2 client with the given credentials
     * @param {Object} credentials The authorization client credentials.
     */
    static async authorize(credentials) {
        return new Promise((resolve, reject) => {
            const { client_secret, client_id, redirect_uris } = credentials.installed;
            this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

            // Check if we have previously stored a token.
            fs.readFile(this.TOKEN_PATH, async (err, token) => {
                if (err) {
                    await this.getNewToken(this.oAuth2Client);
                } else {
                    this.oAuth2Client.setCredentials(JSON.parse(token));
                }
                resolve();
            });
        });
    }

    /**
     * Get and store new token after prompting for user authorization
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     */
    static async getNewToken(oAuth2Client) {
        return new Promise((resolve, reject) => {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: this.SCOPES,
            });
            console.log(chalk.cyan.bold('Authorize whiskey release radar app to send emails through this account: '), authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            rl.question(chalk.cyan.bold('Enter access token from login page: '), (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err) {
                        console.error('Error retrieving access token', err);
                        reject();
                    }
                    oAuth2Client.setCredentials(token);
                    // Store token
                    fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) return console.error(err);
                        console.log('Token stored in', this.TOKEN_PATH);
                    });
                    resolve();
                });
            });
        });
    }

    static buildEmailRequestBody(to, from, subject, message) {
        let stringArray = [
            'Content-Type: text/html; charset=\'UTF-8\'\n',
            'MIME-Version: 1.0\n',
            'Content-Transfer-Encoding: 7bit\n',
            'to: ', to, '\n',
            'from: ', from, '\n',
            'subject: ', subject, '\n\n',
            message
        ].join('');

        return Buffer.from(stringArray)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    static async sendReleaseAlarmEmail(arrivals, shopName) {
        const auth = this.oAuth2Client;
        const gmail = google.gmail({ version: 'v1', auth });

        const from = 'whiskey.release.radar@gmail.com';
        const subject = `New releases for shop ${shopName} available`;
        let message = 
            '<h2> New releases: </h2>' + 
            '<table><tr><th>Name</th><th>Price</th><th>Link</th></tr>';

        arrivals.forEach((product) => {
            let tableRow = `<tr><td>${product.title}</td><td>${product.price}</td><td>${product.link}</td></tr>`;
            message += tableRow;
        });

        message += '</table>';

        const rawData = this.buildEmailRequestBody(this.outPutEmail, from, subject, message);

        return new Promise((resolve, reject) => {
            gmail.users.messages.send({
                userId: 'me',
                resource: {
                    raw: rawData
                }
            }, (err, res) => {
                if (err) reject(err);
                resolve(true);
            });
        });
    }
}