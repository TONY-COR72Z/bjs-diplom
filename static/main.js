class Profile {
    constructor ({ username, name: { firstName, lastName }, password }) {
        this.username = username;
        this.name = { firstName, lastName };
        this.password = password;
    }

    createUser(callback) {
        return ApiConnector.createUser({ username: this.username, name: this.name, password: this.password }, (err, data) => {
            console.log(`Creating user ${this.username}`);
            callback(err, data);
        });
    }

    performLogin(callback) {
        return ApiConnector.performLogin({ username: this.username, password: this.password }, (err, data) => {
            console.log(`Authorizing user ${this.username}`);
            callback(err, data);
        });
    }

    addMoney({ currency, amount }, callback) {
        return ApiConnector.addMoney({ currency, amount }, (err, data) => {
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);
            callback(err, data);
        });
    }

    convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
        return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
            console.log(`Converting ${fromCurrency} to ${targetAmount} ${targetCurrency}`);
            callback(err, data);
        });
    }

    transferMoney({ to, amount }, callback) {
        return ApiConnector.transferMoney({ to, amount }, (err, data) => {
            console.log(`Transfering ${amount} of Netcoins to ${to}`);
            callback(err, data);
        });
    }
}

function getStocks(callback) {
    return ApiConnector.getStocks((err, data) => {
        console.log(`Getting stocks info`);
        callback(err, data[99]);
    });
}

function main() {
    const Anton = new Profile ({
        username: 'anton',
        name: { firstName: 'Anton', lastName: 'Iusupov' },
        password: '1234anton'
    });
    const Bobby = new Profile ({
        username: 'bobby',
        name: { firstName: 'Bobby', lastName: 'Axelrod' },
        password: 'fxxk-maison'
    });

    Anton.createUser( (err, data) => {
        if (err) console.error('Failed to create user');
        else {
            console.log('Anton is created!');
            Anton.performLogin( (err, data) => {
                if (err) console.error('Failed to login');
                else console.log('Anton is authorized');
            });
        }
    });

    getStocks( (err, data) => {
        if (err) console.error('Error during getting stocks');
        const stocksInfo = data;
        const wallet = { currency: 'EUR', amount: 500000 };

        Bobby.createUser( (err, data) => {
            if (err) console.error('Failed to create user');
            else {
                console.log('Bobby is created!');
                Bobby.performLogin( (err, data) => {
                    if (err) console.error('Failed to login');
                    else {
                        console.log('Bobby is authorized');
                        Bobby.addMoney(wallet, (err, data) => {
                            if (err) console.error('Error during adding money to Bobby');
                            else {
                                console.log('Added 500000 euros to Bobby');
                                Bobby.convertMoney({ fromCurrency: 'EUR', targetCurrency: 'NETCOIN', targetAmount: 36000 }, (err, data) => {
                                    if (err) console.error('Error during conversion');
                                    else {
                                        const walletAmount = stocksInfo.NETCOIN_EUR * wallet.amount;
                                        console.log('Converted to coins ', { name: { firstName: 'Bobby', lastName: 'Axelrod' }, wallet: { amount: walletAmount, currency: 'NETCOIN' }, username: 'bobby' });
                                        Bobby.transferMoney({ to: 'anton', amount: 36000 }, (err, data) => {
                                            if (err) console.error('Failed to transfer 36000 Netcoins');
                                            else console.log('Anton has got 36000 Netcoins');
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });
}

main();