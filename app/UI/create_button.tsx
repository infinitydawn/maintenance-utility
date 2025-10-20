'use client';
interface CreateButtonProps {
    btnName: string;
}

export default function CreateButton(props: CreateButtonProps) {
    const { btnName } = props;
    return (
        <button className="btn btn-primary fixed bottom-3 right-3 z-10" onClick={()=>(document!.getElementById('my_modal_4') as HTMLDialogElement).showModal()}>{btnName}</button>
    );
}