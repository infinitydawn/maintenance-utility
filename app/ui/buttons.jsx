'use client';
import { showTables, createTable } from "@/lib/actions";

export function  ShowTables (){
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
                const tables = await showTables();
                console.log(tables);
            }}
        >
            Show Tables
        </button>
    );
}


export function CreateTableButton() {
    return (
        <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={async () => {
                const result = await createTable();
                console.log(result);
            }}
        >
            Create Table
        </button>
    );
}