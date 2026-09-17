import type { TargetProfile } from '../types/target-profile';

const targets: TargetProfile[] = [
  {
    id: 'fullstack',
    name: 'Senior Full-Stack Engineer — Remote-First SaaS',
    searchTerms: [
      'full-stack engineer',
      'senior developer',
      'software engineer',
    ],
    requiredKeywords: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS'],
    preferredKeywords: [
      'Next.js',
      'GraphQL',
      'Docker',
      'CI/CD',
      'microservices',
    ],
    excludedKeywords: ['PHP', 'Ruby on Rails', 'WordPress'],
    remoteOnly: true,
  },
  {
    id: 'staff',
    name: 'Staff Engineer — FinTech',
    searchTerms: ['staff engineer', 'principal engineer', 'tech lead'],
    requiredKeywords: ['TypeScript', 'Go', 'distributed systems', 'Kubernetes'],
    preferredKeywords: ['gRPC', 'event sourcing', 'Kafka', 'Terraform'],
    excludedKeywords: ['angular', 'jquery', 'legacy'],
    locations: ['Austin, TX', 'Remote'],
  },
  {
    id: 'frontend',
    name: 'Lead Frontend Engineer — HealthTech Startup',
    searchTerms: ['lead frontend', 'frontend lead', 'engineering manager'],
    requiredKeywords: [
      'React',
      'TypeScript',
      'performance optimization',
      'testing',
    ],
    preferredKeywords: [
      'Next.js',
      'Tailwind CSS',
      'Storybook',
      'accessibility',
      'a11y',
    ],
    excludedKeywords: ['backend', 'devops', 'database'],
    remoteOnly: false,
  },
  {
    id: 'fullstack-oss',
    name: 'Full-Stack Developer — Open Source Foundation',
    searchTerms: ['full-stack developer', 'open source', 'contributor'],
    requiredKeywords: ['TypeScript', 'JavaScript', 'Git', 'REST APIs'],
    preferredKeywords: ['Vue.js', 'Python', 'Docker', 'Linux', 'documentation'],
    excludedKeywords: ['Swift', 'mobile', 'iOS'],
    remoteOnly: true,
  },
  {
    id: 'engineer-ecommerce',
    name: 'Senior Software Engineer — E-Commerce Platform',
    searchTerms: ['senior software engineer', 'e-commerce', 'platform'],
    requiredKeywords: [
      'React',
      'Node.js',
      'SQL',
      'payment systems',
      'scalability',
    ],
    preferredKeywords: [
      'Redis',
      'Elasticsearch',
      'microservices',
      'Stripe',
      'Shopify',
    ],
    excludedKeywords: ['Ruby', 'Perl', 'Cobol'],
    locations: ['Austin, TX', 'San Francisco, CA', 'Remote'],
  },
];

export default targets;
