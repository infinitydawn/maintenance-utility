'use client';
import React, { useEffect, useState, useRef } from 'react';

interface Field {
    label: string;
    type: string;
    placeholder?: string;
    defaultValue?: string;
    id: string;
}

interface CreateModalProps {
    title: string;
    fields: Field[];
    info?: Record<string, any>;
    open: boolean;
    onClose: () => void;
    onCreate: (payload: Record<string, any>) => Promise<any>;
}

export default function CreateModal(props: CreateModalProps) {
    const { title, fields, open, onClose, onCreate, info = {} } = props;

    const initialValues = Object.fromEntries(fields.map((f) => [f.id, f.defaultValue || '']));
    const [values, setValues] = useState<Record<string, any>>(initialValues);
    const [loading, setLoading] = useState(false);

    const modalBoxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (open) {
            setValues(initialValues);
            // Focus the dialog container for accessibility without focusing the first input
            // This prevents mobile browsers from auto-zooming when an input is immediately focused.
            setTimeout(() => modalBoxRef.current?.focus(), 0);
        }
    }, [open]);

    const handleChange = (id: string, value: string) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleCreate = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        try {
            setLoading(true);
            const payload = { ...values, ...info };
            await onCreate(payload);
            setLoading(false);
            onClose();
        } catch (err) {
            setLoading(false);
            console.error('Create failed', err);
            alert('Create failed: ' + String(err));
        }
    };

    if (!open) return null;

    return (
        <div className="modal modal-open">
            <div ref={modalBoxRef} tabIndex={-1} className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">{title}</h3>
                <form onSubmit={handleCreate}>
                    {fields.map((field) => (
                        <div key={field.id} className="mb-4">
                            {!!field.label && (
                                <label className="label" htmlFor={field.id}>
                                    {field.label}
                                </label>
                            )}
                            <input
                                id={field.id}
                                type={field.type}
                                className="input"
                                placeholder={field.placeholder || field.label}
                                value={values[field.id]}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                            />
                        </div>
                    ))}

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose} disabled={loading}>
                            Close
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
