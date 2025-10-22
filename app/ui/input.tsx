'use client';

import { useState } from "react";
import Checkmark from "./checkmark";
import Crossmark from "./crossmark";

interface InputProps {
    label: string;
    type: string;
    placeholder?: string;
    defaultValue?: string;
    db_func: (...args: any[]) => any;
    info: object;
    id: string; // id should be required
    className?: string;
}


export default function Input(props: InputProps & { as?: React.ElementType; fieldName?: string }) {
    const {
        as: Component = "input", // default to input, allow override
        label,
        type,
        placeholder,
        defaultValue,
        db_func,
        info,
        id,
        fieldName,
        ...rest
    } = props as any;




    const [isFocused, setIsFocused] = useState(false);
    const [isUpdating, SetUpdate] = useState(false);
    const [runSuccessAnim, setSuccessAnim] = useState(false);
    const [updateFailed, setUpdateFailed] = useState(false);

    function handleUpdating(updateState: boolean) {
        SetUpdate(updateState);
    }

    async function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
        try {
            const term = e.target.value;
            setIsFocused(false);
            handleUpdating(true);
            setUpdateFailed(false);
            // throw new Error("Simulated error"); // Simulate an error for testing
            const fieldToUpdate = fieldName || id;
            await db_func(fieldToUpdate, term, info);
            handleUpdating(false);
            showCheckMark();
        } catch (error) {
            console.error("Error updating input:", error);
            setUpdateFailed(true);
            handleUpdating(false);
            // alert("Failed to update. Please try again.");
        }
    }

    async function showCheckMark() {
        setUpdateFailed(false);
        setSuccessAnim(true);
        setTimeout(() => {
            setSuccessAnim(false);
        }, 3000); // Show for 1 second
    }


    return (
        <div>
            <label className="label" htmlFor={id}>{label}</label>
            <div className="relative flex items-center">


                <Component
                    onBlur={isUpdating ? undefined : handleBlur}
                    onFocus={()=> setIsFocused(true)}
                    type={Component === "input" ? type : undefined}
                    placeholder={placeholder ?? label}
                    defaultValue={defaultValue}
                    id={id}
                    className={`input w-80 ${isUpdating ? 'cursor-not-allowed bg-white text-gray' : ''}`}
                    readOnly={isUpdating}
                    disabled={isUpdating}
                    tabIndex={isUpdating ? -1 : 0}
                    {...rest}
                />
                {isFocused ? (<span className="z-3 absolute right-5 w-4 h-4 loading loading-bars loading-xs"></span>) : ("")}
                {runSuccessAnim ? (<Checkmark />) : ""}
                {updateFailed ? (<Crossmark />) : ""}
                {isUpdating ? (
                    <span className="absolute right-5 w-4 h-4 loading loading-spinner text-gray-400"></span>
                ) : null}
            </div>
        </div>
    );
}
