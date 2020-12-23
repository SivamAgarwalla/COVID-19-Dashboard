import React, { useEffect } from 'react';
import './CountryTable.css';
import { sortData } from '../util';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import { Table } from 'react-bootstrap';
import numeral from 'numeral';

function CountryTable() {
  const [tableData, setTableData] = React.useState([]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const sortedData = sortData(data);
        setTableData(sortedData);
      });
  }, []);

  return (
    <TableContainer className='table' component={Paper}>
      <Table striped bordered hover size='sm'>
        <thead>
          <tr>
            <th>Country</th>
            <th>Cases</th>
            <th>Deaths</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((country) => (
            <tr className='row' key={country.country}>
              <td>{country.country}</td>
              <td>{numeral(country.cases).format('0,0')}</td>
              <td>{numeral(country.deaths).format('0,0')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

export default CountryTable;
