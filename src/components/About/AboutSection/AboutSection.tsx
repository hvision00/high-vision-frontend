import { component$ } from '@builder.io/qwik';

interface TeamMember {
  id: number;
  name: string;
  surname: string;
  role: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Mirco',
    surname: 'Vitagliano',
    role: 'Responsabile Marketing',
    image: '/images/team/Mirco-Vitagliano.jpg',
  },
  {
    id: 2,
    name: 'Mattia',
    surname: 'Muzzin',
    role: 'Direttore Commerciale',
    image: '/images/team/Nicholas-Bellotto.jpg',
  },
  {
    id: 3,
    name: 'Nicholas',
    surname: 'Bellotto',
    role: 'Amministratore delegato',
    image: '/images/team/Mattia-Muzzin.jpg',
  },
  {
    id: 4,
    name: 'Giorgia',
    surname: 'Vitagliano',
    role: 'Responsabile acquisti',
    image: '/images/team/Giorgia-Vitagliano.jpg',
  },
];

export default component$(() => {
  return (
    <div class="relative">
      {/* Container principale */}
      <div class="relative">
        {/* Griglia Team Members */}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 md:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <div 
              key={member.id}
              class="relative h-96 rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Immagine come elemento img invece di background-image */}
              <img 
                src={member.image}
                alt={`${member.name} ${member.surname} - ${member.role}`}
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError$={(event) => {
                  // Fallback in caso di errore nel caricamento dell'immagine
                  const target = event.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallbackDiv = target.nextElementSibling as HTMLElement;
                  if (fallbackDiv) {
                    fallbackDiv.style.display = 'block';
                  }
                }}
              />
              
              {/* Fallback per immagini mancanti - nascosto di default */}
              <div 
                class="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 hidden"
                style={{ display: 'none' }}
              >
                <div class="flex items-center justify-center h-full text-white text-lg font-medium">
                  {member.name[0]}{member.surname[0]}
                </div>
              </div>
              
              {/* Gradiente nero dal basso */}
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Contenuto: Nome e Ruolo */}
              <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 class="font-semibold text-xl mb-1">
                  {member.name} {member.surname}
                </h3>
                <p class="text-gray-300 text-sm">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});