import { NavbarItem } from "@docusaurus/theme-common";

// 1. Import the labData array
// https://gemini.google.com/share/c52111cbf825
// Adjust the path as needed.
const { labData } = require('./src/data/labData');
// OR: import { labData } from './src/data/labData'; 

// 2. Create the Docusaurus-compatible array format
const labDropdownItems = labData.map(lab => ({
    // Docusaurus expects 'label'. We use your 'conteudo' property for the text.
    //label: lab.conteudo,
    label: `${lab.tarefa} - ${lab.conteudo}`,
    // Docusaurus expects 'to' (for internal links). We use your 'hrefi' property.
    to: lab.hrefi,
}));

const { quizData } = require('./src/data/quizData');

// 2. Create the Docusaurus-compatible array format
const quizDropdownItems = quizData.map(quiz => ({
    // Docusaurus expects 'label'. We use your 'descricao' property for the text.
    //label: lab.conteudo,
    label: `${quiz.quiz} - ${quiz.descricao}`,
    // Docusaurus expects 'to' (for internal links). We use your 'hrefi' property.
    to: quiz.hrefi,
}));


const navbarItems: NavbarItem[] = [
    {
        type: "docSidebar",
        //  type: "dropdown",
        sidebarId: "tutorialSidebar",
        position: "left",
        label: "Documentos",
    },
    {
        label: "Infra",
        to: "/infra/intro", // Link to a page in your infra docs
        type: "dropdown",
        position: "left",
        items: [
            {
                to: "/infra/solicitar-inclusao-em-time", // Link to a page in your infra docs
                label: "Solicitar inclusão em um time",
            },
            {
                to: "/infra/repositorio-de-notas", // Link to a page in your infra docs
                label: "Correção automática",
            },
            {
                to: "/infra/teams", // Link to a page in your infra docs
                label: "Grupos/Organizações",
            },
        ],
    },
    {
        to: "/labs/intro", // Link to a page in your API docs
        label: "Laboratórios",
        type: "dropdown",
        position: "left",
        activeBaseRegex: `/labs/`, // Highlight when any API doc is active
        items: [
            ...labDropdownItems,
        ],
    },
    {
        to: "/quiz/intro", // Link to a page in your API docs
        label: "Questionários",
        type: "dropdown",
        position: "left",
        activeBaseRegex: `/quiz/`, // Highlight when any API doc is active
        items: [
            ...quizDropdownItems,
        ],
    },
    {
        label: "Projetos",
        to: "/projects/intro", // Link to a page in your UTFPR docs
        type: "dropdown",
        position: "left",
        items: [
            {
                to: "/projects/2026.2", // Link to a page in your PJTS docs
                label: "Semestre 2026.2",
            },
        ],
    },

    // { to: "/blog", label: "Blog", position: "right" },
    // { href: "https://ruseleredu.github.io/stm32doc/assets/files/CT2026-330805e7bda31ab7e272d3b2b0c96cf3.pdf", label: "Calendário", position: "right" },
    //{ to: "/pdf/CT2026.pdf", label: "Calendário", position: "right", target: '_blank' },
    // { href: "https://www.utfpr.edu.br/alunos/calendario", label: "Calendário", position: "right" },

    {
        href: "https://github.com/ruseleredu/mic-docs/issues",
        label: "Issue",
        position: "right",
    },
    {
        href: "https://moodle.utfpr.edu.br/course/view.php?id=29540",
        label: "Moodle",
        position: "right",
    },
    {
        href: "https://github.com/ELT73A-S22-2026-2",
        label: "GitHub",
        position: "right",
    },
];

export default navbarItems;
