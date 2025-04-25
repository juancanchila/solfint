// src/components/DataTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const DataTable = ({ data, columns, onFilterChange, onEdit, onDelete, filterField }) => {
  return (
    <div>
      <TextField
        label={`Filter by ${filterField}`}
        variant="outlined"
        onChange={e => onFilterChange(filterField, e.target.value)}
        fullWidth
        style={{ marginBottom: '16px' }}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  <TableSortLabel>{column.title}</TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={column.field}>{item[column.field]}</TableCell>
                ))}
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(item.id)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => onDelete(item.id)}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DataTable;
