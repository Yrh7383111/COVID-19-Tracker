import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";



// Information box component
// Object destructing
function InfoBox({ title, cases, total }) {
    return (
        <Card>
            <CardContent>
                {/* Title */}
                <Typography classes='title' color='textSecondary'>{title}</Typography>

                {/* Cases */}
                <h2 className='cases'>{cases}</h2>

                {/* Total */}
                <Typography className='total' color='textSecondary'>{total} Total</Typography>
            </CardContent>
        </Card>
    );
}



export default InfoBox;