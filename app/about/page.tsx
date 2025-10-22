import Link from 'next/link'

export const metadata = {
    title: 'About — Maintenance Utility',
    description: 'Information about the Maintenance Utility application',
};

export default function About() {
    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">About Maintenance Utility</h1>
            <p className="mb-4 text-gray-700">This application helps manage buildings, systems, nodes, loops and zones.</p>
            <p className="mb-4 text-gray-700">Use the navigation to explore buildings and projects.</p>
            <Link href="/buildings/zone_list" className="text-blue-600 hover:underline">View Projects</Link>
        </div>
    )
}