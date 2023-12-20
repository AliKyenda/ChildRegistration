import React, { useState, useEffect } from 'react';

const ChildDataList = () => {
  const [childData, setChildData] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [showChildDataList, setShowChildDataList] = useState(true);
  const [sortCriteria, setSortCriteria] = useState(null);

  useEffect(() => {
    // Fetch data from indexedDB when the component mounts
    fetchDataFromIndexedDB();
  }, []);

  const fetchDataFromIndexedDB = () => {
    const dbName = 'ChildDatabase';
    const dbVersion = 1;
    const storeName = 'ChildData';

    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readonly');
      const objectStore = transaction.objectStore(storeName);

      // Fetch all data from the object store
      const requestGetAll = objectStore.getAll();

      requestGetAll.onsuccess = () => {
        setChildData(requestGetAll.result);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };

    request.onerror = (error) => {
      console.error('Error opening indexedDB:', error);
    };
  };

  const handleItemClick = (selectedItem) => {
    setSelectedChild(selectedItem);
  };

  const handleSort = (criteria) => {
    setSortCriteria(criteria);
    const sortedData = [...childData].sort((a, b) => {
      if (criteria === 'name') {
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      } else if (criteria === 'age') {
        return a.age - b.age;
      }
      return 0;
    });
    setChildData(sortedData);
  };

  const handleBackToForm = () => {
    // Reset the selectedChild state before closing
    setSelectedChild(null);
    // Hide the ChildDataList component
    setShowChildDataList(false);
  };

  return (
    <div style={{ display: showChildDataList ? 'block' : 'none' }}>
      <h2>Child Data List</h2>
      <label>*Click on name to view child's full profile</label>
      <br/><br />
      <div>
        <label>Sort by:</label>
        <button onClick={() => handleSort('name')}>Name</button>
        <button onClick={() => handleSort('age')}>Age</button>
      </div>

      
      
      <ul data-role="listview">
        <li><strong>Name:</strong> | <strong>Age:</strong> | <strong>Gender:</strong></li>
        {childData.map((data) => (
          <li key={data.id} onClick={() => handleItemClick(data)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            {`${data.firstName} ${data.lastName}`} |  {data.age} |  {data.gender}
          </li>
        ))}
      </ul>

      {selectedChild && (
        <div>
          <h3>Selected Child Details</h3>
          <p>
            <strong>Name:</strong> {`${selectedChild.firstName} ${selectedChild.lastName}`} <br />
            <strong>Age:</strong> {selectedChild.age} <br />
            <strong>Gender:</strong> {selectedChild.gender} <br />
            <strong>Immunizations:</strong> {selectedChild.immunizations.join(', ')}
          </p>
        </div>
      )}

    <button onClick={handleBackToForm}>Close</button>

    </div>
  );
};

export default ChildDataList;
