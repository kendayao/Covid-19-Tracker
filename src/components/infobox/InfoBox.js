// React imports
import React from 'react'
import './InfoBox.css'
//Material UI imports
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({title, cases, isDarkRed, isLightRed, active, total, ...props}){
    return(
        <Card onClick={props.onClick} className={`infoBox ${active&&'infoBox--selected'} ${isLightRed&&'infoBox--lightRed'} ${isDarkRed&&'infoBox--darkRed'}`}>
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>
                <h2 className={`infoBox__cases ${isLightRed && 'infoBox__cases--lightRed'} ${isDarkRed && 'infoBox__cases--darkRed'}`}>{cases}</h2>
                <Typography className="infoBox__total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox