'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';


export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);

        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }

        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"></svg>
                Search
            </label>
            <input
                className="peer block w-full rounded-md border py-[9px] pl-10 text-sm placeholder:text-gray-500"
                placeholder={placeholder}
                defaultValue={searchParams.get('query')?.toString()}
                onChange={(e) => {
                    handleSearch(e.target.value);
                }}
            />
            
        </div>
    );
}