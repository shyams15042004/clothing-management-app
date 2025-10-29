import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [page, setPage] = useState("view");
  const [users, setUsers] = useState([]);
  const [clothes, setClothes] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/get").then(res => setUsers(res.data));
    axios.get("http://localhost:5000/clothes").then(res => setClothes(res.data));
  }, []);

  const handleCheck = (item) => {
    setCart(prev => {
      if (prev.find(i => i.item === item.name))
        return prev.filter(i => i.item !== item.name);
      return [...prev, { item: item.name, quantity: 1, price: item.price }];
    });
  };

  const handleQtyChange = (uid, index, value) => {
    const newUsers = [...users];
    newUsers[uid].cart[index].quantity = value;
    setUsers(newUsers);
  };

  const handleItemChange = (uid, index, newItemName) => {
    const newUsers = [...users];
    const itemObj = clothes.find(c => c.name === newItemName);
    newUsers[uid].cart[index] = { ...itemObj, item: newItemName, quantity: 1 };
    setUsers(newUsers);
  };

  const addUser = () => {
    axios.post("http://localhost:5000/add", { id, name, cart })
      .then(() => {
        alert("Added successfully");
        window.location.reload();
      });
  };

  const updateCart = (uid) => {
    const user = users[uid];
    axios.put(`http://localhost:5000/update/${user.id}`, { cart: user.cart })
      .then(() => alert("Cart updated successfully"));
  };

  const deleteUser = (uid) => {
    axios.delete(`http://localhost:5000/delete/${uid}`)
      .then(() => {
        alert("Deleted successfully");
        window.location.reload();
      });
  };

  return (
    <div style={{ textAlign: "center", fontFamily: "Arial" }}>
      <h1>🛍️ Clothing Management</h1>

      <button onClick={() => setPage("view")}>View</button>
      <button onClick={() => setPage("add")}>Add</button>
      <button onClick={() => setPage("delete")}>Delete</button>

      {page === "add" && (
        <div style={{ marginTop: 20 }}>
          <h3>Add Customer</h3>
          <input placeholder="ID" value={id} onChange={(e) => setId(e.target.value)} /><br /><br />
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><br /><br />
          <h4>Select Clothes</h4>
          {clothes.map(item => (
            <label key={item.id}>
              <input type="checkbox" onChange={() => handleCheck(item)} />
              {item.name} - ₹{item.price}
              <br />
            </label>
          ))}
          <br />
          <button onClick={addUser}>Add</button>
        </div>
      )}

      {page === "view" && (
        <div style={{ marginTop: 20 }}>
          <h3>Added Users</h3>
          {users.length === 0 ? <p>No records</p> :
            users.map((u, uid) => {
              const total = u.cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
              return (
                <div key={u.id} style={{ marginBottom: 30 }}>
                  <h4>{u.name} (ID: {u.id})</h4>
                  <table border="1" align="center" cellPadding="6">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {u.cart.map((c, index) => (
                        <tr key={index}>
                          <td>
                            <select
                              value={c.item}
                              onChange={(e) => handleItemChange(uid, index, e.target.value)}
                            >
                              {clothes.map(cl => (
                                <option key={cl.id} value={cl.name}>{cl.name}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={c.quantity}
                              onChange={(e) => handleQtyChange(uid, index, e.target.value)}
                              style={{ width: 50 }}
                            />
                          </td>
                          <td>₹{c.price}</td>
                          <td>₹{c.price * c.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <h4>Total Price: ₹{total}</h4>
                  <button onClick={() => updateCart(uid)}>Save</button>
                </div>
              );
            })}
        </div>
      )}

      {page === "delete" && (
        <div style={{ marginTop: 20 }}>
          <h3>Delete Customer</h3>
          {users.map(u => (
            <div key={u.id}>
              {u.name} <button onClick={() => deleteUser(u.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
