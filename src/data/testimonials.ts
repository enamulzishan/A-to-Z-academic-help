export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  university: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote: "The research guidance helped me understand exactly how to structure my proposal and develop my research questions. Highly recommended for any postgraduate student feeling lost.",
    author: "Sarah J.",
    role: "Master's Student",
    university: "University College London"
  },
  {
    id: "t2",
    quote: "Professional, clear, and incredibly helpful. The support I received for my PhD methodology chapter gave me the confidence I needed for my Viva.",
    author: "Mark T.",
    role: "PhD Candidate",
    university: "University of Manchester"
  },
  {
    id: "t3",
    quote: "The academic editing service transformed my dissertation. They didn't just fix typos; they improved the academic tone and flow significantly.",
    author: "Elena R.",
    role: "Undergraduate Student",
    university: "King's College London"
  },
  {
    id: "t4",
    quote: "I was struggling to narrow down my DBA topic. The consultation I had was a game-changer and set me on a clear, focused path.",
    author: "David L.",
    role: "DBA Candidate",
    university: "Warwick Business School"
  }
];
