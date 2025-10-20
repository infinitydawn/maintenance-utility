'use client';
import React, { useState } from "react";


interface Field {
    label: string;
    type: string;
    placeholder?: string;
    defaultValue?: string;
    id: string; // id should be required
}

interface CreateModalProps {
    title: string;
    db_func: (...args: any[]) => any;
    fields: Field[];
    info: object
}

export default function CreateModal(props: CreateModalProps) {
    const { title } = props;
    const { db_func } = props;
    const fields = props.fields || [{
        label: "No fields provided",
        type: "text",
        placeholder: "No fields provided",
        defaultValue: "No fields provided",
        id: "no-fields"
    }];

    // Initialize state for field values
    const [values, setValues] = useState<{ [key: string]: string }>(
        Object.fromEntries(fields.map(f => [f.id, f.defaultValue || ""]))
    );

    // Handle input change
    const handleChange = (id: string, value: string) => {
        setValues(prev => ({ ...prev, [id]: value }));
    };

    // Handle create button click
    const handleCreate = async (e: React.MouseEvent) => {

        try {
            e.preventDefault();

            console.log({ ...values, ...props.info }); // Log the values to the console

            // Call the database function with the values
            let res = await db_func({ ...values, ...props.info });

            alert("Created successfully!");

            console.log(res)

            const message = Object.entries(values)
                .map(([id, value]) => `${id}: ${value}`)
                .join('\n');
            // alert(message);

            //close modal and reload page
            const modal = document.getElementById('my_modal_4') as HTMLDialogElement;
            setValues(Object.fromEntries(fields.map(f => [f.id, f.defaultValue || ""])));
            modal.close();
            window.location.reload();
        }
        catch (error) {
            console.error("Error creating entry:", error);
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            alert("Failed to create entry. Please try again. " + errorMessage);
        }
    };

    return (
        <div>
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg">{title}</h3>
                    {fields.map((field) => (
                        <div key={field.id} className="mb-4">
                            <label className="label" htmlFor={field.id}>{field.label}</label>
                            <input
                                type={field.type}
                                className="input"
                                placeholder={field.placeholder || field.label}
                                id={field.id}
                                value={values[field.id]}
                                onChange={e => handleChange(field.id, e.target.value)}
                            />
                        </div>
                    ))}
                    <div className="modal-action">
                        <form method="dialog" className="flex items-center ">
                            <button className="btn">Close</button>
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={handleCreate}
                            >
                                Create
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
