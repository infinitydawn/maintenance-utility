
import Link from 'next/link'



export default function about() {
    return (
        <div>
            <h1>About Page</h1>
        
            
            <Link href={`/projects/zone_list`}>
                Projects
            </Link>
        </div>

    )
}