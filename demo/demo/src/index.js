// @flow

// #region imports
import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
    this.setState({ cca2: value });

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
