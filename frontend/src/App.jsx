import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/v1';

const Toast = ({ message, type }) => (
  <div className={`toast ${type}`}>
    {message}
  </div>
);

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [tasks, setTasks] = useState([]);
  
  const [toast, setToast] = useState(null);
  
  const [authTab, setAuthTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState('pending');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      showToast('Logged in successfully');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setToken(data.token);
      setUser(data);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      showToast('Registered successfully');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401) handleLogout();
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const payload = { title: taskTitle, description: taskDesc, status: taskStatus };
    const method = editTaskId ? 'PUT' : 'POST';
    const url = editTaskId ? `${API_URL}/tasks/${editTaskId}` : `${API_URL}/tasks`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save task');
      
      showToast(editTaskId ? 'Task updated' : 'Task created');
      closeModal();
      fetchTasks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete task');
      
      showToast('Task deleted');
      fetchTasks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const openModal = (task = null) => {
    if (task) {
      setEditTaskId(task._id);
      setTaskTitle(task.title);
      setTaskDesc(task.description);
      setTaskStatus(task.status);
    } else {
      setEditTaskId(null);
      setTaskTitle('');
      setTaskDesc('');
      setTaskStatus('pending');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!token) {
    return (
      <div className="auth-view">
        {toast && <div className="toast-container"><Toast message={toast.message} type={toast.type} /></div>}
        <div className="auth-box">
          <div className="brand">
            <div className="logo"></div>
            <h1>TaskMaster</h1>
            <p>Welcome back! Please enter your details.</p>
          </div>
          
          <div className="tabs">
            <button className={`tab ${authTab === 'login' ? 'active' : ''}`} onClick={() => setAuthTab('login')}>Login</button>
            <button className={`tab ${authTab === 'register' ? 'active' : ''}`} onClick={() => setAuthTab('register')}>Register</button>
          </div>

          {authTab === 'login' ? (
            <form className="form" onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">Sign In</button>
            </form>
          ) : (
            <form className="form" onSubmit={handleRegister}>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Create Account</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && <div className="toast-container"><Toast message={toast.message} type={toast.type} /></div>}
      
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo-small"></div>
          <h2>TaskMaster</h2>
        </div>
        <div className="nav-actions">
          <span>Hello, {user?.name}</span>
          <span className={`badge ${user?.role === 'admin' ? 'admin' : ''}`}>{user?.role}</span>
          <button onClick={handleLogout} className="btn btn-outline">Logout</button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h2>Your Tasks</h2>
            <p>Manage your daily activities</p>
          </div>
          <button onClick={() => openModal()} className="btn btn-primary">+ New Task</button>
        </div>

        <div className="task-grid">
          {tasks.length === 0 ? (
            <div className="empty-state">No tasks found. Create one above!</div>
          ) : (
            tasks.map(task => {
              const isOwner = user?.role === 'admin' || user?._id === task.user?._id || user?._id === task.user;
              return (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h4 className="task-title">{task.title}</h4>
                    <span className={`task-status status-${task.status}`}>{task.status.replace('-', ' ').toUpperCase()}</span>
                  </div>
                  <p className="task-desc">{task.description}</p>
                  <div className="task-meta">
                    <span>By: {task.user?.name || 'Unknown'}</span>
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                  </div>
                  {isOwner && (
                    <div className="task-actions">
                      <button className="btn btn-secondary btn-small" onClick={() => openModal(task)}>Edit</button>
                      <button className="btn-delete btn-small" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editTaskId ? 'Edit Task' : 'Create Task'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleTaskSubmit}>
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>Title</label>
                <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
              </div>
              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>Description</label>
                <textarea rows="3" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} required></textarea>
              </div>
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label>Status</label>
                <select value={taskStatus} onChange={e => setTaskStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
