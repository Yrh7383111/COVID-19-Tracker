import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core";
import InfoBox from "./components/info-box/info-box.component";
import Map from "./components/map/map.component";
import Table from "./components/table/table.component";
import LineChart from "./components/line-chart/line-chart.component";
import { printPrettyStats, sortData } from "./utility/utility";
import './App.css';
import "leaflet/dist/leaflet.css"



function App() {
    // State - property + set method
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState('cases');



    // Use effect for countryInfo - runs when the component first mounts
    useEffect(async () => {
        const getCountryInfo = async () => {
            await fetch('https://disease.sh/v3/covid-19/all')
                .then((response) => response.json())
                .then((data) => {
                    setCountryInfo(data);
                });
        };

        getCountryInfo();
    }, []);


    // Use effect for countries - runs when the component first mounts
    useEffect(() => {
        const getCountries = async () => {
             await fetch('https://disease.sh/v3/covid-19/countries')
                .then(response => response.json())
                .then(data => {
                    // Enrich countries property
                    const countries = data.map(country => ({
                        value: country.countryInfo.iso2,
                        name: country.country
                    }))

                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setCountries(countries);
                    setMapCountries(data);
                });
        };

        // Call the function
        getCountries();
    }, []);



    // Helper functions
     const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        let url = '';
        if (countryCode === 'worldwide')
            url = 'https://disease.sh/v3/covid-19/all';
        else {
            url = `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        }

        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode);
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    };



  // Rendering
  return (
    <div className='app'>
        <div className='left'>
            <div className="header-and-dropdown">
                {/* Header */}
                <h1>COVID-19 TRACKER</h1>

                {/* Dropdown list */}
                <FormControl className='dropdown'>
                    <Select variant='outlined' value={country} onChange={onCountryChange}>
                        <MenuItem value="worldwide">Worldwide</MenuItem>

                        {countries.map(country => (
                            <MenuItem value={country.value}>{country.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>


            {/* Information box */}
            <div className="info-box">
                {/* Information box - Total case */}
                <InfoBox onClick={(event) => setCasesType('cases')}
                         title='Today Cases'
                         active={casesType === 'cases'}
                         isRed
                         cases={printPrettyStats(countryInfo.todayCases)}
                         total={printPrettyStats(countryInfo.cases)} />

                {/* Information box - Total recovered */}
                <InfoBox onClick={(event) => setCasesType('recovered')}
                         title='Today Recovered'
                         active={casesType === 'recovered'}
                         cases={printPrettyStats(countryInfo.todayRecovered)}
                         total={printPrettyStats(countryInfo.recovered)} />

                {/* Information box - Total death */}
                <InfoBox onClick={(event) => setCasesType('deaths')}
                         title='Today Deaths'
                         active={casesType === 'deaths'}
                         isRed
                         cases={printPrettyStats(countryInfo.todayDeaths)}
                         total={printPrettyStats(countryInfo.deaths)} />
            </div>


            {/* Map */}
            <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom} />
        </div>



        <Card className='right'>
            <CardContent>
                <div className='information'>
                    {/* Tables */}
                    <h3>Live Cases by Country</h3>
                    <Table countries={tableData} />


                    {/* Line chart */}
                    <h3>Worldwide new {casesType}</h3>
                    <LineChart casesType={casesType} />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}



export default App;