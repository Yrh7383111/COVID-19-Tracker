import React, { useState, useEffect} from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from "@material-ui/core";
import InfoBox from "./components/info-box/info-box.component";
import Map from "./components/map/map.component";
import Table from "./components/table/table.component";
import { sortData } from "./utility/utility";
import './App.css';



function App() {
    // State - property + set method
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);



    // Use effect for countryInfo - runs when the component first mounts
    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    // Use effect for countries - runs when the component first mounts
    useEffect(() => {
        const getCountriesData = async () => {
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
                });
        };

        // Call the function
        getCountriesData();
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
                <InfoBox title='Total Cases' cases={countryInfo.todayCases} total={countryInfo.cases} />

                {/* Information box - Total recovered */}
                <InfoBox title='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered} />

                {/* Information box - Total death */}
                <InfoBox title='Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
            </div>


            {/* Map */}
            <Map />
        </div>



        <Card className='right'>
            <CardContent>
                {/* Tables */}
                <h3>Live Cases by Country</h3>
                <Table countries={tableData} />

                {/* Line chart */}
                <h3>Worldwide new Cases</h3>
            </CardContent>
        </Card>
    </div>
  );
}



export default App;