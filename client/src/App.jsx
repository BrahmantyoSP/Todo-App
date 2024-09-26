import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  // Fetch Todos
  useEffect(() => {
    axios.get('http://localhost:3000/todos')
      .then(res => setTodos(res.data))
      .catch(err => console.log(err));
  }, []);

  // Add Todo
  const addTodo = () => {
    const newTodo = { task, completed: false };
    axios.post('http://localhost:3000/todos', newTodo)
      .then(res => setTodos([...todos, res.data]));
    setTask('');
  };

  // Delete Todo
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3000/todos/${id}`)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)));
  };

  // Update Todo
  const updateTodo = (id, updatedTask) => {
    axios.patch(`http://localhost:3000/todos/${id}`, { task: updatedTask })
      .then(res => {
        const updatedTodos = todos.map(todo =>
          todo.id === id ? { ...todo, task: res.data.task } : todo
        );
        setTodos(updatedTodos);
      });
  };

  // Check Todo
  const checkTodo = (id) => {
    const todoToCheck = todos.find(todo => todo.id === id);
    axios.patch(`http://localhost:3000/todos/${id}`, { completed: !todoToCheck.completed })
      .then(res => {
        const updatedTodos = todos.map(todo =>
          todo.id === id ? { ...todo, completed: res.data.completed } : todo
        );
        setTodos(updatedTodos);
      });
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">Todo App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="space-y-4">
        {todos.map(todo => (
          <li key={todo.id} className="bg-gray-100 p-3 rounded-lg flex justify-between items-center shadow">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => checkTodo(todo.id)}
                className="mr-3 h-5 w-5"
              />
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.task}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-yellow-400 text-white p-1 rounded hover:bg-yellow-500"
                onClick={() => updateTodo(todo.id, prompt("Update task:", todo.task))}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
