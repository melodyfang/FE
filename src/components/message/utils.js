export const isArray = Array.isArray;
export const isString = val => typeof val === 'string';
export const isSymbol = val => typeof val === 'symbol';
export const isObject = val => val !== null && typeof val === 'object';

export function classNames(...args) {
  const classes = [];
  for (let i = 0; i < args.length; i++) {
    const value = args[i];
    if (!value) continue;
    if (isString(value)) {
      classes.push(value);
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const inner = classNames(value[i]);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (isObject(value)) {
      for (const name in value) {
        if (value[name]) {
          classes.push(name);
        }
      }
    }
  }
  return classes.join(' ');
}
