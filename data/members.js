export const members = [
  {
    slug: 'md-mahamudul-hasan',
    name: 'Md Mahamudul Hasan',
    id: '0112330182',
    email: 'mhasan2330182@bscse.uiu.ac.bd',
    phone: 'Not provided',
    gender: 'Male',
    department: 'Department of Computer Science & Engineering',
    institution: 'United International University',
    role: 'Technical Lead / Developer',
    shortRole: 'Technical Lead',
    tagline: 'Building the system behind the idea.',
    initials: 'MH',
    image: '/members/md-mahamudul-hasan.jpg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    about: 'Responsible for the technical direction of the FYDP, including system architecture design, frontend & backend implementation, database modeling, and deployment pipelines.',
    responsibilities: [
      'System architecture and technical roadmap planning',
      'Frontend & backend development with Next.js & React',
      'Database integration, API modeling and state management',
      'Production deployment and performance optimization'
    ],
    skills: ['System Architecture', 'Next.js / React', 'Node.js', 'Database Design', 'Deployment'],
    focus: [['Technical Planning', 85], ['System Development', 80], ['API & Database', 72]]
  },
  {
    slug: 'md-sabbir-hossen',
    name: 'Md Sabbir Hossen',
    id: '0112331026',
    email: 'mhossen2331026@bscse.uiu.ac.bd',
    phone: 'Not provided',
    gender: 'Male',
    department: 'Department of Computer Science & Engineering',
    institution: 'United International University',
    role: 'Faculty Communicator',
    shortRole: 'Faculty Communicator',
    tagline: 'Bridging team progress with supervisor consultations and presentation delivery.',
    initials: 'SH',
    image: '/members/md-sabbir-hossen.jpg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    about: 'Serves as the primary point of contact for supervisor and faculty consultations, coordinating milestone reviews, feedback implementation, and leading project defense presentations.',
    responsibilities: [
      'Faculty and supervisor communications, meeting scheduling, and agenda alignment',
      'Milestone review documentation and supervisor feedback tracking',
      'English presentation delivery, viva defense preparation, and team rehearsals',
      'Demo storytelling, slide design, and defense Q&A coordination'
    ],
    skills: ['Faculty Communication', 'Supervisor Consultation', 'Presentation Delivery', 'English Communication', 'Defense Q&A'],
    focus: [['Faculty Communication', 88], ['Supervisor Review', 82], ['Presentation & Viva', 80]]
  },
  {
    slug: 'tania-islam',
    name: 'Tania Islam',
    id: '0112331025',
    email: 'tislam2331025@bscse.uiu.ac.bd',
    phone: 'Not provided',
    gender: 'Female',
    department: 'Department of Computer Science & Engineering',
    institution: 'United International University',
    role: 'Lead Researcher',
    shortRole: 'Lead Researcher',
    tagline: 'Turning existing research into project direction.',
    initials: 'TI',
    image: '/members/tania-islam.jpg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    about: 'Leads the research backbone of the FYDP by surveying literature, extracting research gaps, formulating methodologies, and grounding project decisions in academic evidence.',
    responsibilities: [
      'Academic literature review and paper benchmarking',
      'Research gap formulation and hypothesis definition',
      'Methodology exploration and comparative analysis',
      'Reference management and thesis documentation guidance'
    ],
    skills: ['Literature Review', 'Research Methodology', 'Comparative Analysis', 'Academic Writing'],
    focus: [['Literature Review', 90], ['Methodology Design', 82], ['Research Gap Analysis', 78]]
  },
  {
    slug: 'maria-tasnim',
    name: 'Maria Tasnim',
    id: '0112331019',
    email: 'mtasnim2331019@bscse.uiu.ac.bd',
    phone: 'Not provided',
    gender: 'Female',
    department: 'Department of Computer Science & Engineering',
    institution: 'United International University',
    role: 'Research Assistant',
    shortRole: 'Research Assistant',
    tagline: 'Keeping research evidence organized and usable.',
    initials: 'MT',
    image: '/members/maria-tasnim.jpg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    about: 'Supports the research workflow through systematic dataset collection, paper synthesis, citation cataloging, and structured documentation for supervisor reviews.',
    responsibilities: [
      'Dataset curation and research reference cataloging',
      'Citation structuring and research paper synthesis',
      'Weekly progress documentation and meeting notes',
      'Assistance with comparative tests and data tables'
    ],
    skills: ['Research Support', 'Data Curation', 'Citation Management', 'Documentation'],
    focus: [['Data & Reference Curation', 82], ['Research Synthesis', 80], ['Documentation', 75]]
  },
  {
    slug: 'member-five',
    name: 'Member 05',
    id: 'To be added',
    email: 'To be added',
    phone: 'Not provided',
    gender: 'Female',
    department: 'Department of Computer Science & Engineering',
    institution: 'United International University',
    role: 'Presenter',
    shortRole: 'Presenter',
    tagline: 'Turning project research & system demos into clear presentations.',
    initials: '05',
    image: null,
    placeholder: true,
    github: null,
    linkedin: null,
    about: 'Focuses on presenting the project clearly, structuring presentation slide decks, preparing interactive demo stories, and handling defense Q&A sessions.',
    responsibilities: [
      'Presentation delivery and speech structuring',
      'Live demo walkthroughs and project storytelling',
      'Viva defense Q&A preparation and mock rehearsals',
      'Presentation slide design and visual storytelling'
    ],
    skills: ['Presentation Delivery', 'English Communication', 'Storytelling', 'Defense Q&A', 'Slide Design'],
    focus: [['Presentation Delivery', 85], ['Demo Storytelling', 78], ['Viva Rehearsal', 75]]
  }
];

export function getMember(slug) {
  return members.find((member) => member.slug === slug);
}
