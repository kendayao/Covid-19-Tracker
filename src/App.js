// React Components and utils imports
import React, {useState, useEffect} from "react"
import './App.css';
import InfoBox from "./components/infobox/InfoBox";
import Table from './components/table/Table';
import LineGraph from './components/linegraph/LineGraph';
import Map from './components/map/Map';
import {sortData, prettyPrintStat} from './util';
// Material UI, Leafletjs and numeral imports
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import "leaflet/dist/leaflet.css";
import numeral from "numeral"

function App() {
  const[countries, setCountries]=useState([]);
  const[country, setCountry]=useState('Worldwide');
  const[countryInfo, setCountryInfo]=useState({});
  const[tableData, setTableData]=useState([]);
  const[mapCenter, setMapCenter]=useState([34.80746, -40.4796]);
  // eslint-disable-next-line
  const[mapZoom, setMapZoom]=useState(3);
  const[mapCountries, setMapCountries]=useState([]);
  const[casesType, setCaseType]=useState("cases");

  useEffect(()=>{
    // on component load, get all data info for all countries
    const getCountriesData=async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries= data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso2,
            countryId: country.countryInfo._id
          }));
          const sortedData=sortData(data)
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
      })
    }
    getCountriesData();
  },[])

  useEffect(()=>{
    // on component load, get worldwide data.
    fetch("https://disease.sh/v3/covid-19/all").then(response=>response.json()).then(data=>{
      setCountryInfo(data)
    })
  },[])

  // get data for selected country
  const onCountryChange=async (event)=>{
    const countryCode=event.target.value
    const url=countryCode==='Worldwide'? 'https://disease.sh/v3/covid-19/all': 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url).then(response=>response.json()).then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);
      if(countryCode === "Worldwide"){
        setMapCenter([34.80746, -40.4796])
      }else{
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      }
    })
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app-dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
            <MenuItem value="Worldwide">Worldwide</MenuItem>
            {countries.map((country)=>(
            <MenuItem key={country.countryId} value={country.value}>{country.name}</MenuItem>
            ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox isLightRed active={casesType==="cases"} onClick={()=>setCaseType('cases')} title={`Coronavirus Cases Today (${country})`} total={numeral(countryInfo.cases).format("0.0a")}  cases={prettyPrintStat(countryInfo.todayCases)}/>
          <InfoBox active={casesType==="recovered"} onClick={()=>setCaseType('recovered')} title={`Reported Recovered Today (${country})`} total={numeral(countryInfo.recovered).format("0.0a")}  cases={prettyPrintStat(countryInfo.todayRecovered)} /> 
          <InfoBox isDarkRed active={casesType==="deaths"} onClick={()=>setCaseType('deaths')} title={`Reported Deaths Today (${country})`} total={numeral(countryInfo.deaths).format("0.0a")}  cases={prettyPrintStat(countryInfo.todayDeaths)} /> 
        </div>
        <div className="app__map">
          <Map
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
            casesType={casesType}
          />
        </div>
      </div>
      <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            <h3 className="graph__graphTitle">Worldwide new {casesType}<span>(last 30 days)</span></h3>
            <LineGraph className="app__graph" casesType={casesType} />
          </CardContent>
      </Card>
    </div>
  );
}
export default App;
