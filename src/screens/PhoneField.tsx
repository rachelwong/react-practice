import Layout from "@/components/Layout";
import SelectField from "@/components/SelectField";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import * as countryCodes from "country-codes-list";
import { useState } from "react";

const countries = countryCodes.customArray(
  {
    label: "{flag} +{countryCallingCode} {countryNameEn}",
    value: "{countryCallingCode}",
  },
  { sortBy: "value" },
);

const FIELD_MODE = {
  INPUT: "INPUT",
  COUNTRY: "COUNTRY",
} as const;

// // sanitise the input string so that anything that isn't
// // space, numbers, + are all removed
// const normalizePhoneInput = (rawStr: string) => {
//   // remove anything not number, spaces, +
//   const sanitised = rawStr.replace(notDigitSpacePlus, "");

//   const isPlus = sanitised.includes("+");

//   // remove +
//   const numbersOnly = sanitised.replace(/\+/g, "");

//   // if nothing left, then return nothing
//   if (!numbersOnly.trim().length && !isPlus) {
//     return "";
//   }

//   return "+" + numbersOnly;
// };

// const formatPhone = (val: string): string => {
//   const country = findCountryByAreaCode(val);
//   if (!country) {
//     return val;
//   }
//   const digits = val.replace(/\D/g, "");
//   const national = digits.slice(country.value.length);

//   // simple grouping: first 4 digits, then the rest  ->  "7555 555555"
//   const grouped = national.replace(/^(\d{4})(\d+)$/, "$1 $2");

//   return `+${country.value} ${grouped}`;
// };
// const isValid = (val: string): boolean => {
//   const country = findCountryByAreaCode(val);

//   if (country == null) {
//     return false;
//   }

//   const validNumberLengths = countryCodes
//     .filter("countryCallingCode", country.value)
//     .flatMap((x) => x.nationalNumberLengths);

//   // get only the digits
//   const digits = val.replace(/\D/g, "");
//   const phoneNumber = digits.slice(country.value.length);

//   // base length requirement
//   if (!validNumberLengths.length) {
//     return phoneNumber.length >= 4 && phoneNumber.length <= 15;
//   }

//   // is the phone number length matching any of the
//   return validNumberLengths.some((len) => len === phoneNumber.length);
// };

// const findCountryByAreaCode = (
//   phone: string,
// ): { label: string; value: string } | null => {
//   // replace anything that isn't a number
//   const digits = phone.replace(/\D/g, "");

//   if (!digits) {
//     return null;
//   }

//   // return the country with an area code starting with these numbers
//   return countries.find((c) => digits.startsWith(c.value)) ?? null;
// };

const parsePhone = (rawStr: string) => {
  // remove everything that isn't a digit
  const digits = rawStr.replace(/\D/g, "");

  const country = digits
    ? (countries.find((c) => digits.startsWith(c.value)) ?? null)
    : null;

  if (!country) {
    return { country, phoneNumber: "", isValid: false, formatted: rawStr };
  }

  const phoneNumber = digits.slice(country.value.length);

  const validPhoneLenByCode = countryCodes
    .filter("countryCallingCode", country.value)
    .flatMap((x) => x.nationalNumberLengths);

  const isValid = validPhoneLenByCode.length
    ? validPhoneLenByCode.some((len) => len === phoneNumber.length)
    : phoneNumber.length >= 4 && phoneNumber.length <= 15; // base requirements

  const formatted = `+${country.value} ${phoneNumber.replace(/^(\d{4})(\d+)$/, "$1 $2")}`;
  return { country, phoneNumber, isValid, formatted };
};

const PhoneField = () => {
  const [mode, setMode] = useState<
    (typeof FIELD_MODE)[keyof typeof FIELD_MODE]
  >(FIELD_MODE.INPUT);
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const { country: selectedCountry, isValid } = parsePhone(phone);

  const handlePhoneInput = (val: string) => {
    const parsed = parsePhone(val);
    if (parsed.isValid) {
      setError(false);
      // sets phone to the formatted version
      setPhone(parsed.formatted);
    } else {
      // do not set error here, do it onBlur
      // setError(true);
      // sets the phone to whatever the user inputs including any invalid characters
      // no formatting applied
      setPhone(val);
    }
  };

  return (
    <Layout
      brief="https://www.reactchallenges.com/challenges/phone-number-field"
      title="Custom phone field"
      description={
        <>
          Using{" "}
          <a
            className="link"
            href="https://github.com/Synergy-Shock/country-codes-list"
            target="_blank"
          >
            country-codes-list
          </a>{" "}
          npm dependency to handle generating phone codes, phone number lengths
          . Did investigate an{" "}
          <a className="link" href="https://restcountries.com/" target="_blank">
            open source REST api version
          </a>{" "}
          but does not seem to support getting full list.
          <p>
            This exercise demontrates why country code and phone number field is
            best kept separate in{" "}
            <a
              className="link"
              href="https://ux.stackexchange.com/questions/8509/international-phone-number-field-layout-and-design"
            >
              form design
            </a>
            .
          </p>
          <p>Claude Code assisted</p>
          <p>
            There is a known iterable key issue with the Select field given that
            multiple countries can use the same calling code. Leave it as it is
            as out of scope of question.{" "}
          </p>
        </>
      }
    >
      <div className="max-w-3xl mx-auto flex flex-col items-start justify-start gap-y-3">
        <div className="flex flex-row align-center items-start w-full h-auto">
          <ToggleGroup
            defaultValue={[mode]}
            onValueChange={(val) => {
              if (!val.length) {
                return;
              }
              setMode(val[0] as (typeof FIELD_MODE)[keyof typeof FIELD_MODE]);
            }}
          >
            <ToggleGroupItem value={FIELD_MODE.INPUT}>By Input</ToggleGroupItem>
            <ToggleGroupItem value={FIELD_MODE.COUNTRY}>
              By Country
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex flex-row align-center items-start w-full h-auto gap-x-5">
          {mode === FIELD_MODE.COUNTRY && (
            <SelectField
              classnames="w-3xs"
              placeholder="Phone Prefix"
              selectOptions={countries}
              value={selectedCountry?.value || null}
              onChange={(code) => {
                setError(false);
                setPhone("+" + code);
              }}
            />
          )}
          <Field>
            <Input
              value={phone}
              placeholder="Telephone"
              type="text"
              aria-invalid={error}
              onChange={(e) => {
                handlePhoneInput(e.target.value);
              }}
              onBlur={() => setError(phone.length > 0 && !isValid)}
            />
            {error && <p className="text-red-500">Invalid Phone number</p>}
            {isValid && <p className="text-green-600">Valid Phone</p>}
          </Field>
        </div>
      </div>
    </Layout>
  );
};

export default PhoneField;
