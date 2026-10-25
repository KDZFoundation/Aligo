import { UserProfile, Project, Badge } from '../types';

export const calculateBadges = (profile: UserProfile, projects: Project[]): Badge[] => {
  const badges: Badge[] = [];

  // 1. Ilość interesariuszy (stakeholders)
  const totalStakeholders = projects.reduce((sum, p) => sum + (p.interestedBusinesses?.length || 0) + (p.confirmedBusinesses?.length || 0), 0);
  if (totalStakeholders > 0) {
    let level: Badge['level'] = 'none';
    if (totalStakeholders >= 50) level = 'platinum';
    else if (totalStakeholders >= 20) level = 'gold';
    else if (totalStakeholders >= 5) level = 'silver';
    
    badges.push({ 
      id: 'stakeholders', 
      type: 'stakeholders', 
      label: 'Interesariusze', 
      value: totalStakeholders,
      level 
    });
  }

  // 2. Ilość wolontariuszy (volunteers) - symulacja na podstawie projektów
  const totalVolunteers = projects.length * 15; 
  if (totalVolunteers > 0) {
    let level: Badge['level'] = 'none';
    if (totalVolunteers >= 500) level = 'platinum';
    else if (totalVolunteers >= 100) level = 'gold';
    else if (totalVolunteers >= 20) level = 'silver';

    badges.push({ 
      id: 'volunteers', 
      type: 'volunteers', 
      label: 'Wolontariusze', 
      value: totalVolunteers,
      level
    });
  }

  // 3. Zrealizowane projekty (Charity / CRM)
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  if (completedProjects > 0) {
    let level: Badge['level'] = 'none';
    if (completedProjects >= 15) level = 'platinum';
    else if (completedProjects >= 5) level = 'gold';
    else if (completedProjects >= 1) level = 'silver';

    badges.push({
      id: 'charity',
      type: 'charity',
      label: 'Zrealizowane Akcje',
      value: completedProjects,
      level
    });
  }

  // Odznaki specyficzne dla Biznesu
  if (profile.role === 'business') {
    // 4. Sponsoring (wartość wsparcia)
    const totalContribution = projects.reduce((sum, p) => sum + (p.contributionValue || 0), 0);
    if (totalContribution > 0) {
      let level: Badge['level'] = 'none';
      if (totalContribution >= 100000) level = 'platinum';
      else if (totalContribution >= 50000) level = 'gold';
      else if (totalContribution >= 10000) level = 'silver';

      badges.push({ 
        id: 'sponsoring', 
        type: 'sponsoring', 
        label: 'Sponsoring', 
        value: `${totalContribution} PLN`,
        level 
      });
    }

    // 5. Wolontariat pracowniczy (zaangażowanie w projekty)
    const engagedProjects = projects.filter(p => p.confirmedBusinesses?.includes(profile.uid)).length;
    if (engagedProjects > 0) {
      let level: Badge['level'] = 'none';
      if (engagedProjects >= 10) level = 'platinum';
      else if (engagedProjects >= 3) level = 'gold';
      else if (engagedProjects >= 1) level = 'silver';

      badges.push({
        id: 'employee_volunteering',
        type: 'employee_volunteering',
        label: 'Wolontariat Pracowniczy',
        value: engagedProjects,
        level
      });
    }

    // 6. CSR - Ochrona środowiska (Ekologia)
    const envProjects = projects.filter(p => p.confirmedBusinesses?.includes(profile.uid) && ['Ekologia', 'Środowisko', 'Zwierzęta'].includes(p.category || '')).length;
    if (envProjects > 0) {
      let level: Badge['level'] = 'none';
      if (envProjects >= 5) level = 'platinum';
      else if (envProjects >= 2) level = 'gold';
      else if (envProjects >= 1) level = 'silver';

      badges.push({
        id: 'csr_eco',
        type: 'csr_eco',
        label: 'Patron Środowiska (CSR)',
        value: envProjects,
        level
      });
    }

    // 7. CSR - Inicjatywy społeczne (Zdrowie, Edukacja, Kultura, Pomoc Społeczna)
    const socialProjects = projects.filter(p => p.confirmedBusinesses?.includes(profile.uid) && ['Zdrowie', 'Pomoc Społeczna', 'Kultura', 'Edukacja'].includes(p.category || '')).length;
    if (socialProjects > 0) {
      let level: Badge['level'] = 'none';
      if (socialProjects >= 10) level = 'platinum';
      else if (socialProjects >= 4) level = 'gold';
      else if (socialProjects >= 1) level = 'silver';

      badges.push({
        id: 'csr_social',
        type: 'csr_social',
        label: 'Partner Społeczny (CSR)',
        value: socialProjects,
        level
      });
    }
  }

  return badges;
};
