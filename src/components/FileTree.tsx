import React, { useState } from 'react';

export type ActionType = 'create' | 'read' | 'update' | 'delete';

export interface FileTreeProps {
    /** Nome da pasta raiz principal */
    root?: string;
    /** Array de caminhos relativos com ações opcionais. Ex: ["wokwi.toml u", "Empty/Folder/", "..."] */
    files: string[];
    /** Se verdadeiro, envolve a árvore em um elemento <details> para expandir/contrair */
    details?: boolean;
    /** Título do summary quando details for true. Se omitido, usa "Estrutura de arquivos: {root}" ou "Estrutura de arquivos" */
    title?: string;
    /** Define se o details inicia aberto (padrão: false) */
    defaultOpen?: boolean;
}

interface TreeNode {
    name: string;
    relativePath: string;
    isFolder: boolean;
    isEllipsis?: boolean;
    action?: ActionType;
    customLabel?: string;
    children: Record<string, TreeNode>;
}

interface ActionConfig {
    type: ActionType;
    defaultLabel: string;
    bg: string;
    color: string;
    border: string;
}

const ACTION_MAP: Record<string, ActionConfig> = {
    // CREATE
    c: { type: 'create', defaultLabel: 'Criar Aqui', bg: 'var(--ifm-color-info-lightest)', color: 'var(--ifm-color-info-darkest)', border: 'var(--ifm-color-info)' },
    create: { type: 'create', defaultLabel: 'Criar Aqui', bg: 'var(--ifm-color-info-lightest)', color: 'var(--ifm-color-info-darkest)', border: 'var(--ifm-color-info)' },
    crie: { type: 'create', defaultLabel: 'Criar Aqui', bg: 'var(--ifm-color-info-lightest)', color: 'var(--ifm-color-info-darkest)', border: 'var(--ifm-color-info)' },
    add: { type: 'create', defaultLabel: 'Adicionar', bg: 'var(--ifm-color-info-lightest)', color: 'var(--ifm-color-info-darkest)', border: 'var(--ifm-color-info)' },
    adicione: { type: 'create', defaultLabel: 'Adicionar', bg: 'var(--ifm-color-info-lightest)', color: 'var(--ifm-color-info-darkest)', border: 'var(--ifm-color-info)' },

    // READ
    r: { type: 'read', defaultLabel: 'Verificar', bg: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-darkest)', border: 'var(--ifm-color-primary)' },
    read: { type: 'read', defaultLabel: 'Verificar', bg: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-darkest)', border: 'var(--ifm-color-primary)' },
    verify: { type: 'read', defaultLabel: 'Verificar', bg: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-darkest)', border: 'var(--ifm-color-primary)' },
    verifique: { type: 'read', defaultLabel: 'Verificar', bg: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-darkest)', border: 'var(--ifm-color-primary)' },
    leia: { type: 'read', defaultLabel: 'Ler', bg: 'var(--ifm-color-primary-lightest)', color: 'var(--ifm-color-primary-darkest)', border: 'var(--ifm-color-primary)' },

    // UPDATE
    u: { type: 'update', defaultLabel: 'Edite Aqui', bg: 'var(--ifm-color-warning-lightest)', color: 'var(--ifm-color-warning-darkest)', border: 'var(--ifm-color-warning)' },
    update: { type: 'update', defaultLabel: 'Edite Aqui', bg: 'var(--ifm-color-warning-lightest)', color: 'var(--ifm-color-warning-darkest)', border: 'var(--ifm-color-warning)' },
    edit: { type: 'update', defaultLabel: 'Edite Aqui', bg: 'var(--ifm-color-warning-lightest)', color: 'var(--ifm-color-warning-darkest)', border: 'var(--ifm-color-warning)' },
    edite: { type: 'update', defaultLabel: 'Edite Aqui', bg: 'var(--ifm-color-warning-lightest)', color: 'var(--ifm-color-warning-darkest)', border: 'var(--ifm-color-warning)' },

    // DELETE
    d: { type: 'delete', defaultLabel: 'Remover', bg: 'var(--ifm-color-danger-lightest)', color: 'var(--ifm-color-danger-darkest)', border: 'var(--ifm-color-danger)' },
    delete: { type: 'delete', defaultLabel: 'Remover', bg: 'var(--ifm-color-danger-lightest)', color: 'var(--ifm-color-danger-darkest)', border: 'var(--ifm-color-danger)' },
    remove: { type: 'delete', defaultLabel: 'Remover', bg: 'var(--ifm-color-danger-lightest)', color: 'var(--ifm-color-danger-darkest)', border: 'var(--ifm-color-danger)' },
    remover: { type: 'delete', defaultLabel: 'Remover', bg: 'var(--ifm-color-danger-lightest)', color: 'var(--ifm-color-danger-darkest)', border: 'var(--ifm-color-danger)' },
};

