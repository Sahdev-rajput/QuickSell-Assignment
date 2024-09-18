import React, { useEffect, useState } from 'react';
import Navbar from './Components/Navbar';
import Card from './Components/Card';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState('status'); // Default grouping
  const [ordering, setOrdering] = useState('priority'); // Default ordering

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle grouping logic
  const groupBy = (key, tickets) => {
    return tickets.reduce((acc, ticket) => {
      const groupValue = ticket[key];
      if (!acc[groupValue]) {
        acc[groupValue] = [];
      }
      acc[groupValue].push(ticket);
      return acc;
    }, {});
  };

  // Handle ordering logic
  const sortTickets = (tickets, orderKey) => {
    return [...tickets].sort((a, b) => {
      if (orderKey === 'priority') {
        return b.priority - a.priority; // Descending order for priority
      } else if (orderKey === 'title') {
        return a.title.localeCompare(b.title); // Ascending order for title
      }
      return 0;
    });
  };

  // Get tickets grouped and ordered
  const getGroupedTickets = () => {
    let groupedTickets;
    if (grouping === 'user') {
      groupedTickets = groupBy('userId', tickets);
    } else if (grouping === 'status') {
      groupedTickets = groupBy('status', tickets);
    } else if (grouping === 'priority') {
      groupedTickets = groupBy('priority', tickets);
    }

    // Sort within each group
    Object.keys(groupedTickets).forEach((group) => {
      groupedTickets[group] = sortTickets(groupedTickets[group], ordering);
    });

    return groupedTickets;
  };

  const groupedTickets = getGroupedTickets();

  return (
    <div className="App">
      <Navbar setGrouping={setGrouping} setOrdering={setOrdering} />
      <div className="kanban-board">
        {Object.keys(groupedTickets).map((group) => (
          <div key={group} className="kanban-column">
            <h2>{group}</h2>
            {groupedTickets[group].map(ticket => (
              <Card key={ticket.id} ticket={ticket} user={users.find(user => user.id === ticket.userId)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
