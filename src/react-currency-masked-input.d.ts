declare module "react-currency-masked-input" {
  import { ComponentType } from "react";

  interface CurrencyMaskedInputProps {
    onChange: (e, value: string) => void;
    disabled?: boolean;
    value?: string;
    className: string;
    prefix?: string;
    placeholder?: string;
  }

  const CurrencyMaskedInput: ComponentType<CurrencyMaskedInputProps>;

  export default CurrencyMaskedInput;
}
