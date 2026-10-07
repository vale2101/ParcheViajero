import { useState } from 'react';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { styles } from '../styles/Field.styles';

type Props<T extends FieldValues> = TextInputProps & {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T, Path<T>>;
};

export default function Field<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  style,
  onFocus,
  onBlur: onBlurProp,
  ...input
}: Props<T>) {
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[
              styles.input,
              error ? styles.inputError : focused ? styles.inputFocused : styles.inputIdle,
              style,
            ]}
            value={value}
            onChangeText={onChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur();
              onBlurProp?.(e);
            }}
            autoCapitalize="none"
            placeholderTextColor="#a3a3a3"
            {...input}
          />
          {}
          {!!error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}
