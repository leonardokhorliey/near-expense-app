import React, { useEffect, useState } from 'react';
import { Wallet, Contract } from './utils/nearconfig';

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
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [wallet, setWallet] = useState();

  const loadPage = <main>
    <h2>Loading...</h2>
  </main>

  const addExpenseHandler = async (title, description, amount, completeDate) => {
    let expense = {title, description, amount, completeDate, createdAt: new Date().toISOString()};
    console.log(expense);
    await Contract(wallet.account()).createNewExpense(expense);
    
    setExpenses((prevExpenses) => {
      return [expense, ...prevExpenses];
    });
  };

  const getExpenses = async (wallet) => {
    console.log(wallet.account())
    let expenses_ = await Contract(wallet.account()).getAllExpenses();
    console.log(expenses_);
    setExpenses(expenses_);
  }

  const handleSignIn = async () => {
    setLoading(true);
    setLoggedIn(true);

    setTimeout(() => {
      
      Wallet().then((tx) => {

        setLoading(false);
      
        setWallet(tx);
        setAccountId(tx.getAccountId());

        getExpenses(tx);
      }).catch((e) => {
        console.log(e.message)
      });
      
    }, 1000)  

  }

  const handleSignOut = async () => {
    console.log("out")
    wallet.signOut();
    setLoggedIn(false);
  }

  const handleUpdateExpense = async (expenseId, newAmount, newCompleteDate) => {
    if (!newAmount) {await Contract(wallet.account()).updateExpenseCompletionDate({expenseId, newCompleteDate}); return;}
    if (!newCompleteDate) {await Contract(wallet.account()).updateExpenseAmount({expenseId, newAmount}); return;}
    await Contract(wallet.account()).updateExpenseCompletionDate({expenseId, newCompleteDate});
    await Contract(wallet.account()).updateExpenseAmount({expenseId, newAmount});
    await getExpenses(wallet);
    alert("Expense updated Successfully");
  }

  const handleClearExpense = async (expenseId) => {
    await Contract(wallet.account()).clearExpense({expenseId});
    await getExpenses(wallet);
    alert("Expense cleared Successfully");
  }

  const handleRemoveExpense = async (expenseId) => {
    await Contract(wallet.account()).removeExpense({expenseId});
    await getExpenses(wallet);
    alert("Expense dropped Successfully");
  }

  const handleDeleteExpense = async (expenseId) => {
    await Contract(wallet.account()).deleteExpense({expenseId});
    await getExpenses(wallet);
    alert("Expense deleted Successfully");
  }

  useEffect(() => {
    setLoading(true);
    setLoggedIn(true);

    Wallet().then((tx) => {

      
    
      setWallet(tx);
      setAccountId(tx.getAccountId());

      getExpenses(tx).then(() => setLoading(false)).catch((e)=> console.log(e.message));
    }).catch((e) => {
      console.log(e.message)
    });
  }, [])

  

  return (<>
    {!loggedIn && <Home signIn= {handleSignIn}/>}
    {loggedIn && (loading ? loadPage : <>
    <header>
        <h1>Bud<span>Gitt</span></h1>
        <div>
          <div>
            <p>{accountId}</p>
          </div>

          <button onClick= {handleSignOut}>
            Sign Out
          </button>
        </div>
        
    </header>
    <div>
      <NewExpense onAddExpense={addExpenseHandler} />
      <Expenses items={expenses} updateExpense= {handleUpdateExpense} clearExpense={handleClearExpense} removeExpense={handleRemoveExpense} deleteExpense= {handleDeleteExpense} />
    </div></>)}</>
  );
};

export default App;
