import { ComponentProps } from 'react';
import Markdown from './text-markdown';
import { TextArea } from './ui/textarea';

type MarkdownInputProps = ComponentProps<typeof TextArea> & { mode?: 'edit' | 'preview' };
export default function MarkdownInput({ mode = 'edit', ...props }: MarkdownInputProps) {
    return (
        <>
            <TextArea
                hidden={mode !== 'edit'}
                {...props}
            />
            {mode === 'preview' && <Markdown className={props.className}>{props.value as string}</Markdown>}
        </>
    );
}
