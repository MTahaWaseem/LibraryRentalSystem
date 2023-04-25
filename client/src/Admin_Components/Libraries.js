import React from 'react';

const Libraries = ({ l, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <ul className='list-group mb-4'>
      {l.map(libraries => (
        <li key={libraries.Library_ID} className='list-group-item'>
          {libraries.Name}
        </li>
      ))}
    </ul>
  );
};

export default Libraries;