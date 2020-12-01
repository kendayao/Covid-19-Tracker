import {Circle, Popup} from "react-leaflet"
import numeral from "numeral"
import React from "react"


const casesTypeColors={
    cases:{
        hex: "#fb4443",
        multiplier: 400,
    },
    recovered:{
        hex: "#7dd71d",
        multiplier: 400,
    },
    deaths:{
        hex: "#CC1034",
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
            key={country.countryInfo._id}
                center={[country.countryInfo.lat, country.countryInfo.long]}
                fillOpacity={0.4}
                color={casesTypeColors[casesType].hex}
                fillColor={casesTypeColors[casesType].hex}
                radius={
                    Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier
                }
            >
                <Popup>
                    <div className="info-container">
                        <div className="info-flag" style={{backgroundImage:`url(${country.countryInfo.flag})`}}/>
                        <div className="info-name">{country.country}</div>
                        <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                        <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                        <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                    </div>
                </Popup>

            </Circle>
        ))
    )
}

export const prettyPrintStat=(stat)=>{
   return stat? `+${numeral(stat).format("0.0a")}`: "+0";
}