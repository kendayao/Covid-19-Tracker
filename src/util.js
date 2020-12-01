import {Circle, Popup} from "react-leaflet"
import numeral from "numeral"
import React from "react"


const casesTypeColors={
    cases:{
        hex: "#CC1034",
        multiplier: 400,
    },
    recovered:{
        hex: "#7dd71d",
        multiplier: 1200,
    },
    deaths:{
        hex: "#fb4443",
 
        multiplier: 2000,
    },
}



export const sortData=(data)=>{
    const sortedData=[...data];

    sortedData.sort((a,b)=>(b.cases-a.cases))
    return sortedData;
}

export const showDataOnMap=(data, casesType="cases")=>{
    return(
        data.map(country=>(
            <Circle
                center={[country.countryInfo.lat, country.countryInfo.long]}
                fillOpacity={0.4}
                color={casesTypeColors[casesType].hex}
                fillColor={casesTypeColors[casesType].hex}
                radius={
                    Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier
                }
            >
                <Popup>
                    <h1>IM A POPUP</h1>
                </Popup>


            </Circle>
        ))
    )
}