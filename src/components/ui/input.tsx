import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, TextInput, type TextInputProps, View } from 'react-native';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { Text } from './text';

const Input = React.forwardRef<TextInput, TextInputProps>(({ className, ...props }, ref) => {
  return (
    <TextInput
      ref={ref}
      className={cn(
        'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
        props.editable === false &&
          cn(
            'opacity-50',
            Platform.select({
              web: 'disabled:pointer-events-none disabled:cursor-not-allowed',
            })
          ),
        Platform.select({
          web: cn(
            'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
          ),
          native: 'placeholder:text-muted-foreground/50',
        }),
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

type ControlledInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = TextInputProps & {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  error?: string;
  containerClassName?: string;
  inputRef?: React.Ref<TextInput>;
};

function ControlledInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  error,
  containerClassName,
  inputRef,
  ...props
}: ControlledInputProps<TFieldValues, TName>) {
  return (
    <View className={cn('gap-1.5', containerClassName)}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            {...props}
            ref={inputRef}
            value={value == null ? '' : String(value)}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {error ? <Text className="text-destructive text-sm">{error}</Text> : null}
    </View>
  );
}

export { ControlledInput, Input };