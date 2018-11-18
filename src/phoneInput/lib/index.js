import React, { Component } from 'react';
import { Image, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import PropTypes from 'prop-types';
import Country from './country';
import Flags from './resources/flags';
import PhoneNumber from './phoneNumber';
import styles from './styles';
import CountryPicker from './countryPicker';

export default class PhoneInput extends Component {
  static setCustomCountriesData(json) {
    Country.setCustomCountriesData(json);
  }

  constructor(props, context) {
    super(props, context);

    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.getFlag = this.getFlag.bind(this);
    this.getISOCode = this.getISOCode.bind(this);

    const { countriesList, disabled, initialCountry } = this.props;

    if (countriesList) {
      Country.setCustomCountriesData(countriesList);
    }
    // const countryData = PhoneNumber.getCountryDataByCode(initialCountry);

    this.state = {
      iso2: initialCountry,
      disabled,
      formattedNumber: PhoneNumber.formatNational(this.props.value), // countryData ? `+${countryData.dialCode}` : '',
      value: null,
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.onChangePhoneNumber(PhoneNumber.formatNational(this.props.value));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { value: prevValue, disabled: prevDisabled } = prevProps;
    const { value: nextValue, disabled: nextDisabled } = this.props;

    const { iso2: prevIso2 } = prevState;
    const { iso2: nextIso2 } = this.state;

    if (prevIso2 !== nextIso2) {
      this.onChangePhoneNumber(PhoneNumber.formatNational(nextValue));
    }

    if (prevDisabled !== nextDisabled) {
      this.setState({ disabled: nextDisabled });
    }

    if (prevValue !== nextValue) {
      if (nextValue && nextValue !== this.state.value) {
        this.setState({ value: nextValue });
        this.onChangePhoneNumber(PhoneNumber.formatNational(nextValue));
      }
    }
  }

  onChangePhoneNumber(number) {
    const actionAfterSetState = this.props.onChangePhoneNumber
      ? () => {
          this.props.onChangePhoneNumber(number);
        }
      : null;
    this.updateFlagAndFormatNumber(number, actionAfterSetState);
  }

  onPressFlag() {
    if (this.props.onPressFlag) {
      this.props.onPressFlag();
    } else {
      if (this.state.iso2) {
        this.picker.selectCountry(this.state.iso2);
      }
      this.picker.show();
    }
  }

  getPickerData() {
    return PhoneNumber.getAllCountries().map((country, index) => ({
      key: index,
      image: Flags.get(country.iso2),
      label: country.name,
      dialCode: `+${(country && country.dialCode) || ''}`,
      iso2: country.iso2,
    }));
  }

  getCountryCode() {
    const countryData = PhoneNumber.getCountryDataByCode(this.state.iso2);
    if (!countryData) {
      return '';
    }
    return countryData.dialCode;
  }

  getAllCountries() {
    return PhoneNumber.getAllCountries();
  }

  getFlag(iso2) {
    return Flags.get(iso2);
  }

  getDialCode() {
    return PhoneNumber.getDialCode(this.state.formattedNumber);
  }

  getValue() {
    return this.state.formattedNumber;
  }

  isValid() {
    return PhoneNumber.isValidNumber(
      this.state.formattedNumber,
      this.state.iso2,
    );
  }

  getInternationalFormatted = () => {
    const { iso2, formattedNumber } = this.state;
    return PhoneNumber.formatInternational(formattedNumber, iso2);
  };

  getNumberType() {
    return PhoneNumber.getNumberType(
      this.state.formattedNumber,
      this.state.iso2,
    );
  }

  getISOCode() {
    return this.state.iso2;
  }

  selectCountry(iso2) {
    if (this.state.iso2 !== iso2) {
      const countryData = PhoneNumber.getCountryDataByCode(iso2);
      if (countryData) {
        this.setState(
          {
            iso2,
          },
          () => {
            if (this.props.onSelectCountry) {
              this.props.onSelectCountry(iso2);
            }
          },
        );
      }
    }
  }

  isValidNumber() {
    return PhoneNumber.isValidNumber(
      this.state.formattedNumber,
      this.state.iso2,
    );
  }

  format(text) {
    return this.props.autoFormat
      ? PhoneNumber.format(text, this.state.iso2)
      : text;
  }

  updateFlagAndFormatNumber(number, actionAfterSetState = null) {
    const { initialCountry } = this.props;
    const { iso2 } = this.state;

    const newIso2 = !iso2 ? initialCountry : iso2;

    this.setState(
      { iso2: newIso2, formattedNumber: this.format(number) },
      actionAfterSetState,
    );
  }

  focus() {
    this.inputPhone.focus();
  }

  render() {
    const { iso2, formattedNumber, disabled } = this.state;
    const TextComponent = this.props.textComponent || TextInput;
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableWithoutFeedback
          onPress={this.onPressFlag}
          disabled={disabled}
        >
          <Image
            source={Flags.get(iso2)}
            style={[styles.flag, this.props.flagStyle]}
            onPress={this.onPressFlag}
          />
        </TouchableWithoutFeedback>

        <View style={{ flex: 1, marginLeft: this.props.offset || 10 }}>
          <TextComponent
            ref={ref => {
              this.inputPhone = ref;
            }}
            editable={!disabled}
            autoCorrect={false}
            style={[styles.text, this.props.textStyle]}
            onChangeText={text => {
              this.onChangePhoneNumber(text);
            }}
            keyboardType="phone-pad"
            underlineColorAndroid="rgba(0,0,0,0)"
            value={formattedNumber}
            {...this.props.textProps}
          />
        </View>

        <CountryPicker
          ref={ref => {
            this.picker = ref;
          }}
          selectedCountry={iso2}
          onSubmit={this.selectCountry}
          buttonColor={this.props.pickerButtonColor}
          buttonTextStyle={this.props.pickerButtonTextStyle}
          cancelText={this.props.cancelText}
          cancelTextStyle={this.props.cancelTextStyle}
          confirmText={this.props.confirmText}
          confirmTextStyle={this.props.confirmTextStyle}
          pickerBackgroundColor={this.props.pickerBackgroundColor}
          itemStyle={this.props.pickerItemStyle}
        />
      </View>
    );
  }
}

PhoneInput.propTypes = {
  textComponent: PropTypes.func,
  initialCountry: PropTypes.string,
  onChangePhoneNumber: PropTypes.func,
  value: PropTypes.string,
  style: PropTypes.object,
  flagStyle: PropTypes.object,
  textStyle: PropTypes.object,
  offset: PropTypes.number,
  textProps: PropTypes.object,
  onSelectCountry: PropTypes.func,
  pickerButtonColor: PropTypes.string,
  pickerBackgroundColor: PropTypes.string,
  pickerItemStyle: PropTypes.object,
  countriesList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      iso2: PropTypes.string,
      dialCode: PropTypes.string,
      priority: PropTypes.number,
      areaCodes: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  cancelText: PropTypes.string,
  cancelTextStyle: PropTypes.object,
  confirmText: PropTypes.string,
  confirmTextTextStyle: PropTypes.object,
  disabled: PropTypes.bool,
  allowZeroAfterCountryCode: PropTypes.bool,
};

PhoneInput.defaultProps = {
  initialCountry: 'us',
  disabled: false,
  allowZeroAfterCountryCode: true,
};
