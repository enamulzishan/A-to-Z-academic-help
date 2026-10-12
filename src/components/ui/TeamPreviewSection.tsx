import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, User } from "lucide-react";
import { getTeamMembers } from "@/lib/data";

export async function TeamPreviewSection() {
  const members = (await getTeamMembers()).slice(0, 3);

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
          {members.map((member) => (
            <div key={member.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-full overflow-hidden mb-6 border-2 border-gold/30 relative">
                  {member.photo_url || member.image ? (
                    <Image
                      src={member.photo_url || member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-navy flex items-center justify-center text-gold">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-navy mb-1">{member.name}</h3>
                <p className="text-gold font-medium text-sm mb-3">{member.role}</p>
                {member.qualification && (
                  <p className="text-xs text-gray-500 font-medium mb-4">{member.qualification}</p>
                )}
                
                {member.bio && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                    {member.bio}
                  </p>
                )}
              </div>
              
              <Link href="/team" className="text-sm font-semibold text-navy hover:text-gold flex items-center pt-4 border-t border-gray-200/60 mt-auto">
                View Consultant Profile <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
