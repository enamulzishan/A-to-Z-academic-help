import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "[TO BE PROVIDED]",
    qualification: "[Qualification]",
    university: "[University]",
    expertise: "[Subject Expertise]",
    researchArea: "[Research Area]",
    experience: "[X] Years",
  },
  {
    id: 2,
    name: "[TO BE PROVIDED]",
    qualification: "[Qualification]",
    university: "[University]",
    expertise: "[Subject Expertise]",
    researchArea: "[Research Area]",
    experience: "[X] Years",
  },
  {
    id: 3,
    name: "[TO BE PROVIDED]",
    qualification: "[Qualification]",
    university: "[University]",
    expertise: "[Subject Expertise]",
    researchArea: "[Research Area]",
    experience: "[X] Years",
  },
];

export function TeamPreviewSection() {
  return (
    <section className="py-24 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-navy mb-4">Meet Our Academic Experts</h2>
            <p className="text-gray-600 max-w-2xl">
              Work directly with specialists who understand the rigorous demands of top-tier universities.
            </p>
          </div>
          <Link href="/team" className="text-navy font-bold hover:text-gold transition-colors flex items-center">
            View Full Team <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mb-6 shadow-md">
                <GraduationCap className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-1">{member.name}</h3>
              <p className="text-gold font-medium text-sm mb-4">{member.qualification} | {member.university}</p>
              
              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div><strong className="text-navy">Expertise:</strong> {member.expertise}</div>
                <div><strong className="text-navy">Research Area:</strong> {member.researchArea}</div>
                <div><strong className="text-navy">Experience:</strong> {member.experience}</div>
              </div>
              
              <Link href="/team" className="text-sm font-semibold text-navy hover:text-gold flex items-center">
                View Profile <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
