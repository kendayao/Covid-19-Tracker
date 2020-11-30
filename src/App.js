import React, {useState, useEffect} from "react"
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import InfoBox from "./components/infobox/InfoBox";
import Table from './components/table/Table';
import {sortData} from './util';
import LineGraph from './components/linegraph/LineGraph';
import Map from './components/map/Map'

function App() {

  const[countries, setCountries]=useState([]);
  const[country, setCountry]=useState('worldwide');
  const[countryInfo, setCountryInfo]=useState({});
  const[tableData, setTableData]=useState([])

  useEffect(()=>{
    const getCountriesData=async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries= data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso2
          }));

          const sortedData=sortData(data)
          setTableData(sortedData);
          setCountries(countries);
      })
    }
    getCountriesData();
  },[])

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all").then(response=>response.json()).then(data=>{
      setCountryInfo(data)
    })
  },[])

  const onCountryChange=async (event)=>{
    const countryCode=event.target.value

    const url=countryCode==='worldwide'? 'https://disease.sh/v3/covid-19/all': 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url).then(response=>response.json()).then(data=>{
      setCountry(countryCode);
      setCountryInfo(data);
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
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country)=>(
            <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" total={countryInfo.cases}  cases={countryInfo.todayCases}/>
          <InfoBox title="Recovered" total={countryInfo.recovered}  cases={countryInfo.todayRecovered} /> 
          <InfoBox title="Deaths" total={countryInfo.todayDeaths}  cases={countryInfo.deaths} /> 
        </div>
        <div className="app__map">
          <Map />
        </div>
      </div>
      <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            <h3>Worldwide new cases<h6>(last 30 days)</h6></h3>
            <LineGraph />
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
