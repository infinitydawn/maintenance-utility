'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Search({ placeholder, debounce = 300 }: { placeholder: string; debounce?: number }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    // local controlled value so we can debounce updates to the URL
    const [value, setValue] = useState(() => searchParams.get('query') ?? '');
    const timeoutRef = useRef<number | null>(null);

    // keep local value in sync if the URL changes externally
    useEffect(() => {
        setValue(searchParams.get('query') ?? '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.toString?.()]);

    useEffect(() => {
        // clear previous timer
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

        // set new debounce timer
        timeoutRef.current = window.setTimeout(() => {
            const params = new URLSearchParams(searchParams as any);
            if (value) params.set('query', value);
            else params.delete('query');
            replace(`${pathname}?${params.toString()}`);
        }, debounce) as unknown as number;

        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
        // intentionally include `value` and `debounce` only; `searchParams` and `pathname` are stable for this component
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, debounce]);

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>
                Search
            </label>
            <input
                id="search"
                className="peer block w-full rounded-md border py-[9px] pl-10 text-sm placeholder:text-gray-500"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}