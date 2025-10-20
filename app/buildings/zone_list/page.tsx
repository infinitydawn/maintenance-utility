
import Link from 'next/link'
import Zone from '@/app/ui/zone'

let array = [
    { "id": 1, "zone": 1, "floor": "1FL", "location": "Electric Rm" },
    { "id": 2, "zone": 2, "floor": "2FL", "location": "HWH Rm" },
    { "id": 3, "zone": 3, "floor": "3FL", "location": "IT Rm" },
]

export default function zone_list() {
    return (
        <div>
            <h3 className="text-3xl font-bold underline">Zone List Page</h3>

            <div>
                {array.map(elem => {
                    return <Zone key={elem.id} zone={elem.zone} floor={elem.floor} location={elem.location}  />
                    // return (<a>{elem.location}</a>)
                })}
            </div>

            <Link href={`/about`}>
                About
            </Link>

            


        </div>

    )
}