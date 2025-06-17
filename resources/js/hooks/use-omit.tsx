import { useCallback } from 'react';

export function useOmit() {
    return useCallback(<T, K extends keyof T>(value: T, keys: K[]): Omit<T, K> => {
        var clone = structuredClone(value);

        keys.forEach((key) => {
            delete clone[key];
        });

        return clone;
    }, []);
}
