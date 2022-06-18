import React, { useEffect, useState } from 'react';
import { Wallet } from './utils/nearconfig';

import Home from './components/home';
import NewExpense from './components/NewExpense/NewExpense';
import Expenses from './components/Expenses/Expenses';

const DUMMY_EXPENSES = [
  {
    id: 'e1',
    title: 'Toilet Paper',
    amount: 94.12,
    date: new Date(2020, 7, 14),
  },
  { id: 'e2', title: 'New TV', amount: 799.49, date: new Date(2021, 2, 12) },
  {
    id: 'e3',
    title: 'Car Insurance',
    amount: 294.67,
    date: new Date(2021, 2, 28),
  },
  {
    id: 'e4',
    title: 'New Desk (Wooden)',
    amount: 450,
    date: new Date(2021, 5, 12),
  },
];

const App = () => {
  const [expenses, setExpenses] = useState(DUMMY_EXPENSES);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [wallet, setWallet] = useState();
  const [balance, setBalance] = useState();

  const loadPage = <main>
    <h2>Loading...</h2>
  </main>

  const addExpenseHandler = (expense) => {
    setExpenses((prevExpenses) => {
      return [expense, ...prevExpenses];
    });
  };

  const handleSignIn = async () => {
    setLoading(true);
    setLoggedIn(true);

    setTimeout(async () => {
      const wallet = await Wallet();
      console.log(wallet)

      setLoading(false);
    
      setWallet(wallet)
      setAccountId(wallet.getAccountId())
    }, 1000)  

  }

  const handleSignOut = async () => {
    wallet.SignOut();
    setLoggedIn(false);
  }

  useEffect(() => {

  })

  

  return (<>
    {!loggedIn && <Home signIn= {handleSignIn}/>}
    {loggedIn && (loading ? loadPage : <>
    <header>
        <h1>Bud<span>Gitt</span></h1>
        <div>
          <div>
            <p>{accountId}</p>
            <h2>{balance}</h2>
          </div>

          <button onClick= {handleSignOut}>
            Sign Out
          </button>
        </div>
        
    </header>
    <div>
      <NewExpense onAddExpense={addExpenseHandler} />
      <Expenses items={expenses} />
    </div></>)}</>
  );
};

export default App;
