type ClassValue = false | null | undefined | string | ClassValue[];

export function cn(...values: ClassValue[]) {
  const classes: string[] = [];

  const collect = (value: ClassValue) => {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }

    classes.push(value);
  };

  values.forEach(collect);
  return classes.join(' ');
}
