import type { MasterProfile } from '../types/master-profile';

const profile: MasterProfile = {
  identity: {
    name: 'Santiago Bustos',
    location: 'Córdoba, Argentina',
    headline: 'Full Stack Web Developer',
    email: 'santiagobustos451@gmail.com',
    phone: '+54 3492 322505',
    linkedin: 'https://www.linkedin.com/in/santiago-bustos-3363341b7/',
  },

  experience: [
    {
      type: 'employment',
      organization: 'Universidad Nacional de Rafaela',
      role: 'Full Stack Web Developer',
      startDate: '2021-05',
      endDate: '2024-04',
      description: [
        'Developed and maintained administrative web applications using PHP/Symfony and MySQL.',
        'Designed and consumed REST APIs to enable seamless integration between internal modules.',
        'Integrated legacy internal systems and automated administrative workflows through APIs and custom scripts.',
        'Gathered and analyzed requirements while collaborating directly with end-users.',
        'Designed and maintained relational databases to support application functionality and performance.',
        'Implemented and maintained university system modules on Linux servers, leveraging Docker and PostgreSQL.',
        'Led complete frontend rewrite of the internal resource portal using ReactJS, emphasizing scalability, reusability, and maintainable code.',
        'Provided ongoing technical support for web applications and internal integrations, resolving issues in production environments.',
        'Delivered IT support to technical and non-technical staff, including software installation and configuration of network printers.',
      ],
    },

    {
      type: 'freelance',
      organization: 'Freelance',
      role: 'Web Developer',
      startDate: '2024-04',
      endDate: null,
      description: [
        'Developed responsive web interfaces using ReactJS, JavaScript, TypeScript, and modern CSS practices.',
        'Adapted frontend solutions to integrate with legacy backends and third-party services.',
        'Consumed and integrated REST APIs from external providers and proprietary backends.',
        'Implemented authentication flows, token management, and secure authorization mechanisms such as JWT and OAuth.',
        'Collaborated directly with clients to define technical and functional requirements, ensuring alignment with business goals.',
        'Applied agentic AI development workflows across freelance projects, using local models and API-based AI tools to accelerate implementation, debugging, automation, and technical problem-solving.',
      ],
    },

    {
      type: 'project',
      organization: 'Jan3',
      role: 'Freelance Project — Web Developer',
      startDate: '2025-05',
      endDate: '2025-10',
      description: [
        'Built the frontend for a web application focused on Bitcoin wallet ownership verification and certification, prioritizing secure user experience and intuitive verification processes.',
        'Integrated external services and implemented client-side validation logic to ensure reliable proof-of-possession checks.',
      ],
    },

    {
      type: 'project',
      organization: 'Sismo Games',
      role: 'Unity Videogame Developer',
      startDate: '2025-04',
      endDate: '2025-12',
      description: [
        'Developed a commercial video game using Unity and C#, contributing to core gameplay features.',
        'Implemented game mechanics, state management systems, and interactive logic to create engaging player experiences.',
        'Worked in a structured production environment with defined milestones and deadlines, utilizing Jira for task tracking and project management.',
        'Collaborated closely with design and art teams to integrate assets and ensure cohesive game development.',
      ],
    },

    {
      type: 'teaching',
      organization: 'Universidad Nacional de Rafaela',
      role: 'Professor — Videogame Narrative',
      startDate: '2021-07',
      endDate: '2021-12',
      description: [
        'Provided student guidance, mentoring, and academic support in video game storytelling and narrative design.',
        'Evaluated and graded practical assignments, offering constructive feedback to enhance student projects.',
      ],
    },

    {
      type: 'other',
      organization: 'Lácteos Armando',
      role: 'Packaging Designer',
      startDate: '2020-07',
      endDate: '2020-12',
      description: [
        'Redesigned packaging for the entire product line to better align with the brand logo, modern design trends, and market appeal, improving visual consistency and shelf presence.',
      ],
    },

    {
      type: 'teaching',
      organization: 'Universidad Nacional de Rafaela',
      role: 'Professor — Arduino Course',
      startDate: '2019-03',
      endDate: '2019-11',
      description: [
        'Taught and supported high school students in hands-on Arduino programming, electronics, and prototyping projects.',
      ],
    },

    {
      type: 'internship',
      organization: 'Activa — Event Illumination & LED Screens',
      role: 'Electronics Maintenance Intern',
      startDate: '2018',
      endDate: '2018',
      description: [
        'Performed electronic maintenance and repair of lighting equipment used in live events.',
        'Supported general warehouse maintenance tasks, including polishing structural solder points.',
      ],
    },
  ],

  education: [
    {
      institution: 'Universidad Nacional de Rafaela',
      title: "Bachelor's Degree in Video Game Production and Digital Entertainment",
      status: 'paused',
      startDate: '2019',
      endDate: '2023',
    },
    {
      institution: 'Escuela de Educación Técnico Profesional N° 460 Guillermo Lehmann',
      title: 'Electronic Technician',
      status: 'completed',
      startDate: '2018',
      endDate: '2018',
    },
  ],

  skills: [
    {
      category: 'Web Development',
      items: [
        'REST APIs',
        'External Service Integration',
        'Authentication',
        'JWT',
        'OAuth',
      ],
    },
    {
      category: 'Frontend',
      items: [
        'JavaScript',
        'TypeScript',
        'ReactJS',
        'HTML',
        'CSS',
      ],
    },
    {
      category: 'Backend',
      items: [
        'PHP',
        'Symfony',
        'Apache',
      ],
    },
    {
      category: 'Databases',
      items: [
        'SQL',
        'MySQL',
        'PostgreSQL',
      ],
    },
    {
      category: 'Infrastructure & Tools',
      items: [
        'Linux',
        'Docker',
        'Git',
        'GitHub',
      ],
    },
    {
      category: 'IT & Technical Support',
      items: [
        'Software Installation',
        'Network Printer Configuration',
        'End-user Troubleshooting',
      ],
    },
    {
      category: 'Electronics',
      items: [
        'Electronic Maintenance and Repair',
        'Circuit Soldering',
        'Arduino Prototyping',
      ],
    },
    {
      category: 'AI & Agentic Development',
      items: [
        'Agentic Coding Workflows',
        'Local AI Models',
        'API-based AI Models',
        'Pi',
        'OpenCode',
        'GitHub Copilot',
        'n8n',
        'llama.cpp',
        'LM Studio',
      ],
    },
  ],

  languages: [
    {
      language: 'Spanish',
      level: 'Native',
    },
    {
      language: 'English',
      level: 'C2 (Proficient)',
    },
  ],
};

export { profile };