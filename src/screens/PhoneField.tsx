import Layout from "@/components/Layout";
import SelectField from "@/components/SelectField";
import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import * as countryCodes from "country-codes-list";
import { useState } from "react";

const countries = countryCodes.customArray(
  {
    label: "{flag} +{countryCallingCode} {countryNameEn}",
    name: "{countryNameEn}",
    countryCode: "{countryCodeNumeric}",
    value: "{countryCallingCode}",
  },
  { sortBy: "name" },
);

const FIELD_MODE = {
  INPUT: "INPUT",
  COUNTRY: "COUNTRY",
} as const;

const PhoneField = () => {
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [mode, setMode] = useState<
    (typeof FIELD_MODE)[keyof typeof FIELD_MODE]
  >(FIELD_MODE.INPUT);
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  const handlPhoneInput = (val: string) => {
    setPhone(val);
  };

  const getPhoneLength = () => {};

  const validatePhone = () => {};

  return (
    <Layout
      brief="https://www.reactchallenges.com/challenges/phone-number-field"
      title="Custom phone field"
      description={
        <>
          Using{" "}
          <a
            href="https://github.com/Synergy-Shock/country-codes-list"
            target="_blank"
          >
            country-codes-list
          </a>{" "}
          npm dependency to handle generating phone codes, phone number lengths
          . Did investigate an{" "}
          <a href="https://restcountries.com/" target="_blank">
            open source REST api version
          </a>{" "}
          but does not seem to support getting full list.
        </>
      }
    >
      <div className="max-w-3xl mx-auto flex flex-col items-start justify-start gap-y-3">
        <p>mode {JSON.stringify(mode)}</p>
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
              value={countryCode}
              onChange={(val) => {
                setCountryCode(val);
              }}
            />
          )}
          <Field>
            <Input
              value={phone}
              placeholder="Telephone"
              aria-invalid={!!error}
              onChange={(e) => {
                if (!e.target.value.trim().length) {
                  return;
                }
                handlPhoneInput(e.target.value);
              }}
              onBlur={() => {
                validatePhone();
              }}
            />
            <FieldDescription>
              Phone number will validate on blur
            </FieldDescription>
            {error && <FieldError>{error}</FieldError>}
          </Field>
        </div>
      </div>
    </Layout>
  );
};

export default PhoneField;
