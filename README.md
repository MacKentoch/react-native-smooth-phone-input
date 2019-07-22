# react-native-smooth-phone-input

> react-native user friendly phone input (users may not like country codes when typing their phone number 😉)

## What it does and does not

IT:

- follows national patterns (who write his own phone number in international pattern 🤨)
- validates number
- gives international matching number (*backend may prefer international pattern*)

BUT IT:

- does not make ☕️ (not planned to do so, sorry 😋)

<div style="position:relative;width:100vw;display:flex;flex-direction:row; flex-grow:1;background-color: #333333;padding:1rem 0.5rem;">
  <img src="https://raw.githubusercontent.com/MacKentoch/react-native-smooth-phone-input/master/assets/failed-1.png" height="525px"  width="250px" alt="failed-1" style="margin-right:0.5rem;border:solid 1px #333333 1px;border-radius:20px;"/>
  <img src="https://raw.githubusercontent.com/MacKentoch/react-native-smooth-phone-input/master/assets/success-1.png" height="525px"  width="250px" alt="success-1" style="margin-right:0.5rem;border:solid 1px #333333;border-radius:20px;" />
  <img src="https://raw.githubusercontent.com/MacKentoch/react-native-smooth-phone-input/master/assets/failed-2.png" height="525px"  width="250px" alt="failed-2" style="margin-right:0.5rem;border:solid 1px #333333 ;border-radius:20px;" />
</div>

## Full use case

```javascript
// @flow

// #region imports
import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import PhoneInput from 'react-native-smooth-phone-input';
import CountryPicker from 'react-native-country-picker-modal';
// #endregion

// #region flow types
export type Props = { ...any };

export type State = {
  pickerData: Array<any> | null,
  cca2?: string,
  initialValue?: string,
  initialCountry: 'fr' | 'us' | 'uk',
  translation?: 'fra' | 'eng',
  placeholder?: string,

  isValidPhoneNumber: boolean,
  countryCode: string,
  isoCode: string,
  intPhoneNum: string,

  ...any,
};
// #endregion

// #region constants
const { height: deviceHeight } = Dimensions.get('window');
// #endregion

class Demo extends PureComponent<Props, State> {
  // #region references
  phone: any = null;
  countryPicker: any = null;
  // #endregion

  state = {
    cca2: '',
    placeholder: '',
    initialCountry: 'fr',
    initialValue: null,
    translation: 'fra',

    isValidPhoneNumber: false,
    countryCode: '',
    isoCode: '',
    intPhoneNum: '',
  };

  // #region lifecycle
  componentDidMount() {
    this.setState({ pickerData: this.phone.getPickerData() });
  }

  render() {
    const {
      cca2,
      placeholder,
      initialCountry,
      initialValue,
      translation,
      isValidPhoneNumber,
      countryCode,
      isoCode,
      intPhoneNum,
    } = this.state;

    const valueProps = !initialValue ? {} : { value: initialValue };

    return (
      <View style={styles.container}>
        <View style={styles.phoneForm}>
          {/* phone input: */}
          <PhoneInput
            ref={this.setPhoneRef}
            style={{
              height: 50,
              backgroundColor: '#FFFFFF',
              paddingHorizontal: 10,
              borderColor: '#EEEEEE',
              borderWidth: 1,
              borderRadius: 1,
            }}
            onPressFlag={this.onPressFlag}
            initialCountry={initialCountry.toLowerCase()}
            autoFormat
            textProps={{
              placeholder,
              keyboardType: 'phone-pad',
              textContentType: 'telephoneNumber',
            }}
            {...valueProps}
            onChangePhoneNumber={this.handlesOnInputChange}
          >
            {cca2}
          </PhoneInput>
          <View style={styles.statusContainer}>
            <Text>
              Phone number is valid:{' '}
              {!isValidPhoneNumber ? 'NOT A VALID NUMBER' : 'VALID!'}
            </Text>
            <Text>country code: {countryCode || ''}</Text>
            <Text>iso code: {isoCode || ''}</Text>
            <Text>international phone number: {intPhoneNum || ''}</Text>
          </View>

          {/* country picker modal: */}
          <CountryPicker
            ref={this.setCountryPicker}
            onChange={this.handlesOnSelectCountry}
            translation={translation}
            cca2={cca2 || 'fr'}
            filterable
            filterPlaceholder={'Select a country'}
            closeable
            transparent
            autoFocusFilter
            styles={countryPickerStyle}
          >
            <View />
          </CountryPicker>
        </View>
      </View>
    );
  }
  // #endregion

  // #region phone input related

  // #region set phone input reference
  setPhoneRef = (ref: any) => (this.phone = ref);
  // #endregion

  // #region on press flag (open country  modal)
  onPressFlag = () => this.countryPicker.openModal();
  // #endregion

  // #region on input change event
  handlesOnInputChange = (value: string) => {
    this.setState({
      cca2: value,
      isValidPhoneNumber: this.phone.isValid(),
      countryCode: this.phone.getCountryCode(),
      isoCode: this.phone.getISOCode(),
      intPhoneNum: this.phone.getInternationalFormatted(),
    });

    const payload = {
      phone: this.phone.getInternationalFormatted(),
      isValidNumber: this.phone.isValid(),
      isoCode: this.phone.getISOCode(),
      countryCode: this.phone.getCountryCode(),
    };

    console.log('handlesOnInputChange: payload: ', payload);
  };
  // #endregion

  // #endregion

  // #region country picker related

  // #region set countryPicker reference
  setCountryPicker = (ref: any) => (this.countryPicker = ref);
  // #endregion

  // #region on country selection
  handlesOnSelectCountry = ({ cca2 }: { cca2: string }) => {
    this.phone.selectCountry(cca2.toLowerCase());
    this.setState({ cca2: cca2 });
  };
  // #endregion

  // #endregion
}

// #region styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  phoneForm: {
    marginTop: (deviceHeight * 1) / 5,
    flex: 1,
    paddingHorizontal: 10,
  },
  statusContainer: {
    marginVertical: 20,
  },
});

const countryPickerStyle = StyleSheet.create({
  itemCountryName: {
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
  },
  countryName: {
    color: '#4A4A4A',
    borderColor: 'transparent',
    fontSize: 15,
  },
  letterText: {
    color: '#4A4A4A',
    borderColor: 'transparent',
  },
  input: {
    color: '#4A4A4A',
    borderBottomWidth: 1,
    fontSize: 15,
    borderColor: '#4A4A4A',
  },
  closeButton: {
    height: 56,
    padding: 10,
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonImage: {
    height: 32,
    width: 32,
  },
});
// #endregion

export default Demo;
```


## Donate

Do you use & like `react-native-smooth-phone-input` but you don’t find a way to show some ❤️?
If yes, please consider donating to support this project. Otherwise, no worries, regardless of whether there is support or not, I will keep maintaining this project. Still, if you buy me a cup of coffee I would be more than happy though 😄

[![Support via PayPal](https://raw.githubusercontent.com/MacKentoch/react-native-smooth-phone-input/master/assets/Paypal-button.png)](https://www.paypal.me/ErwanDatin/)

## License

The MIT License (MIT)

Copyright (c) 2019 Erwan DATIN

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.