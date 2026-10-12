import Image from "next/image";
import { TeamMemberItem } from "@/lib/data";

interface TeamCardProps {
  member: TeamMemberItem;
}

export function TeamCard({ member }: TeamCardProps) {
  const imageUrl =
    member.image ||
    member.photo_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0A1F44&color=fff&size=200`;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl transition-all duration-300">
      <div className="w-32 h-32 relative rounded-full overflow-hidden mb-6 border-4 border-gray-50 group-hover:border-gold/20 transition-colors">
        <Image 
          src={imageUrl} 
          alt={member.name} 
          fill
          className="object-cover"
        />
      </div>
      <h3 className="text-xl font-bold text-navy mb-1">{member.name}</h3>
      <p className="text-gold font-semibold text-sm mb-2 uppercase tracking-wider">{member.role}</p>
      {member.qualification && (
        <p className="text-xs text-gray-500 mb-4 font-medium">{member.qualification}</p>
      )}
      <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
    </div>
  );
}
