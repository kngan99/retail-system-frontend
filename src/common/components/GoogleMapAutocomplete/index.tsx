import { observer } from 'mobx-react';
import React from 'react';

interface ComponentProps {
  className?: string;
  componentId: string;
  handleChangePlace: any;
  field: string;
  setFieldValue?: any;
  defaultValue?: string;
  value?: any;
  onChange?: any;
  isInvalid?: any;
  placeHolder?: any;
}

const GoogleMapAutocomplete = (props: ComponentProps) => {
  const {
    className,
    componentId,
    handleChangePlace,
    field,
    setFieldValue,
    defaultValue,
    value,
    onChange,
    placeHolder,
  } = props;

  // const [value, setValue] = React.useState<string>(defaultValue ?? '');

  React.useEffect(() => {
    const input = document.querySelector(`#${componentId}`) as HTMLInputElement;
    console.log(input);
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['address'],
      componentRestrictions: { country: 'vn' },
    });
    autocomplete.setFields([
      'address_components',
      'formatted_address',
      'geometry',
    ]);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      handleChangePlace(place, field, setFieldValue);
    });
  }, [componentId, field, handleChangePlace, setFieldValue]);

  return (
    <>
      <div className={`search-location-input ${className ? className : ''}`}>
        <input
          id={componentId}
          placeholder={placeHolder} 
          value={value}
          onChange={(value) => {
            onChange(value);
          }}
        />
        {defaultValue && <i></i>}
      </div>
    </>
  );
};

export default observer(GoogleMapAutocomplete);
