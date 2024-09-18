import React, { useEffect, useState } from 'react';
import Navbar from './Components/Navbar';
import Card from './Components/Card';
import Todo from "./images/To-do.svg"
import InProgress from "./images/in-progress.svg"
import Backlog from "./images/Backlog.svg"
import High from "./images/Img - High Priority.svg"
import Low from "./images/Img - Low Priority.svg"
import Medium from "./images/Img - Medium Priority.svg"
import Nothing from "./images/No-priority.svg"
import Urgent from "./images/SVG - Urgent Priority colour.svg"
import Add from "./images/add.svg"
import ThreeDot from "./images/3 dot menu.svg"
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');

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

  const sortTickets = (tickets, orderKey) => {
    return [...tickets].sort((a, b) => {
      if (orderKey === 'priority') {
        return b.priority - a.priority;
      } else if (orderKey === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const getGroupedTickets = () => {
    let groupedTickets;
    if (grouping === 'user') {
      groupedTickets = groupBy('userId', tickets);
    } else if (grouping === 'status') {
      groupedTickets = groupBy('status', tickets);
    } else if (grouping === 'priority') {
      groupedTickets = groupBy('priority', tickets);
    }
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
            <h2>{group.substring(0, 3) !== "usr" ? group : ' '}
              {group === 'Todo' && (
                <img
                  src={Todo}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: '0.5rem'
                  }}
                />
              )}
              {group === 'Backlog' && (
                <img
                  src={Backlog}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: '0.5rem'
                  }}
                />
              )}
              {group === 'In progress' && (
                <img
                  src={InProgress}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: '0.5rem'
                  }}
                />
              )}
              {group === '0' && (
                <img
                  src={Nothing}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: '0.5rem'
                  }}
                />
              )}
              {group === '1' && (
                <img
                  src={Urgent}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: '0.5rem'
                  }}
                />
              )}
              {group === '2' && (
                <img
                  src={Low}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: '0.5rem'
                  }}
                />
              )}
              {group === '3' && (
                <img
                  src={Medium}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: '0.5rem'
                  }}
                />
              )}
              {group === '4' && (
                <img
                  src={High}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginLeft: '0.5rem'
                  }}
                />
              )}
              {group.substring(0, 3) !== 'usr' &&
                <>
                  <img
                    src={Add}
                    style={{
                      width: '20px',
                      height: '20px',
                    }}
                  />
                  <img
                    src={ThreeDot}
                    style={{
                      width: '20px',
                      height: '20px',
                    }}
                  />
                </>
              }
            </h2>
            {group.substring(0, 3) === 'usr' && (
              <>
                <h2>
                  {users.find(user => user.id === groupedTickets[group][0]?.userId)?.name}
                  <img
                    src={Add}
                    style={{
                      width: '20px',
                      height: '20px',
                    }}
                  />
                  <img
                    src={ThreeDot}
                    style={{
                      width: '20px',
                      height: '20px',
                    }}
                  />
                </h2>

              </>
            )}
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
