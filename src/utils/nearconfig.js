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



