import { ComponentProps } from 'react';
import Markdown from './text-markdown';
import { TextArea } from './ui/textarea';

type MarkdownInputProps = ComponentProps<typeof TextArea> & { mode: 'edit' | 'preview' };
export default function MarkdownInput({ mode, ...props }: MarkdownInputProps) {
    return (
        <>
            {mode === 'edit' && <TextArea {...props} />}
            {mode === 'preview' && <Markdown>{props.value as string}</Markdown>}
        </>
    );
}
