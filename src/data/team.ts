export type TeamCategory = 
  | 'academic-consultant' 
  | 'research-consultant' 
  | 'subject-specialist' 
  | 'academic-editor';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  qualification: string;
  bio: string;
  image: string;
  category: TeamCategory;
}

export const team: TeamMember[] = [
  {
    id: "dr-sarah-williams",
    name: "Dr. Sarah Williams",
    role: "Senior Research Consultant",
    qualification: "PhD in Sociology, University of Manchester",
    bio: "Dr. Williams specializes in qualitative research methods and has guided over 50 doctoral candidates through their thesis structure and methodology.",
    image: "https://ui-avatars.com/api/?name=Sarah+Williams&background=0A1F44&color=fff&size=200",
    category: "research-consultant"
  },
  {
    id: "dr-david-chen",
    name: "Dr. David Chen",
    role: "Academic Consultant",
    qualification: "DBA, Warwick Business School",
    bio: "With a background in international business, Dr. Chen helps MBA and DBA students formulate robust business models and data analysis strategies.",
    image: "https://ui-avatars.com/api/?name=David+Chen&background=0A1F44&color=fff&size=200",
    category: "academic-consultant"
  },
  {
    id: "emma-thompson",
    name: "Emma Thompson",
    role: "Senior Academic Editor",
    qualification: "MA Applied Linguistics, UCL",
    bio: "Emma is our referencing expert, ensuring every paper meets rigorous academic standards across Harvard, APA, and MLA styles.",
    image: "https://ui-avatars.com/api/?name=Emma+Thompson&background=C9A227&color=fff&size=200",
    category: "academic-editor"
  },
  {
    id: "dr-michael-roberts",
    name: "Dr. Michael Roberts",
    role: "STEM Subject Specialist",
    qualification: "PhD in Data Science, Imperial College London",
    bio: "Dr. Roberts provides specialized guidance for computer science and engineering students, focusing on quantitative methodology and algorithms.",
    image: "https://ui-avatars.com/api/?name=Michael+Roberts&background=0A1F44&color=fff&size=200",
    category: "subject-specialist"
  },
  {
    id: "dr-elena-patel",
    name: "Dr. Elena Patel",
    role: "Research Consultant",
    qualification: "PhD in Psychology, King's College London",
    bio: "Dr. Patel specializes in experimental design and advanced statistical analysis, helping students navigate SPSS and R with confidence.",
    image: "https://ui-avatars.com/api/?name=Elena+Patel&background=0A1F44&color=fff&size=200",
    category: "research-consultant"
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    role: "Academic Consultant",
    qualification: "MSc Economics, LSE",
    bio: "James assists undergraduate and master's students in structuring their dissertations and developing strong, critical arguments.",
    image: "https://ui-avatars.com/api/?name=James+Wilson&background=C9A227&color=fff&size=200",
    category: "academic-consultant"
  }
];
