import React, { useState ,useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { cities, bedrooms, bathrooms, houseType } from './Prices.js';
import './Search.css';
import RangeSliderExample from './RangeSlider.js';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const navigate = useNavigate();
    const [Search_key, setSearch_key] = useState({
        type: "Type",
        bathrooms: "Bathrooms",
        bedrooms: "Bedrooms",
        fees_beg: 2000,
        fees_end: 3000,
        size_beg: 2000,
        size_end: 3000,
        page: 1,
        city: "Place",
    });

    const [bed,setBed] = useState({name:"Bedrooms"});
    const [bathroom,setBathroom] = useState({name:"Bathrooms"});

  
    const sendReq = () => {
       if(Search_key.type==="Type" || Search_key.bathrooms==="Bathrooms" || Search_key.bedrooms==="Bedrooms" || Search_key.city==="Place"){
        toast.error("ALL FIELDS ARE REQUIRED");
       }
       else{
       // Construct the URL with parameters
       console.log(Search_key);
       const url = `/renthome?type=${Search_key.type}&bathrooms=${Search_key.bathrooms}&bedrooms=${Search_key.bedrooms}&city=${Search_key.city}&fees_beg=${Search_key.fees_beg}&fees_end=${Search_key.fees_end}&size_beg=${Search_key.size_beg}&size_end=${Search_key.size_end}&page=${Search_key.page}`;
        
       // Navigate to the constructed URL
       navigate(url);

       }
        // Send request with Search_key data
    }

    const get_area_left = (value) => {
        // Update size_beg in Search_key with the new value
        setSearch_key(prevState => ({ ...prevState, size_beg: value }));
        
    }

    const get_area_right = (value) => {
        // Update size_end in Search_key with the new value
        setSearch_key(prevState => ({ ...prevState, size_end: value }));
    }

    const get_price_left = (value) => {
        // Update fees_beg in Search_key with the new value
        setSearch_key(prevState => ({ ...prevState, fees_beg: value }));
    }

    const get_price_right = (value) => {
        // Update fees_end in Search_key with the new value
        setSearch_key(prevState => ({ ...prevState, fees_end: value }));
    }

    const handleCityChange = (selectedCity) => {
        // Update city in Search_key with the selected city
        setSearch_key(prevState => ({ ...prevState, city: selectedCity }));
    };

    const handleTypeChange = (selectedType) => {
        // Update type in Search_key with the selected type
        setSearch_key(prevState => ({ ...prevState, type: selectedType }));
    };

    const handleBedroomChange = (selectedBedroom) => {
        // Update bedrooms in Search_key with the selected bedroom
        setSearch_key(prevState => ({ ...prevState, bedrooms: selectedBedroom.array[0].toString()}));
        setBed(prevState => selectedBedroom);
    };

    const handleBathroomChange = (selectedBathroom) => {
        // Update bathrooms in Search_key with the selected bathroom
        setSearch_key(prevState => ({ ...prevState, bathrooms: selectedBathroom.array[0].toString() }));
        setBathroom(prevState => selectedBathroom);
       
    };
    return (
        <div style={{ height: '600px', backgroundColor: 'white' }}>
            <div className="davtoki" style={{ color: 'linear-gradient(to right, red, yellow) !important' }}>
                <div className="davtokaa">
                    Search Properties For Rent
                </div>
                <div className="sammyu">

                          <Dropdown style={{ flex: 1 }}>
                      <Dropdown.Toggle
                        className="pokemonee2 btn btn-primary custom-dropdown-toggle ">
                       {Search_key.city}
                        <span className="custom-caret">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-caret-down"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 10.795l-6.647-6.647a1.5 1.5 0 0 1 2.122-2.122L8 6.65l4.525-4.524a1.5 1.5 0 0 1 2.122 2.122L8 10.795z" />
                          </svg>
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="full-width-dropdown">
                        {cities.map((item) => (
                           <Dropdown.Item key={item._id} onClick={() => handleCityChange(item.name)}>{item.name}</Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>




                    <Dropdown style={{ flex: 1 }}>
                        <Dropdown.Toggle className="pokemonee2 btn btn-primary custom-dropdown-toggle ">
                            {Search_key.type}
                            <span className="custom-caret">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-caret-down"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 10.795l-6.647-6.647a1.5 1.5 0 0 1 2.122-2.122L8 6.65l4.525-4.524a1.5 1.5 0 0 1 2.122 2.122L8 10.795z" />
                                </svg>
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="full-width-dropdown">
                            {houseType.map((item) => (
                                <Dropdown.Item key={item._id} onClick={() => handleTypeChange(item.name)}>{item.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>



                    <Dropdown style={{ flex: 1 }}>
                        <Dropdown.Toggle className="pokemonee2 btn btn-primary custom-dropdown-toggle ">
                        {bed.name}
                            <span className="custom-caret">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-caret-down"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 10.795l-6.647-6.647a1.5 1.5 0 0 1 2.122-2.122L8 6.65l4.525-4.524a1.5 1.5 0 0 1 2.122 2.122L8 10.795z" />
                                </svg>
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="full-width-dropdown">
                            {bedrooms.map((item) => (
                                <Dropdown.Item key={item._id} onClick={() => handleBedroomChange(item)}>{item.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>





                    <Dropdown style={{ flex: 1 }}>
                        <Dropdown.Toggle className="pokemonee2 btn btn-primary custom-dropdown-toggle ">
                        {bathroom.name}
                            <span className="custom-caret">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-caret-down"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 10.795l-6.647-6.647a1.5 1.5 0 0 1 2.122-2.122L8 6.65l4.525-4.524a1.5 1.5 0 0 1 2.122 2.122L8 10.795z" />
                                </svg>
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="full-width-dropdown">
                            {bathrooms.map((item) => (
                                <Dropdown.Item key={item._id} onClick={() => handleBathroomChange(item)}>{item.name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>



                </div>
                <div style={{ display: "flex", paddingLeft: '10%' }}>
                    <RangeSliderExample text={"Price Range:"} order={1} call_back1 = {get_price_left} call_back2 = {get_price_right}/>
                    <RangeSliderExample text={"Area Range(sqm):"} order={0} call_back1 = {get_area_left} call_back2 = {get_area_right}/>
                </div>
                <div className="ertyu" onClick = {sendReq}>Search</div>
            </div>
        </div>
    );
};

export default Search;
