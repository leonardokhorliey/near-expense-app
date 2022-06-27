import React, { useState } from 'react';

import Card from '../UI/Card';
import ExpensesFilter from './ExpensesFilter';
import ExpensesList from './ExpensesList';
import ExpensesChart from './ExpensesChart';
import './Expenses.css';

const Expenses = (props) => {
  const [filteredYear, setFilteredYear] = useState('2020');
  const [selectedView, setSelectedView] = useState('Pending');
  const viewKeys = {
    "Pending": 0,
    "Cleared": 1,
    "Removed": 2
  };

  const filterChangeHandler = (selectedYear) => {
    setFilteredYear(selectedYear);
  };

  const changeSelectedView = (e) => {
    setSelectedView(e.target.value);
  };

  const filteredExpenses = props.items.filter((expense) => {
    console.log(new Date(expense.expectedCompleteDate))
    return new Date(expense.expectedCompleteDate).getFullYear().toString() === filteredYear && expense.status === viewKeys[selectedView];
  });

  return (
    <div>
      <Card className='expenses'>
        <ExpensesFilter
          selected={filteredYear}
          onChangeFilter={filterChangeHandler}
        />
        <ExpensesChart expenses={filteredExpenses} />
        <div className="expenses-heading">
          <h1>{`${selectedView} Expenses`}</h1>
          <select value={selectedView} onChange={changeSelectedView}>
            <option value='Pending'>Pending</option>
            <option value='Cleared'>Cleared</option>
            <option value='Dropped'>Dropped</option>
          </select>
        </div>
        
        <ExpensesList items={filteredExpenses} updateExpense={props.updateExpense} clearExpense={props.clearExpense} removeExpense={props.removeExpense} 
        selectedView= {viewKeys[selectedView]} deleteExpense={props.deleteExpense}/>
      </Card>
    </div>
  );
};

export default Expenses;
