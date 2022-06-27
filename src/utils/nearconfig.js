import * as NearAPI from 'near-api-js';
import { getConfig } from './constants';
require('dotenv');

const { WalletConnection, keyStores, connect} = NearAPI;

const keyStore = new keyStores.BrowserLocalStorageKeyStore();

const config = {...getConfig('testnet'), keyStore}



export const Wallet = async () => {
    const near = await connect(config);

    const wallet = new WalletConnection(near)

    if (wallet.isSignedIn()) return wallet;

    wallet.requestSignIn(
        'expo.leonard0.testnet', // contract requesting access
        "Budget App"
    )

    return wallet;
}


export const Contract = (account) => {
    const contract_ = new NearAPI.Contract(account,
        "expo.leonard0.testnet",
        {
            viewMethods: [],
            changeMethods: ["createNewExpense", "getAllExpenses", "updateExpenseCompletionDate", "updateExpenseAmount","removeExpense", "deleteExpense", "clearExpense"],
            sender: account
        });

    return contract_
}



