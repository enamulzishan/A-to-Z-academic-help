export type FAQCategory = 'General' | 'Research' | 'PhD' | 'Payments';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}

export const faqs: FAQ[] = [
  {
    id: "gen-1",
    question: "Do you guarantee a specific grade?",
    answer: "No. Our service is designed to provide professional academic support, guidance, and editing. We do not write papers for students to submit as their own (contract cheating), and therefore we cannot guarantee a specific grade. Our goal is to help you improve your own academic skills.",
    category: "General"
  },
  {
    id: "gen-2",
    question: "How quickly can you review my essay?",
    answer: "Our standard turnaround time is 3-5 working days. However, we do offer express services (24-48 hours) subject to consultant availability and an additional fee.",
    category: "General"
  },
  {
    id: "gen-3",
    question: "Are your consultants based in the UK?",
    answer: "Yes, all our academic consultants have been educated at or have taught at UK universities, ensuring they are fully familiar with UK marking criteria and academic standards.",
    category: "General"
  },
  {
    id: "res-1",
    question: "Can you help me choose a research topic?",
    answer: "Absolutely. We offer topic ideation consultations where we discuss your interests, review recent literature in your field, and help you identify a viable research gap.",
    category: "Research"
  },
  {
    id: "res-2",
    question: "Do you provide help with data analysis like SPSS or NVivo?",
    answer: "Yes, we have specialists in both quantitative (SPSS, R, Stata) and qualitative (NVivo, thematic) analysis who can guide you through the process of analyzing your data.",
    category: "Research"
  },
  {
    id: "res-3",
    question: "Will you write my methodology chapter for me?",
    answer: "No. We provide comprehensive guidance, structural advice, and editing. We will help you understand which methodology to choose and how to justify it, but you must write the chapter yourself.",
    category: "Research"
  },
  {
    id: "phd-1",
    question: "Do you offer mock Vivas?",
    answer: "Yes, we offer mock Viva sessions conducted by consultants who hold PhDs. These sessions simulate the real exam environment and provide constructive feedback on your defense.",
    category: "PhD"
  },
  {
    id: "phd-2",
    question: "Can you help me restructure my thesis after a 'Revise and Resubmit'?",
    answer: "Yes. Post-Viva corrections can be daunting. We help you systematically address the examiners' feedback and restructure your thesis to meet their requirements.",
    category: "PhD"
  },
  {
    id: "pay-1",
    question: "How does the payment process work?",
    answer: "Once we agree on a support plan, we will send you a secure invoice. We require a 50% deposit before work commences, with the remaining balance due upon completion.",
    category: "Payments"
  },
  {
    id: "pay-2",
    question: "Do you offer installment plans for PhD support?",
    answer: "Yes, for long-term doctoral support, we can arrange customized monthly retainer packages or milestone-based installment plans.",
    category: "Payments"
  }
];
