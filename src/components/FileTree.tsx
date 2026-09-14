import React from 'react';

export type ActionType = 'edit' | 'add' | 'remove' | 'create';

export interface FileTreeProps {
    /** Nome da pasta raiz principal */
    root?: string;
    /** Array de caminhos relativos com ações opcionais. Ex: ["wokwi.toml edite", ".github/workflows/grade.yml remove"] */
    files: string[];
}

interface TreeNode {
    name: string;
    isFolder: boolean;
    action?: ActionType;
    customLabel?: string;
    children: Record<string, TreeNode>;
}

const ACTION_MAP: Record<string, { type: ActionType; defaultLabel: string; bg: string; color: string; border: string }> = {
    edite: { type: 'edit', defaultLabel: 'Edite Aqui', bg: 'var(--ifm-color-warning-lightest)', color: 'var(--ifm-color-warning-darkest)', border: 'var(--ifm-color-warning)' },
    edit: { type: 'edit', defaultLabel: 'Edite Aqui', bg: 'var(--ifm-color-warning-lightest)', color: 'var(--ifm-color-warning-darkest)', border: 'var(--ifm-color-warning)' },
    adicione: { type: 'add', defaultLabel: 'Adicionar', bg: 'var(--ifm-color-success-lightest)', color: 'var(--ifm-color-success-darkest)', border: 'var(--ifm-color-success)' },
    add: { type: 'add', defaultLabel: 'Adicionar', bg: 'var(--ifm-color-success-lightest)', color: 'var(--ifm-color-success-darkest)', border: 'var(--ifm-color-success)' },
    crie: { type: 'create', defaultLabel: 'Criar Aqui', bg: 'var(--ifm-color-info-lightest)', color: 'var(--ifm-color-info-darkest)', border: 'var(--ifm-color-info)' },
    create: { type: 'create', defaultLabel: 'Criar Aqui', bg: 'var(--ifm-color-info-lightest)', color: 'var(--ifm-color-info-darkest)', border: 'var(--ifm-color-info)' },
    remove: { type: 'remove', defaultLabel: 'Remover', bg: 'var(--ifm-color-danger-lightest)', color: 'var(--ifm-color-danger-darkest)', border: 'var(--ifm-color-danger)' },
    remover: { type: 'remove', defaultLabel: 'Remover', bg: 'var(--ifm-color-danger-lightest)', color: 'var(--ifm-color-danger-darkest)', border: 'var(--ifm-color-danger)' },
};

function buildTree(paths: string[]): TreeNode {
    const treeRoot: TreeNode = { name: '', isFolder: true, children: {} };

    paths.forEach((rawPath) => {
        const trimmed = rawPath.trim();
        if (!trimmed) return;

        const parts = trimmed.split(/\s+/);
        const pathPart = parts[0];
        const rawAction = parts[1]?.toLowerCase();

        const segments = pathPart.split('/').filter(Boolean);
        let current = treeRoot;

        segments.forEach((segment, index) => {
            const isLast = index === segments.length - 1;

            if (!current.children[segment]) {
                current.children[segment] = {
                    name: segment,
                    isFolder: !isLast,
                    children: {},
                };
            }

            if (isLast) {
                if (rawAction && ACTION_MAP[rawAction]) {
                    current.children[segment].action = ACTION_MAP[rawAction].type;
                    current.children[segment].customLabel = ACTION_MAP[rawAction].defaultLabel;
                }
            }

            current = current.children[segment];
        });
    });

    return treeRoot;
}

const getIcon = (name: string, isFolder: boolean) => {
    if (isFolder) return '📁';
    if (name.endsWith('.md')) return '📝';
    if (name.endsWith('.yml') || name.endsWith('.yaml')) return '🚀';
    if (name.endsWith('.json') || name.endsWith('.toml') || name.endsWith('.ini')) return '🔧';
    return '📄';
};

function RenderBranch({ nodes }: { nodes: TreeNode[] }) {
    return (
        <ul style={{ listStyle: 'none', paddingLeft: '1.2rem', margin: 0 }}>
            {nodes.map((node, index) => {
                const isLast = index === nodes.length - 1;
                const prefix = isLast ? '└── ' : '├── ';
                const actionCfg = node.action ? Object.values(ACTION_MAP).find(a => a.type === node.action) : null;
                const childNodes = Object.values(node.children);

                return (
                    <li key={node.name} style={{ margin: '0.15rem 0', lineHeight: '1.6rem' }}>
                        <span style={{ color: 'var(--ifm-color-emphasis-500)', fontFamily: 'monospace' }}>
                            {prefix}
                        </span>
                        <span style={{ marginRight: '0.35rem' }}>{getIcon(node.name, node.isFolder)}</span>
                        <span style={{
                            fontWeight: node.action ? 'bold' : 'normal',
                            color: node.action ? actionCfg?.color : 'inherit'
                        }}>
                            {node.name}
                        </span>

                        {actionCfg && (
                            <span style={{
                                marginLeft: '0.6rem',
                                padding: '0.1rem 0.45rem',
                                fontSize: '0.75rem',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                backgroundColor: actionCfg.bg,
                                color: actionCfg.color,
                                border: `1px solid ${actionCfg.border}`,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem'
                            }}>
                                👈 {node.customLabel}
                            </span>
                        )}

                        {childNodes.length > 0 && <RenderBranch nodes={childNodes} />}
                    </li>
                );
            })}
        </ul>
    );
}

export default function FileTree({ root, files }: FileTreeProps): React.JSX.Element {
    const treeRoot = buildTree(files);
    const displayNodes = Object.values(treeRoot.children);

    return (
        <div style={{
            margin: '1rem 0',
            padding: '1rem',
            borderRadius: 'var(--ifm-global-radius)',
            border: '1px solid var(--ifm-color-emphasis-300)',
            backgroundColor: 'var(--ifm-background-surface-color)',
            fontFamily: 'var(--ifm-font-family-monospace)',
            fontSize: '0.9rem'
        }}>
            {root && (
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    📂 {root}/
                </div>
            )}
            <RenderBranch nodes={displayNodes} />
        </div>
    );
}
