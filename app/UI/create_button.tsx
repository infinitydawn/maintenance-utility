'use client';
interface CreateButtonProps {
    btnName: string;
    onClick?: () => void;
}

export default function CreateButton(props: CreateButtonProps) {
    const { btnName, onClick } = props;
    return (
        <button className="btn btn-primary fixed bottom-3 right-3 z-10" onClick={onClick}>{btnName}</button>
    );
}