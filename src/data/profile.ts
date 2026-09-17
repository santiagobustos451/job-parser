import type MasterProfile from '../types/master-profile';

const profile: MasterProfile = {
  identity: {
    name: 'Elena Vasquez',
    location: 'Austin, TX',
    headline: 'Senior Full-Stack Engineer | Open Source Enthusiast',
    email: 'elena.vasquez@example.com',
    phone: '+1 (555) 012-3456',
    linkedin: 'https://linkedin.com/in/elenavasquez',
  },
  experience: [
    {
      type: 'employment',
      organization: 'Luminar Tech',
      role: 'Senior Full-Stack Engineer',
      startDate: '2021-03',
      endDate: null,
      description: [
        'Led a team of 6 engineers rebuilding the core SaaS dashboard in Next.js and Go, improving page load times by 40%.',
        'Designed and implemented a real-time notification system using WebSockets and Redis pub/sub.',
        'Mentored 3 junior developers through structured code reviews and pair programming sessions.',
      ],
    },
    {
      type: 'freelance',
      organization: 'Various Clients',
      role: 'Contract Frontend Developer',
      startDate: '2019-06',
      endDate: '2021-02',
      description: [
        'Delivered responsive web applications for 8 small-to-mid-size businesses using React and TypeScript.',
        'Built a headless CMS integration for a local nonprofit, enabling non-technical staff to manage content.',
        'Reduced client churn by implementing analytics dashboards that highlighted product usage trends.',
      ],
    },
    {
      type: 'project',
      organization: 'Open Source',
      role: 'Contributor – md-renderer',
      startDate: '2022-01',
      endDate: null,
      description: [
        'Author of a lightweight markdown-to-HTML renderer with plugin support for syntax highlighting and math.',
        'Maintained 200+ GitHub issues and PRs; grew community from 5 to 45 active contributors.',
      ],
    },
  ],
  education: [
    {
      institution: 'University of Texas at Austin',
      title: 'Bachelor of Science in Computer Science',
      status: 'completed',
      startDate: '2015-08',
      endDate: '2019-05',
    },
    {
      institution: 'Online – Frontend Masters',
      title: 'Advanced React Patterns & Performance',
      status: 'completed',
      startDate: '2020-01',
      endDate: '2020-06',
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'SQL'],
    },
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Redux'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Express', 'PostgreSQL', 'Redis', 'GraphQL'],
    },
    {
      category: 'DevOps & Tools',
      items: [
        'Docker',
        'GitHub Actions',
        'AWS (EC2, S3, Lambda)',
        'Vercel',
        'Git',
      ],
    },
  ],
  languages: [
    { language: 'English', level: 'Native' },
    { language: 'Spanish', level: 'Fluent' },
  ],
};

export default profile;
