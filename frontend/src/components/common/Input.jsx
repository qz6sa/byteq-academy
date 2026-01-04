import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={`
            absolute right-4 transition-all duration-200 pointer-events-none
            ${
              isFocused || value
                ? 'top-0 text-xs text-primary bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f] to-transparent px-2'
                : 'top-4 text-base text-gray-400'
            }
          `}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Right Icon */}
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`
            input-glass w-full
            ${icon ? 'pr-12' : 'pr-4'}
            ${type === 'password' ? 'pl-12' : 'pl-4'}
            ${error ? 'border-red-500' : 'border-white/10'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          placeholder={!label ? placeholder : ''}
          {...props}
        />

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-1 mr-1">{error}</p>}
    </div>
  );
};

export default Input;
