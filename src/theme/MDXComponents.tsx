import React from 'react';
// Importa os componentes padrões do Docusaurus
import MDXComponents from '@theme-original/MDXComponents';
// Importa o seu componente customizado
import LabStructure from '@site/src/components/LabStructure';

export default {
    // Mantém os componentes padrão do MDX
    ...MDXComponents,
    // Registra o componente globalmente
    LabStructure,
};
