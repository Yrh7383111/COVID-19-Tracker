import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import './info-box.styles.css'



// Information box component
// Object destructing
function InfoBox({ title, active, isRed, cases, total, ...props }) {
    return (
        <Card className={`info-box ${active && 'info-box-selected'} ${isRed && 'info-box-red'}`}
              onClick={props.onClick}>
            <CardContent>
                {/* Title */}
                <Typography classes='title' color='textSecondary'>{title}</Typography>

                {/* Cases */}
                <h2 className={`info-box-cases ${!isRed && 'info-box-cases-green'}`}>{cases}</h2>

                {/* Total */}
                <Typography className='info-box-total' color='textSecondary'>{total} Total</Typography>
            </CardContent>
        </Card>
    );
}



export default InfoBox;