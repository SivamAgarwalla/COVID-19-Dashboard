import React, { useEffect } from 'react';
import './App.css';
import {
  Card,
  MenuItem,
  FormControl,
  Select,
  CardContent,
  InputLabel,
} from '@material-ui/core';
import InfoBox from './components/InfoBox';
import CaseMap from './components/CaseMap';
import CountryTable from './components/CountryTable';
import LineGraph from './components/Linegraph';
import 'leaflet/dist/leaflet.css';

function App() {
  const [countries, setCountries] = React.useState([]);
  const [country, setCountry] = React.useState('WORLDWIDE');
  const [countryInfo, setCountryInfo] = React.useState({});
  const [mapCenter, setMapCenter] = React.useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapZoom, setMapZoom] = React.useState(3);
  const [mapCountries, setMapCountries] = React.useState([]);
  const [casesType, setCasesType] = React.useState('cases');

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((allCountryData) => {
          const countries = allCountryData.map((country) => ({
            name: country.country,
            value: country.countryInfo.ios3,
          }));

          setMapCountries(allCountryData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  // This code may be causing an ERROR!
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (e) => {
    setCountry(e.target.value);
    const countryCode = e.target.value;
    const url =
      countryCode === 'WORLDWIDE'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode !== 'WORLDWIDE') {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  return (
    <div className='app'>
      <div className='app__left'>
        {/* Place in Header Component*/}
        <div className='app__header'>
          <h1> Covid-19 Tracker</h1>
          <FormControl className='app__header__dropdown'>
            <InputLabel id='app__header__dropdown__label'>
              Country Name
            </InputLabel>
            <Select onChange={onCountryChange} value={country}>
              <MenuItem value='WORLDWIDE'>Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='app__stats'>
          <InfoBox
            active={casesType === 'cases'}
            onClick={(e) => setCasesType('cases')}
            title='Coronavirus Cases'
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            active={casesType === 'recovered'}
            onClick={(e) => setCasesType('recovered')}
            title='Recovered'
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            active={casesType === 'deaths'}
            onClick={(e) => setCasesType('deaths')}
            title='Deaths'
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <CaseMap
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3> Live Cases by Country </h3>
          <CountryTable></CountryTable>
          <h3>
            {' '}
            Worldwide New{' '}
            {casesType.charAt(0).toUpperCase() + casesType.slice(1)}{' '}
          </h3>
          <LineGraph caseType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
