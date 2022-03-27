import RouteComp, { getData } from './models/route';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

function App()
{
    const storeData = useSelector(state => state);
    const dispatch = useDispatch();

    const[theme,setTheme]= useState(true); // default - light theme
    
    const colorPageButton= ['rgb(123, 185, 171)','white']; // button color of this page

    useEffect(()=> 
    {
        // default button page will be colored
        document.getElementById('home').style.backgroundColor= colorPageButton[0];
        document.getElementById('home').style.color= colorPageButton[1];

        // check permission to user location
        window.navigator.permissions && window.navigator.permissions.query({name: 'geolocation'})
        .then(async function(PermissionStatus) 
        {
            if (PermissionStatus.state == 'granted' || PermissionStatus.state == 'prompt') 
            {
                // weather in this location
                window.navigator.geolocation.getCurrentPosition(async(position) => {

                    try
                    {
                        let data= await getData([position.coords.latitude,position.coords.longitude],4);
                        let today= await getData(data[1],1);
                        let days= await getData(data[1],2);

                        dispatch({type: "LOAD", payload: [today,days,data]});
                    }

                    catch(e)
                    {
                        alert('This website has exceeded its daily limit!');
                        console.log(e);
                    }
                }); 
            }

            if (PermissionStatus.state == 'denied')  // weather in default location - Tel Aviv
            {
                try
                {
                    let data= ['Tel Aviv', 215854];
                    let today= await getData(data[1],1);
                    let days= await getData(data[1],2);

                    dispatch({type: "LOAD", payload: [today,days,data]});
                }

                catch(e)
                {
                    alert('This website has exceeded its daily limit!');
                    console.log(e);
                }
            }
        })
    },[]); //when app start
    
    useEffect(()=> 
    {
        if(theme==true)
        {
            document.body.classList.add("light");
            document.body.classList.remove("dark");
        }

        else
        {
            document.body.classList.add("dark");
            document.body.classList.remove("light");
        }
    },[theme]); //every time the theme changes

    const color=(e)=> // this button page will be colored
    {
        document.getElementById('home').style='';
        document.getElementById('fav').style='';

        e.style.backgroundColor= colorPageButton[0];
        e.style.color= colorPageButton[1];
    }

    return (<>
    
        <header>
            <div>&nbsp;Weather App</div>

            <div>  
                <Link to='/'><input id="home" type="button" value="Home" onClick={e=> color(e.target)}/></Link>&nbsp;
                <Link to='favorites'><input id="fav" type="button" value="Favorites" onClick={e=> color(e.target)}/></Link>&nbsp; 
            </div>
        </header><br/>

        <div style={{textAlign: 'center'}}>

            {storeData.length!=0 ? // button - shows Fahrenheit or Celsius 
                <input type='button' value='C/F' onClick={()=> dispatch({type: "TEMP", payload: !storeData[1]})}/>
                : null
            }&nbsp;

            <button id='bt' onClick={()=> setTheme(!theme)}>
                {theme==false ? // dark or light theme
                    <FontAwesomeIcon icon={faSun} className='sun'/>
                    :    
                    <FontAwesomeIcon icon={faMoon} className='moon'/>
                }
            </button>
        </div>

        <RouteComp/>
    </>)
}

export default App;
