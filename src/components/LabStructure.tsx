import React, { useState } from 'react';

interface LabStructureProps {
    /** Número do laboratório, ex: "00", "01", "1" */
    lab: string | number;
    /** Nome da organização no GitHub (Opcional, padrão: ELT73A-S22-2026-2) */
    org?: string;
    /** Título customizado para o summary (Opcional) */
    title?: string;
}

export default function LabStructure({
    lab,
    org = 'ELT73A-S22-2026-2',
    title,
}: LabStructureProps): React.JSX.Element {
    // Normaliza a string do lab para garantir dois dígitos minúsculos (ex: "00", "01")
    const labFormatted = String(lab).padStart(2, '0').toLowerCase();
    const labUpper = labFormatted.toUpperCase();

    const searchUrl = `https://github.com/orgs/${org}/repositories?q=lab${labFormatted}`;
    const defaultTitle = `Estrutura do LAB${labFormatted}`;

    return (
        <details style={{
            margin: '1rem 0',
            padding: '0.75rem 1rem',
            border: '1px solid var(--ifm-color-emphasis-300)',
            borderRadius: 'var(--ifm-global-radius)',
            backgroundColor: 'var(--ifm-background-surface-color)'
        }}>
            <summary style={{
                fontWeight: 'bold',
                cursor: 'pointer',
                color: 'var(--ifm-color-primary-darker)'
            }}>
                {title || defaultTitle}
            </summary>

            <div style={{ marginTop: '0.75rem' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                    • <a href={searchUrl} target="_blank" rel="noopener noreferrer">
                        {org}:LAB{labFormatted}
                    </a>
                </p>

                <pre>
                    <code>{`Organização: ${org}
│
├── Times
│   ├── Grupo-A
│   ├── ...
│   ├── Grupo-P (Professor)
│   └── Grupo-N (Notas)
│
└── Repositórios
    ├── lab${labFormatted}-template
    ├── lab${labFormatted}-grupo-a
    ├── ...
    ├── lab${labFormatted}-grupo-p (Professor)
    └── lab${labFormatted}-grupo-n (Notas)`}</code>
                </pre>
            </div>
        </details>
    );
}
