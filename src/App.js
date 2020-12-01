import React, {useState, useEffect} from "react"
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import InfoBox from "./components/infobox/InfoBox";
import Table from './components/table/Table';
import {sortData, prettyPrintStat} from './util';
import LineGraph from './components/linegraph/LineGraph';
import Map from './components/map/Map';
import "leaflet/dist/leaflet.css";
import numeral from "numeral"

function App() {

  const[countries, setCountries]=useState([]);
  const[country, setCountry]=useState('worldwide');
  const[countryInfo, setCountryInfo]=useState({});
  const[tableData, setTableData]=useState([]);
  const[mapCenter, setMapCenter]=useState([34.80746, -40.4796]);
  const[mapZoom, setMapZoom]=useState(3);
  const[mapCountries, setMapCountries]=useState([]);
  const[casesType, setCaseType]=useState("cases");



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
          setMapCountries(data);
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
      countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);


    })
  }
console.log(countryInfo)
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
          <InfoBox isRed active={casesType==="cases"} onClick={()=>setCaseType('cases')} title="Coronavirus Cases" total={numeral(countryInfo.cases).format("0.0a")}  cases={prettyPrintStat(countryInfo.todayCases)}/>
          <InfoBox active={casesType==="recovered"} onClick={()=>setCaseType('recovered')} title="Recovered" total={numeral(countryInfo.recovered).format("0.0a")}  cases={prettyPrintStat(countryInfo.todayRecovered)} /> 
          <InfoBox isRed active={casesType==="deaths"} onClick={()=>setCaseType('deaths')} title="Deaths" total={numeral(countryInfo.deaths).format("0.0a")}  cases={prettyPrintStat(countryInfo.todayDeaths)} /> 
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
