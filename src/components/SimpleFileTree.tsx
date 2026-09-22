import React, { useMemo } from 'react';
import ThemeCodeBlock from '@theme/CodeBlock';

export interface SimpleFileTreeProps {
    title?: string;
    root?: string;
    files: string[];
    defaultOpen?: boolean;
    details?: boolean;
}

// Mapeamento das letras de atalho para os textos de CRUD
const CRUD_MAP: Record<string, string> = {
    c: '# Criar',
    r: '# Ler',
    u: '# Editar',
    d: '# Deletar',
    p: '# (Professor)',
    n: '# (Notas)',
};

interface TreeNode {
    name: string;
    action?: string;
    children: Record<string, TreeNode>;
}

// Converte a lista de caminhos em estrutura de árvore ASCII
function generateAsciiTree(files: string[], rootName?: string): string[] {
    const root: TreeNode = { name: 'root', children: {} };

    files.forEach((pathItem) => {
        const trimmed = pathItem.trim();
        if (!trimmed) return;

        const parts = trimmed.split(/\s+/);
        const pathPart = parts[0];
        const actionKey = parts.length > 1 ? parts[1].toLowerCase() : undefined;

        const segments = pathPart.split('/').filter(Boolean);
        let current = root;

        segments.forEach((seg, index) => {
            const isLast = index === segments.length - 1;
            if (!current.children[seg]) {
                current.children[seg] = {
                    name: seg,
                    children: {},
                };
            }
            if (isLast && actionKey) {
                current.children[seg].action = CRUD_MAP[actionKey] || `<- ${actionKey.toUpperCase()}`;
            }
            current = current.children[seg];
        });
    });

    const lines: string[] = [];

    if (rootName) {
        lines.push(rootName);
    }

    function renderNodes(nodesObj: Record<string, TreeNode>, prefix: string = '') {
        const keys = Object.keys(nodesObj);
        keys.forEach((key, index) => {
            const node = nodesObj[key];
            const isLast = index === keys.length - 1;

            const connector = isLast ? '└── ' : '├── ';
            const actionText = node.action ? `  ${node.action}` : '';

            lines.push(`${prefix}${connector}${node.name}${actionText}`);

            const childPrefix = prefix + (isLast ? '    ' : '│   ');
            renderNodes(node.children, childPrefix);
        });
    }

    renderNodes(root.children, '');

    return lines;
}

export default function SimpleFileTree({
    title,
    root,
    files = [],
    details = false,
    defaultOpen = true,
}: SimpleFileTreeProps): React.ReactNode {
    const treeText = useMemo(() => generateAsciiTree(files, root).join('\n'), [files, root]);

    const content = (
        <ThemeCodeBlock language="txt">
            {treeText}
        </ThemeCodeBlock>
    );

    if (details) {
        return (
            <details open={defaultOpen} style={{ marginBottom: '1rem' }}>
                {title && <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>{title}</summary>}
                {content}
            </details>
        );
    }

    return (
        <div style={{ marginBottom: '1rem' }}>
            {title && <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{title}</div>}
            {content}
        </div>
    );
}