function buildTree(paths: string[]): TreeNode {
    const treeRoot: TreeNode = { name: '', relativePath: '', isFolder: true, children: {} };

    paths.forEach((rawPath) => {
        const trimmed = rawPath.trim();
        if (!trimmed) return;

        if (trimmed === '...' || trimmed.startsWith('...')) {
            const key = `ellipsis_${Math.random()}`;
            treeRoot.children[key] = {
                name: '...',
                relativePath: '',
                isFolder: false,
                isEllipsis: true,
                children: {},
            };
            return;
        }

        const parts = trimmed.split(/\s+/);
        const pathPart = parts[0];
        const rawAction = parts[1]?.toLowerCase();
        const isExplicitFolder = pathPart.endsWith('/');

        const segments = pathPart.split('/').filter(Boolean);
        let current = treeRoot;
        let accumulatedPath = '';

        segments.forEach((segment, index) => {
            const isLast = index === segments.length - 1;
            accumulatedPath = accumulatedPath ? `${accumulatedPath}/${segment}` : segment;

            if (!current.children[segment]) {
                current.children[segment] = {
                    name: segment,
                    relativePath: accumulatedPath,
                    isFolder: !isLast || isExplicitFolder,
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

function RenderBranch({ nodes, copiedPath, onCopy }: { nodes: TreeNode[]; copiedPath: string | null; onCopy: (path: string) => void }) {
    return (
        <ul style={{ listStyle: 'none', paddingLeft: '1.2rem', margin: 0 }}>
            {nodes.map((node, index) => {
                const isLast = index === nodes.length - 1;
                const prefix = isLast ? '└── ' : '├── ';
                const actionCfg = node.action ? Object.values(ACTION_MAP).find(a => a.type === node.action) : null;
                const childNodes = Object.values(node.children);
                const isCopied = copiedPath === node.relativePath;

                if (node.isEllipsis) {
                    return (
                        <li key={index} style={{ margin: '0.15rem 0', lineHeight: '1.6rem' }}>
                            <span style={{ color: 'var(--ifm-color-emphasis-500)', fontFamily: 'monospace' }}>
                                {prefix}
                            </span>
                            <span style={{ color: 'var(--ifm-color-emphasis-600)', fontStyle: 'italic' }}>...</span>
                        </li>
                    );
                }

                return (
                    <li key={node.name} style={{ margin: '0.15rem 0', lineHeight: '1.6rem' }}>
                        <span style={{ color: 'var(--ifm-color-emphasis-500)', fontFamily: 'monospace' }}>
                            {prefix}
                        </span>
                        <span style={{ marginRight: '0.35rem' }}>{getIcon(node.name, node.isFolder)}</span>

                        {node.action ? (
                            <span
                                onClick={() => onCopy(node.relativePath)}
                                title={`Clique para copiar caminho: ${node.relativePath}`}
                                style={{
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    color: actionCfg?.color,
                                    textDecoration: 'underline',
                                    textDecorationStyle: 'dotted',
                                    transition: 'opacity 0.2s',
                                }}
                            >
                                {node.name}
                            </span>
                        ) : (
                            <span style={{ fontWeight: 'normal' }}>{node.name}</span>
                        )}

                        {actionCfg && (
                            <span
                                onClick={() => onCopy(node.relativePath)}
                                title={`Clique para copiar caminho: ${node.relativePath}`}
                                style={{
                                    marginLeft: '0.6rem',
                                    padding: '0.1rem 0.45rem',
                                    fontSize: '0.75rem',
                                    borderRadius: '4px',
                                    fontWeight: 'bold',
                                    backgroundColor: isCopied ? 'var(--ifm-color-success-lightest)' : actionCfg.bg,
                                    color: isCopied ? 'var(--ifm-color-success-darkest)' : actionCfg.color,
                                    border: `1px solid ${isCopied ? 'var(--ifm-color-success)' : actionCfg.border}`,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.2rem',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                {isCopied ? '✅ Copiado!' : `👈 ${node.customLabel}`}
                            </span>
                        )}

                        {childNodes.length > 0 && (
                            <RenderBranch nodes={childNodes} copiedPath={copiedPath} onCopy={onCopy} />
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

export default function FileTree({
    root = '',
    files,
    details = false,
    title,
    defaultOpen = false,
}: FileTreeProps): React.JSX.Element {
    const [copiedPath, setCopiedPath] = useState<string | null>(null);
    const treeRoot = buildTree(files);
    const displayNodes = Object.values(treeRoot.children);

    const handleCopy = (path: string) => {
        navigator.clipboard.writeText(path);
        setCopiedPath(path);
        setTimeout(() => setCopiedPath(null), 2000);
    };

    const treeContent = (
        <div style={{
            fontFamily: 'var(--ifm-font-family-monospace)',
            fontSize: '0.9rem',
            marginTop: details ? '0.5rem' : '0',
        }}>
            {root && (
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    📂 {root}/
                </div>
            )}
            <RenderBranch nodes={displayNodes} copiedPath={copiedPath} onCopy={handleCopy} />
        </div>
    );

    if (details) {
        const summaryTitle = title || (root ? `Estrutura de arquivos: ${root}` : 'Estrutura de arquivos');

        return (
            <details
                open={defaultOpen}
                style={{
                    margin: '1rem 0',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--ifm-global-radius)',
                    border: '1px solid var(--ifm-color-emphasis-300)',
                    backgroundColor: 'var(--ifm-background-surface-color)',
                }}
            >
                <summary style={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: 'var(--ifm-color-primary-darker)',
                }}>
                    {summaryTitle}
                </summary>
                {treeContent}
            </details>
        );
    }

    return (
        <div style={{
            margin: '1rem 0',
            padding: '1rem',
            borderRadius: 'var(--ifm-global-radius)',
            border: '1px solid var(--ifm-color-emphasis-300)',
            backgroundColor: 'var(--ifm-background-surface-color)',
        }}>
            {treeContent}
        </div>
    );
}
