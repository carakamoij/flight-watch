import { useState, useEffect } from "react";

/**
 * useLocalStorage hook
 * Usage: const [value, setValue] = useLocalStorage<T>("key", initialValue);
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === "undefined") return initialValue;
		try {
			const item = window.localStorage.getItem(key);
			return item ? (JSON.parse(item) as T) : initialValue;
		} catch {
			return initialValue;
		}
	});

	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			window.localStorage.setItem(key, JSON.stringify(storedValue));
		} catch {
			// Ignore write errors
		}
	}, [key, storedValue]);

	return [storedValue, setStoredValue] as const;
}
