import { collection, addDoc, serverTimestamp, getDocs, query, where, limit, doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const sampleProjects = [
  {
    title: 'Ogród Społeczny "Zielona Oaza"',
    titleEn: 'Community Garden "Green Oasis"',
    assumptions: 'Rewitalizacja nieużytków miejskich i stworzenie przestrzeni do wspólnej uprawy warzyw i ziół przez mieszkańców osiedla. Projekt zakłada warsztaty z ekologii i zrównoważonego rozwoju.',
    assumptionsEn: 'Revitalization of urban wasteland and creation of a shared vegetable & herb garden for neighborhood residents, featuring ecology workshops.',
    effect: 'Stworzenie 500m2 ogrodu, integracja 200 rodzin, produkcja lokalnej żywności.',
    effectEn: 'Creation of a 500m2 community garden, integrating 200 local families and producing local food.',
    deadline: '2026-09-15',
    status: 'planned',
    category: 'Ekologia',
    categoryEn: 'Ecology',
    contributionValue: 15000,
    imageUrl: 'https://picsum.photos/seed/garden/800/600',
    ownerName: 'Fundacja Eko-Rozwój',
    ownerId: 'other-ngo-1',
    interestedBusinesses: [],
    confirmedBusinesses: [],
  },
  {
    title: 'Koduj z Pasją - Warsztaty IT dla Młodzieży',
    titleEn: 'Code with Passion - Youth IT Workshops',
    assumptions: 'Organizacja cyklu bezpłatnych warsztatów programowania dla młodzieży z mniejszych miejscowości, zagrożonej wykluczeniem cyfrowym.',
    assumptionsEn: 'Free coding workshops for youth from smaller towns at risk of digital exclusion.',
    effect: 'Przeszkolenie 100 osób z podstaw Python i JS, przekazanie 20 laptopów.',
    effectEn: 'Training 100 students in basic Python and JS, donating 20 laptops.',
    deadline: '2026-12-20',
    status: 'in-progress',
    category: 'Edukacja',
    categoryEn: 'Education',
    contributionValue: 45000,
    imageUrl: 'https://picsum.photos/seed/code/800/600',
    ownerName: 'Stowarzyszenie Nowe Technologie',
    ownerId: 'other-ngo-2',
    interestedBusinesses: ['demo-user-123'],
    confirmedBusinesses: [],
  },
  {
    title: 'Zdrowy Senior - Program Aktywizacji',
    titleEn: 'Healthy Senior - Activation Program',
    assumptions: 'Zajęcia sportowe, rehabilitacyjne oraz spotkania z dietetykiem dla osób powyżej 65 roku życia. Promocja zdrowego stylu życia i profilaktyka.',
    assumptionsEn: 'Fitness and rehabilitation sessions plus nutritionist meetings for seniors over 65.',
    effect: 'Poprawa kondycji fizycznej 150 seniorów, spadek izolacji społecznej.',
    effectEn: 'Improving physical health for 150 seniors, reducing social isolation.',
    deadline: '2026-06-30',
    status: 'completed',
    category: 'Zdrowie',
    categoryEn: 'Health',
    contributionValue: 12000,
    ownerName: 'Stowarzyszenie Senior Plus',
    ownerId: 'other-ngo-7',
    interestedBusinesses: [],
    confirmedBusinesses: ['business-partner-1'],
  },
  {
    title: 'Kultura na Podwórku',
    titleEn: 'Courtyard Culture',
    assumptions: 'Mobilne kino letnie oraz teatrzyki dla dzieci realizowane bezpośrednio na podwórkach kamienic w rewitalizowanych dzielnicach.',
    assumptionsEn: 'Mobile summer outdoor cinema and children theatre held directly in tenement courtyards.',
    effect: '20 seansów filmowych, 10 spektakli, udział ok. 2000 widzów.',
    effectEn: '20 movie screenings, 10 plays, reaching ~2000 spectators.',
    deadline: '2026-08-30',
    status: 'planned',
    category: 'Kultura',
    categoryEn: 'Culture',
    contributionValue: 8000,
    ownerName: 'Centrum Inicjatyw Lokalnych',
    ownerId: 'other-ngo-3',
    interestedBusinesses: [],
    confirmedBusinesses: [],
  },
  {
    title: 'Czysta Rzeka - Akcja Sprzątania',
    titleEn: 'Clean River - Cleanup Action',
    assumptions: 'Wielka akcja sprzątania brzegów rzeki połączona z edukacją na temat segregacji odpadów i ochrony ekosystemów wodnych.',
    assumptionsEn: 'Massive riverbank cleanup paired with waste sorting and aquatic ecosystem education.',
    effect: 'Zebranie 5 ton odpadów, udział 500 wolontariuszy, montaż 20 tablic edukacyjnych.',
    effectEn: 'Collecting 5 tons of waste, 500 volunteers participating, installing 20 educational boards.',
    deadline: '2026-05-10',
    status: 'in-progress',
    category: 'Ekologia',
    categoryEn: 'Ecology',
    contributionValue: 5000,
    ownerName: 'Fundacja Eko-Rozwój',
    ownerId: 'other-ngo-1',
    interestedBusinesses: [],
    confirmedBusinesses: [],
  },
  {
    title: 'Schronisko dla Zwierząt - Modernizacja',
    titleEn: 'Animal Shelter Modernization',
    assumptions: 'Budowa nowych ocieplanych boksów dla psów oraz modernizacja kociarni. Zakup sprzętu medycznego do gabinetu weterynaryjnego.',
    assumptionsEn: 'Building insulated dog kennels and upgrading cattery, purchasing veterinary medical gear.',
    effect: 'Poprawa warunków dla 100 psów i 50 kotów, skrócenie czasu diagnostyki.',
    effectEn: 'Improved living conditions for 100 dogs and 50 cats, faster diagnostics.',
    deadline: '2026-11-11',
    status: 'planned',
    category: 'Inne',
    categoryEn: 'Other',
    contributionValue: 60000,
    ownerName: 'Przyjaciele Braci Mniejszych',
    ownerId: 'demo-user-123',
    interestedBusinesses: [],
    confirmedBusinesses: [],
  },
  {
    title: 'Zimowa Pomoc dla Bezdomnych',
    titleEn: 'Winter Relief for the Homeless',
    assumptions: 'Zakup i dystrybucja ciepłych posiłków, odzieży termicznej i śpiworów dla osób w kryzysie bezdomności w okresie zimowym.',
    assumptionsEn: 'Purchasing and distributing hot meals, thermal clothes, and sleeping bags during winter.',
    effect: 'Wydano 2000 posiłków i 500 pakietów zimowych, uratowano przed wychłodzeniem kilkadziesiąt osób.',
    effectEn: 'Distributed 2000 meals and 500 winter packages, protecting dozens from hypothermia.',
    deadline: '2025-02-28',
    status: 'completed',
    category: 'Pomoc Społeczna',
    categoryEn: 'Social Help',
    contributionValue: 25000,
    imageUrl: 'https://picsum.photos/seed/winter/800/600',
    ownerName: 'Fundacja Nadzieja',
    ownerId: 'other-ngo-8',
    interestedBusinesses: [],
    confirmedBusinesses: ['business-partner-1'],
  },
  {
    title: 'Edukacja Ekologiczna w Przedszkolach',
    titleEn: 'Eco Education in Preschools',
    assumptions: 'Cykl warsztatów dla najmłodszych uczących segregacji śmieci, oszczędzania wody i szacunku do przyrody poprzez zabawę.',
    assumptionsEn: 'Interactive workshops for young kids teaching waste sorting, water saving, and nature respect.',
    effect: 'Przeprowadzono zajęcia w 20 przedszkolach, przeszkolono 600 dzieci.',
    effectEn: 'Workshops conducted in 20 preschools, educating 600 children.',
    deadline: '2025-06-15',
    status: 'completed',
    category: 'Ekologia',
    categoryEn: 'Ecology',
    contributionValue: 15000,
    imageUrl: 'https://picsum.photos/seed/kids/800/600',
    ownerName: 'Eko-Maluśkiewicz',
    ownerId: 'other-ngo-9',
    interestedBusinesses: [],
    confirmedBusinesses: ['business-partner-1'],
  },
  {
    title: 'Eko-Szkoła: Panele Fotowoltaiczne',
    titleEn: 'Eco-School: Solar Panels',
    assumptions: 'Instalacja paneli fotowoltaicznych na dachu lokalnej szkoły podstawowej połączona z lekcjami o odnawialnych źródłach energii.',
    assumptionsEn: 'Installing solar panels on local primary school roof combined with renewable energy lessons.',
    effect: 'Obniżenie rachunków za prąd o 40%, edukacja 400 uczniów.',
    effectEn: '40% electricity bill reduction, educating 400 students.',
    deadline: '2026-10-01',
    status: 'planned',
    category: 'Ekologia',
    categoryEn: 'Ecology',
    contributionValue: 35000,
    ownerName: 'Fundacja Zielona Przyszłość',
    ownerId: 'other-ngo-4',
    interestedBusinesses: [],
    confirmedBusinesses: [],
  },
  {
    title: 'Senior w Sieci - Kurs Obsługi Smartfona',
    titleEn: 'Seniors Online - Smartphone Workshop',
    assumptions: 'Indywidualne szkolenia dla seniorów z zakresu bezpiecznego korzystania z bankowości elektronicznej i komunikatorów.',
    assumptionsEn: 'Personalized digital literacy training for seniors on online banking and messengers.',
    effect: '50 przeszkolonych seniorów, zwiększenie bezpieczeństwa cyfrowego.',
    effectEn: '50 trained seniors, increased digital safety.',
    deadline: '2026-07-15',
    status: 'planned',
    category: 'Edukacja',
    categoryEn: 'Education',
    contributionValue: 4000,
    ownerName: 'Stowarzyszenie Cyfrowy Świat',
    ownerId: 'other-ngo-5',
    interestedBusinesses: [],
    confirmedBusinesses: [],
  },
  {
    title: 'Mobilna Biblioteka dla Dzieci',
    titleEn: 'Mobile Children\'s Library',
    assumptions: 'Zakup i wyposażenie vana w książki i gry planszowe, który będzie odwiedzał miejscowości bez stacjonarnych bibliotek.',
    assumptionsEn: 'Equipping a van with books and board games visiting remote towns lacking public libraries.',
    effect: 'Dostęp do kultury dla 500 dzieci, 1000 wypożyczonych książek rocznie.',
    effectEn: 'Culture access for 500 children, 1000 books borrowed per year.',
    deadline: '2026-09-30',
    status: 'planned',
    category: 'Kultura',
    categoryEn: 'Culture',
    contributionValue: 25000,
    ownerName: 'Fundacja Czytamy Razem',
    ownerId: 'other-ngo-6',
    interestedBusinesses: [],
    confirmedBusinesses: [],
  },
  {
    title: 'Warsztaty Pierwszej Pomocy dla Szkół',
    titleEn: 'First Aid Workshops for Schools',
    assumptions: 'Przeszkolenie uczniów i nauczycieli z zasad udzielania pierwszej pomocy przedmedycznej przy użyciu defibrylatora AED.',
    assumptionsEn: 'Training students and teachers in CPR and AED defibrillator usage.',
    effect: 'Przeszkolono 1200 osób w 10 szkołach, doposażono placówki w zestawy ratunkowe.',
    effectEn: 'Trained 1200 people across 10 schools, equipped facilities with emergency kits.',
    deadline: '2025-01-10',
    status: 'completed',
    category: 'Zdrowie',
    categoryEn: 'Health',
    contributionValue: 18000,
    imageUrl: 'https://picsum.photos/seed/health/800/600',
    ownerName: 'Medycy Dzieciom',
    ownerId: 'other-ngo-10',
    interestedBusinesses: [],
    confirmedBusinesses: ['business-partner-1'],
  },
  {
    title: 'Rewitalizacja Parku Miejskiego',
    titleEn: 'City Park Revitalization',
    assumptions: 'Zasadzenie 1000 nowych drzew i krzewów, modernizacja alejek oraz budowa ścieżki edukacyjnej o lokalnej faunie i florze.',
    assumptionsEn: 'Planting 1000 new trees and shrubs, upgrading walking paths and educational flora trail.',
    effect: 'Odzyskanie 2ha terenu zielonego, zwiększenie bazy żerowej dla ptaków, edukacja 5000 mieszkańców.',
    effectEn: 'Reclaimed 2 hectares of green space, educated 5000 residents.',
    deadline: '2025-05-30',
    status: 'completed',
    category: 'Ekologia',
    categoryEn: 'Ecology',
    contributionValue: 45000,
    imageUrl: 'https://picsum.photos/seed/park/800/600',
    ownerName: 'Fundacja Zielona Przyszłość',
    ownerId: 'other-ngo-4',
    interestedBusinesses: [],
    confirmedBusinesses: ['business-partner-1'],
  }
];

export const seedDatabase = async (currentUserId: string, organizationName: string) => {
  try {
    console.log('Checking database for duplicates and seeding...');
    
    // 1. Fetch all existing projects and drop them for a clean re-seed
    let allProjectsSnapshot;
    try {
      allProjectsSnapshot = await getDocs(collection(db, 'projects'));
      if (!allProjectsSnapshot.empty) {
        console.log(`Removing ${allProjectsSnapshot.docs.length} existing projects...`);
        for (const doc of allProjectsSnapshot.docs) {
          try {
            await deleteDoc(doc.ref);
          } catch (e) {
            console.warn(`Could not delete project ${doc.id}:`, e);
          }
        }
      }
    } catch (e) {
      console.error('Error fetching projects for cleanup:', e);
    }

    // Fetch the current user profile to determine role
    let currentUserRole = 'ngo';
    const currentUserDoc = await getDoc(doc(db, 'users', currentUserId));
    if (currentUserDoc.exists()) {
      currentUserRole = currentUserDoc.data().role;
    }

    // 2. Seed missing projects
    for (const project of sampleProjects) {
      const isDemoNgoProject = project.ownerId === 'demo-user-123';
      const isDemoBusinessProject = project.confirmedBusinesses?.includes('business-partner-1');
      const isInterestedDemoBusiness = project.interestedBusinesses?.includes('demo-user-123');
      
      const targetOwnerId = (isDemoNgoProject && currentUserRole === 'ngo') ? currentUserId : project.ownerId;
      const targetOwnerName = (isDemoNgoProject && currentUserRole === 'ngo') ? (organizationName || 'Twoja Organizacja NGO') : project.ownerName;
      
      // Determine array of confirmed businesses for demo business role
      let targetConfirmedBusinesses = [...(project.confirmedBusinesses || [])];
      if (isDemoBusinessProject && currentUserRole === 'business') {
         targetConfirmedBusinesses = [currentUserId, ...targetConfirmedBusinesses.filter(id => id !== 'business-partner-1')];
      }

      // Determine array of interested businesses
      let targetInterestedBusinesses = [...(project.interestedBusinesses || [])];
      if (isInterestedDemoBusiness && currentUserRole === 'business') {
        targetInterestedBusinesses = [currentUserId, ...targetInterestedBusinesses.filter(id => id !== 'demo-user-123')];
      }

      console.log(`Seeding missing project: ${project.title}`);
      await addDoc(collection(db, 'projects'), {
        ...project,
        deadline: new Date(project.deadline),
        ownerId: targetOwnerId,
        ownerName: targetOwnerName,
        confirmedBusinesses: targetConfirmedBusinesses,
        interestedBusinesses: targetInterestedBusinesses,
        createdAt: serverTimestamp(),
      });
    }

    // Seed some other users to make the platform feel alive
    const otherUsers = [
      {
        uid: 'other-ngo-1',
        organizationName: 'Fundacja Eko-Rozwój',
        role: 'ngo',
        profileType: 'extended',
        city: 'Gdańsk',
        createdAt: serverTimestamp(),
      },
      {
        uid: 'other-ngo-2',
        organizationName: 'Stowarzyszenie Nowe Technologie',
        role: 'ngo',
        profileType: 'extended',
        city: 'Wrocław',
        createdAt: serverTimestamp(),
      },
      {
        uid: 'business-partner-1',
        organizationName: 'TechCorp Solutions',
        role: 'business',
        profileType: 'extended',
        city: 'Warszawa',
        createdAt: serverTimestamp(),
      }
    ];

    for (const user of otherUsers) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, user);
        }
      } catch (e) {
        console.warn(`Could not seed user ${user.uid}:`, e);
      }
    }
    
    console.log('Seed/Cleanup completed successfully!');
  } catch (error) {
    console.error('Error seeding/cleaning database:', error);
  }
};
