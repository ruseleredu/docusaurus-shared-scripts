import React from 'react';
// Importa os componentes padrões do Docusaurus
import MDXComponents from '@theme-original/MDXComponents';
// Importa o seu componente customizado
import LabTable from "@site/src/components/LabTable";
import LabTeamMembers from "@site/src/components/LabTeamMembers";
import LabSubmit from "@site/src/components/LabSubmit";
import LabFromTemplate from "@site/src/components/LabFromTemplate";
import CommitPoint from "@site/src/components/CommitPoint";
import FileTree from "@site/src/components/FileTree";
import SimpleFileTree from "@site/src/components/SimpleFileTree";

export default {
    // Mantém os componentes padrão do MDX
    ...MDXComponents,
    // Registra o componente globalmente
    LabTable,
    LabTeamMembers,
    LabSubmit,
    LabFromTemplate,
    CommitPoint,
    FileTree,
    SimpleFileTree,
};
