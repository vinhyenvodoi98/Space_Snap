import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 1rem;
  width: 100%;
  margin-bottom: 1em;
`;

const TableElement = styled.table`
  padding: 1rem;
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 1rem;
  text-align: left;
  word-break: break-all;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 1rem;
  text-align: left;
`;

interface TableProps {
  data: string[][];
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <TableContainer>
      <TableElement>
        <thead>
          <TableRow>
            {data[0].map((header, index) => (
              <TableHeader key={index}>{header}</TableHeader>
            ))}
          </TableRow>
        </thead>
        <tbody>
          {data.slice(1).map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </TableElement>
    </TableContainer>
  );
};

export default Table;
