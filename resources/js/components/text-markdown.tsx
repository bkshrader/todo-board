import { cn } from '@/lib/utils';
import { ComponentProps, HTMLAttributes } from 'react';
import PrimitiveMarkdown from 'react-markdown';

type MarkdownProps = ComponentProps<typeof PrimitiveMarkdown> & HTMLAttributes<HTMLParagraphElement>;
export default function Markdown({ className, children, ...props }: MarkdownProps) {
    // Since we don't have easy control over the generated component from PrimitiveMarkdown,
    // we need to add default styling for certain components. For now, we can just use
    // tailwind typography for this styling. Will likely want to adapt a more custom solution later.
    const mergedClass = cn('prose prose-sm dark:prose-invert prose-li:my-0.5', className);
    return (
        <>
            <p className={mergedClass}>
                <PrimitiveMarkdown {...props}>{children}</PrimitiveMarkdown>
            </p>
        </>
    );
}
