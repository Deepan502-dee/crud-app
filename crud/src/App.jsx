import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [record, setRecord] = useState({ name: '', age: '', city: '' });
  const [isModel, setIsModel] = useState(false);

  const getUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8800/users');
      setUser(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (e) => {
    const inputFilter = e.target.value.toLowerCase();
    const filter = user.filter((user) => {
      return user.name.toLowerCase().includes(inputFilter) || user.city.toLowerCase().includes(inputFilter);
    });
    setFilteredData(filter);
  };

  const callDelete = async (id) => {
    try {
      const isConfirmed = window.confirm('Are you sure, Do you want to delete this item')
      if (isConfirmed) {
        const res = await axios.delete(`http://localhost:8800/users/${id}`);
        setUser(res.data);
        setFilteredData(res.data);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleRecord = () => {
    setRecord({ name: '', age: '', city: '' });
    setIsModel(true);
  }

  const modelClose = () => {
    getUsers();
    setIsModel(false);
  }

  const newData = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    try {
      if (e.id) {
        await axios.patch(`http://localhost:8800/users/${e.id}`, record).then((res) => {
          console.log("");
        });
        console.log(e.id);

      } else if (!(e.id)) {
        console.log("user.id else");
        await axios.post('http://localhost:8800/users', record).then((res) => {
          console.log("");
        });
      }
    } catch (error) {
      console.log(error);
    }
    await getUsers();
    setIsModel(false);
    setRecord({ name: '', age: '', city: '' });
  };

  const handleEdit = (user) => {
    setRecord(user);
    setIsModel(true);
  }

  return (
    <div className="container">
      <h2>CRUD Application with React.js Frontend and Node.js Backend</h2>
      <div className='input-search'>
        <input type="search" placeholder="Search..." onChange={handleSearch} />
        <button type="button" onClick={handleRecord}>Add Record</button>
      </div>

      {/* Desktop View */}
      <div className="desktop-view">
        <table className='table'>
          <thead>
            <tr>
              <th>S.no</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredData && filteredData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.age}</td>
                <td>{item.city}</td>
                <td><button onClick={() => handleEdit(item)}>Edit</button></td>
                <td><button className="delete" onClick={() => callDelete(item.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModel &&
          <div className='model'>
            <div className='model-container'>
              <span className='close' onClick={modelClose}>&times;</span>
              <h2>Add Records</h2>
              <div className='input-container'>
                <div className='input-rows'>
                  <label htmlFor="name">Enter name:</label>
                  <input type="text" name="name" value={record.name} onChange={newData} id="name" />
                </div>
                <div className='input-rows'>
                  <label htmlFor="age">Enter age:</label>
                  <input type="number" name="age" value={record.age} onChange={newData} id="age" />
                </div>
                <div className='input-rows'>
                  <label htmlFor="city">Enter city:</label>
                  <input type="text" name="city" value={record.city} onChange={newData} id="city" />
                </div>
                <button type="button" className='save-button' onClick={() => handleSubmit(record)}>Save</button>
              </div>
            </div>
          </div>
        }
      </div>

      {/* Mobile View */}
      <div className="mobile-view">
        {filteredData && filteredData.map((item, index) => (
          <div className="user-card" key={item.id}>
            <h3>{item.name}</h3>
            <p>Age: {item.age}</p>
            <p>City: {item.city}</p>
            <div className="button-group">
              <button onClick={() => handleEdit(item)}>Edit</button>
              <button className="delete" onClick={() => callDelete(item.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {isModel && (
        <div className='model'>
          <div className='model-container'>
            <span className='close' onClick={modelClose}>&times;</span>
            <h2>Add Records</h2>
            <div className='input-container'>
              <div className='input-rows'>
                <label htmlFor="name">Enter name:</label>
                <input type="text" name="name" value={record.name} onChange={newData} id="name" />
              </div>
              <div className='input-rows'>
                <label htmlFor="age">Enter age:</label>
                <input type="number" name="age" value={record.age} onChange={newData} id="age" />
              </div>
              <div className='input-rows'>
                <label htmlFor="city">Enter city:</label>
                <input type="text" name="city" value={record.city} onChange={newData} id="city" />
              </div>
              <button type="button" className='save-button' onClick={() => handleSubmit(record)}>Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
