import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import numeral from 'numeral';
import './InfoBox.css';

function InfoBox({ title, cases, total, active, ...props }) {
  return (
    <Card
      className={`infoBox ${active && 'infoBox--selected'}`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className='infoBox__title' color='textSecondary'>
          {title}
        </Typography>
        <h2 className='infoBox__cases'> + {numeral(cases).format('0,0')}</h2>
        <Typography className='infoBox__total' color='textSecondary'>
          {numeral(total).format('0,0')} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
