import React, { useState } from 'react';
import { Range, getTrackBackground } from 'react-range';

const RangeSliderExample = (props2) => {
  
  const [values, setValues] = useState([2000, 3000]);

  const handleChange = (newValues) => {
    setValues(newValues);
    
    props2.call_back1(newValues[0]);
    props2.call_back2(newValues[1]);
  };

  
  const renderMark = (value) => (
    <div key={value} style={{ ...calibrationStyle, left: `${(value / 5000) * 100}%`, marginTop: '-25px', fontSize: '12px', fontWidth: '4px', color: 'gray' }} className="font-weight-light">
      <div style={{ width: '1px', height: '12px', backgroundColor: 'gray' }}></div>
      <div style={{ backgroundColor: 'none !important', }} />
      {value}
    </div>
  );

  const renderMark2 = (value) => (
    <div key={value} style={{ ...calibrationStyle, left: `${(value / 5000) * 100}%`, marginTop: '-25px', fontSize: '12px' }}>
      <div style={{ width: '1px', height: '8px', backgroundColor: 'gray' }}></div>
      <div style={{ backgroundColor: 'none !important' }} />
    </div>
  );

  const renderThumb = (props) => (

    
   
    <div
      {...props}
      style={{
        ...props.style,
        height: '20px',
        width: '2px',
        backgroundColor: 'red',
      }}
    >
      <div style={{ borderRadius:'6px',
      width: '60px',
       height: '16px', 
       background: 'linear-gradient(to right, red, yellow)',
        marginTop: '-20px', 
        marginLeft: '-30px',
         display: 'flex', 
         justifyContent: 'center', 
         alignItems: 'center', 
         fontSize: '10px' ,
         color:'white'}}>
       
       {/* key was a number */}

        {props2.order===1 ? `$`: ``}
        {props.key===0 ? values[0] : values[1]}
        {props2.order===1 ? ``: `sqm`}
       
      </div>
    </div>
  );

  return (
    <div style={{paddingTop:'30px',flex:1,}}>
      <div>{props2.text}</div>
    <div style={{ paddingTop: '20px', width: '60%', marginBottom: '-50px', paddingTop: '30px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Range
            step={1}
            min={0}
            max={5000}
            values={values}
            onChange={handleChange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '12px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values,
                    colors: ['#ccc', 'red', '#ccc'],
                    min: 0,
                    max: 5000,
                  }),
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
             
              renderThumb(props)
            )}
          />
          {[0, 1250, 2500, 3750, 5000].map((mark) => renderMark(mark))}
          {[250, 500, 750, 1000, 1500, 1750, 2000, 2250, 2750, 3000, 3250, 3500, 4000, 4250, 4500, 4750].map((mark) => renderMark2(mark))}
        </div>
      </div>
    </div>
    </div>
  );
};

const calibrationStyle = {
  position: 'absolute',
  top: '40px',
  transform: 'translateX(-50%)',
  color: '#333',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export default RangeSliderExample;
