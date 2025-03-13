import { ChangeEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps {
  text?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

function Input(props: InputProps) {
  return (
    <input
      className={twMerge(
        'bg-secondary rounded-full px-3 text-sm xs:text-base xs:px-6',
        props.className
      )}
      placeholder={props.placeholder}
      value={props.text}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
}

export default Input;
