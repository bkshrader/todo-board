import { Trash } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

type DestroyButtonProps = React.ComponentProps<typeof Button>;
// TODO add support for a confirm message
export default function DestroyButton({ variant, onClick, onBlur, children, ...props }: DestroyButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        // Set button to confirm state if it is not already
        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }

        onClick?.(e);
    };

    const handleBlur: React.FocusEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        setShowConfirm(false);

        onBlur?.(e);
    };

    return (
        <Button
            data-confirm={showConfirm}
            variant={showConfirm ? 'destructive' : variant}
            onClick={handleClick}
            onBlur={handleBlur}
            {...props}
        >
            {children ?? <Trash />}
        </Button>
    );
}
