import React, { useState } from 'react';
import '../AdminStyles/customersAdmin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons';

function CustomersAdmin() {
  const [customers, setCustomers] = useState([
    { id: 0, name: "Zahra Mirzaei", location: " tyuytuyt" },
    { id: 1, name: "John Smith", location: "USA" },
    { id: 3, name: "Zahra Mirzaei", location: "UK" },
    // Add more customers here
  ]);

  const [editingCustomer, setEditingCustomer] = useState(null); // Tahrirlanayotgan foydalanuvchi
  const [showModal, setShowModal] = useState(false);

  const handleEditClick = (customer) => {
    setEditingCustomer(customer); // Foydalanuvchi ma'lumotlarini modal uchun o'rnatamiz
    setShowModal(true); // Modal oynani ko'rsatamiz
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCustomer({ ...editingCustomer, [name]: value });
  };

  const handleSave = () => {
    setCustomers(customers.map((c) => (c.id === editingCustomer.id ? editingCustomer : c)));
    setShowModal(false); // Modalni yopamiz
  };

  return (
    <div className="customers-table_admin">
      <h2>Customers</h2>
      <table>
        <thead className='theadAdmin'>
          <tr>
            <th>Bo'limlar</th>
            <th>Ism va familiya</th>
            <th>Xabar</th>
            <th>Tahrirlash</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.location}</td>
              <td >
                <div className="icon_customer">
                  <FontAwesomeIcon className='icon_c1' icon={faTrashCan} style={{ color: "#3dff87" }} />
                  <FontAwesomeIcon
                    className='icon_c1'
                    icon={faPen}
                    style={{ color: "#1f5137", cursor: 'pointer' }}
                    onClick={() => handleEditClick(customer)} // Tahrirlash funksiyasi
                  />
                </div>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal oynasi */}
      {showModal && (
        <div className="modal_admin">
          <div className="modal-content_admin">
            <h3>Edit Customer</h3>
            <label>
              Name:
              <input type="text" name="name" value={editingCustomer.name} onChange={handleChange} />
            </label>

            <label>
              Location:
              <input type="text" name="location" value={editingCustomer.location} onChange={handleChange} />
            </label>
            <div className="modal-actions_admin">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomersAdmin;
