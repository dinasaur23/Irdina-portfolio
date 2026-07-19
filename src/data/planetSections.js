export const planetSectionList = [
    {
        id: "about",
        planet: "Earth",
        objectName: "Object_11",
        label: "About me",
        labelOffset: [150, -60],
        cameraDistanceMultiplier: 5,

        number: "01",

        title:
            "Junior frontend developer",

        description:
            "I come from a computer engineering background and have continued developing my skills in web development through both academic projects and practical experience. When building an application, I focus on writing clean, maintainable code that can scale as the project grows.",

        facts: [
            {
                label: "Location",
                value: "Augsburg, Germany",
            },
            {
                label: "Focus",
                value: "Frontend development",
            },
            {
                label: "Education",
                value: "Computer Engineering",
            },
        ],
    },

    {
        id: "projects",
        planet: "Mars",
        objectName: "Object_14",

        label: "Selected works",
        labelOffset: [120, -45],
        cameraDistanceMultiplier: 5,

        number: "02",

        title:
            "Selected Work",

        description:
            "These are the selection of my finished and ongoing works",

        projects: [
            {
                title: "Token Manager",

                description:
                    "A full-stack application for organizing design tokens and reusable design systems.",

                technologies: [
                    "Vue",
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "REST"
                ],

                link: "https://github.com/dinasaur23/Token-man-demo",
            },

            {
                title: "AI Chat Interface",

                description:
                    "A responsive chatbot interface connected to backend APIs.",

                technologies: [
                    "React",
                    "JavaScript",
                    "MUI",
                ],

                link: null,
            },
        ],
    },

    {
        id: "stack",
        planet: "Jupiter",
        objectName: "Object_17",

        label: "Tech stack",
        labelScreenOffset: [300, -40],
        cameraDistanceMultiplier: 4.5,

        number: "03",

        title:
            "The tools I currently work with.",

        description:
            "My toolkit covers frontend development, backend fundamentals, design collaboration and deployment.",

        groups: [
            {
                title: "Frontend",

                items: [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "React",
                    "Vue",
                    "Tailwind CSS",
                    "MUI",
                ],
            },

            {
                title: "Backend",

                items: [
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "REST APIs",
                ],
            },

            {
                title: "Tools",

                items: [
                    "Git",
                    "GitHub",
                    "Figma",
                    "Vite",
                    "Vercel",
                    "WebStorm",
                ],
            },
        ],
    },

    {
        id: "contact",
        planet: "Saturn",
        objectName: "Object_20",

        label: "Contact",
        labelOffset: [330, -70],
        cameraDistanceMultiplier: 5,

        number: "04",

        title:
            "Let's get in touch",

        description:
            "I'm currently open to work and finding new opportunities.",

        links: [
            {
                label: "Email",
                href: "https://mail.google.com/mail/?view=cm&fs=1&to=irdinaismail0423@gmail.com",
            },
            {
                label: "GitHub",
                href: "https://github.com/dinasaur23",
            },
            {
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/irdina-binti-ismail-7661242a0",
            },
        ],
    },
];

export const planetSections =
    Object.fromEntries(
        planetSectionList.map((section) => [
            section.id,
            section,
        ]),
    );

export const journeyStops = [
    {
        id: "overview",
    },

    ...planetSectionList.map((section) => ({
        id: section.id,
    })),
];