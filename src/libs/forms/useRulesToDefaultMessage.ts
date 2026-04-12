import { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { useIntl } from 'react-intl';

export function useRulesToDefaultMessage<T extends FieldValues>(options?: RegisterOptions<T, Path<T>>) {
  const intl = useIntl();

  const maxLength =
    typeof options?.maxLength === 'number'
      ? {
          maxLength: {
            value: options.maxLength,
            message: intl.formatMessage({ id: 'forms.maxLengthError' }, { number: options.maxLength }),
          },
        }
      : {};
  const minLength =
    typeof options?.minLength === 'number'
      ? {
          minLength: {
            value: options.minLength,
            message: intl.formatMessage({ id: 'forms.minLengthError' }, { number: options.minLength }),
          },
        }
      : {};

  return {
    ...options,
    ...maxLength,
    ...minLength,
  };
}
