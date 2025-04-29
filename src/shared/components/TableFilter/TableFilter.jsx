import React, { useState } from 'react';

function TableFilter({ fields, onFilter }) {
  const [filterField, setFilterField] = useState(fields[0].field);
  const [filterValue, setFilterValue] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const handleFilter = () => {
    onFilter({
      field: filterField,
      value: filterValue,
      ascending: sortAsc,
    });
  };

  return (
    <div className="filter-panel">
      <input
        type="text"
        placeholder="Buscar..."
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
      />
      <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
        {fields.map(({ field, label }) => (
          <option key={field} value={field}>
            {label}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => setSortAsc(!sortAsc)}>
        {sortAsc ? 'Ascendente' : 'Descendente'}
      </button>
      <button type="button" onClick={handleFilter}>Filtrar</button>
    </div>
  );
}

export default TableFilter;
