import React from 'react';
import Globe from 'react-globe.gl';
import { Drawer } from 'antd';

var data = require('./ne_110m_admin_0_countries.geojson')

const { useState, useEffect, useRef } = React;


export const CovidGlobe = () => {
    const globeEl = useRef();
    const [countries, setCountries] = useState({ features: []});
    const [altitude, setAltitude] = useState(0.1);
    const [transitionDuration, setTransitionDuration] = useState(1000);
    const [visible, setVisible] = useState(false);
    const [country, setCountry] = useState('');
    const [confirmed, setConfirmed] = useState('fetching values...');
    const [deaths, setDeaths] = useState('fetching values...');
    const [recovered, setRecovered] = useState('fetching values...');

    useEffect(() => {
      // load data
      fetch(data).then(res => res.json())
        .then(countries=> {
          setCountries(countries);

          setTimeout(() => {
            setTransitionDuration(2000);
            setAltitude(() => feat => Math.max(0.1, Math.sqrt(+feat.properties.POP_EST) * 7e-5));
          }, 3000);
        });
    }, []);

    useEffect(() => {
      // Auto-rotate
      globeEl.current.controls().autoRotate = false;

      globeEl.current.pointOfView({ altitude: 4 }, 5000);
    }, []);


    const onClose = () => {
        setVisible(false)
    };

    const getDetails = async (CountryCode, CountryName) => {
        setVisible(true);
        setCountry(CountryName)
        var search_string = ('https://covid19.mathdro.id/api/countries/'+CountryCode);
        var res = await fetch(search_string)
        .then(res => res.json())
        .then(result => {
            setConfirmed(result.confirmed.value);
            setDeaths(result.deaths.value);
            setRecovered(result.recovered.value);

        })

    }



    return (
    <div>
    <Globe
       ref={globeEl}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"

      polygonsData={countries.features}
      polygonAltitude={altitude}
      polygonCapColor={() => 'rgba(200, 200, 0, 0.6)'}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
      polygonLabel={({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
        Population: <i>${Math.round(+d.POP_EST / 1e4) / 1e2}M</i>
      `}
      onPolygonClick={({ properties: d }) => getDetails(d.WB_A2, d.ADMIN)}
    //   onPolygonClick={() => {console.log()}}
      polygonsTransitionDuration={transitionDuration}
    />
        <Drawer
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
          width="300"
        >
            <h1 className="tc center f1">{country}</h1>
            <p className="f3 tc">Confirmed : {confirmed}</p>
            <p className="f3 tc">Deaths : {deaths}</p>
            <p className="f3 tc">Recovered : {recovered}</p>
        </Drawer>
    </div>
    )
};