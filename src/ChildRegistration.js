import React, { useState } from 'react';

import ChildDataList from './ChildDataList';

const ChildRegistrationForm = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      age: '',
      gender: 'Male',
      immunizations: [],
    });

    const [showChildDataList, setShowChildDataList] = useState(false);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      const updatedImmunizations = checked
        ? [...formData.immunizations, name]
        : formData.immunizations.filter((item) => item !== name);
  
      setFormData({ ...formData, immunizations: updatedImmunizations });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Save form data to indexedDB
      saveToIndexedDB(formData);
  
      // Optionally, you can reset the form after submission
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        gender: 'Male',
        immunizations: [],
      });
    };
  
    const saveToIndexedDB = (data) => {
      const dbName = 'ChildDatabase';
      const dbVersion = 1;
      const storeName = 'ChildData';
  
      const request = indexedDB.open(dbName, dbVersion);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('firstName', 'firstName', { unique: false });
        objectStore.createIndex('lastName', 'lastName', { unique: false });
        objectStore.createIndex('age', 'age', { unique: false });
        objectStore.createIndex('gender', 'gender', { unique: false });
        objectStore.createIndex('immunizations', 'immunizations', { unique: false });
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readwrite');
        const objectStore = transaction.objectStore(storeName);
  
        // Add the form data to the object store
        const requestAdd = objectStore.add(data);
  
        requestAdd.onsuccess = () => {
          console.log('Form data saved to indexedDB');
        };
  
        requestAdd.onerror = (error) => {
          console.error('Error saving data to indexedDB:', error);
        };
  
        transaction.oncomplete = () => {
          db.close();
        };
      };
  
      request.onerror = (error) => {
        console.error('Error opening indexedDB:', error);
      };
    };

    const toggleChildDataList = () => {
        setShowChildDataList(!showChildDataList);
      };

  return (
    <div>
      {showChildDataList ? (
        <ChildDataList onClose={toggleChildDataList}  />
      ) : (
            <div>
            <h2>Child Registration Form</h2>
            <form onSubmit={handleSubmit}>
                <label>
                First Name:
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />
                </label>
                <br />

                <label>
                Last Name:
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />
                </label>
                <br />

                <label>
                Age:
                <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                />
                </label>
                <br />

                <label>
                Gender:
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                </label>
                <br />

                <label>
                Immunizations:
                <br />
                <input
                    type="checkbox"
                    name="BCG"
                    checked={formData.immunizations.includes('BCG')}
                    onChange={handleCheckboxChange}
                />
                BCG
                <br />
                <input
                    type="checkbox"
                    name="MMR"
                    checked={formData.immunizations.includes('MMR')}
                    onChange={handleCheckboxChange}
                />
                MMR
                <br />
                <input
                    type="checkbox"
                    name="RV"
                    checked={formData.immunizations.includes('RV')}
                    onChange={handleCheckboxChange}
                />
                RV
                <br />
                <input
                    type="checkbox"
                    name="DTaP"
                    checked={formData.immunizations.includes('DTaP')}
                    onChange={handleCheckboxChange}
                />
                DTaP
                </label>
                <br />

                <button type="submit">Submit</button>
            </form>
                <button onClick={toggleChildDataList}>
                    {showChildDataList ? 'Hide Child Data List' : 'Show Child Data List'}
                </button>

                {showChildDataList && <ChildDataList />}
            </div>
        )}
    </div>
  );
};

export default ChildRegistrationForm;
