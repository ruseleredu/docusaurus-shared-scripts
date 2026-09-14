import React from 'react';
// Importa os componentes padrões do Docusaurus
import MDXComponents from '@theme-original/MDXComponents';
// Importa o seu componente customizado
import LabStructure from '@site/src/components/LabStructure';
import LabTable from "@site/src/components/LabTable";
import LabTeamMembers from "@site/src/components/LabTeamMembers";
import LabSubmit from "@site/src/components/LabSubmit";
import LabFromTemplate from "@site/src/components/LabFromTemplate";

export default {
    // Mantém os componentes padrão do MDX
    ...MDXComponents,
    // Registra o componente globalmente
    LabStructure,
    LabTable,
    LabTeamMembers,
    LabSubmit,
    LabFromTemplate,
};
