export type Language = 'pt' | 'fr' | 'en';

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    version: string;
    searchPlaceholder: string;
    notifications: string;
    language: string;
    activeRole: string;
    simulateRole: string;
    adminGeral: string;
    capitania: string;
    tesouraria: string;
    inspector: string;
    agenteMaritimo: string;
    userFallback: string;
    roleFallback: string;
  };
  sidebar: {
    systemAndOverview: string;
    portOperations: string;
    financesAndRevenue: string;
    regulationAndSafety: string;
    administration: string;
    authentication: string;
    dashboard: string;
    usersAndProfiles: string;
    vessels: string;
    agencies: string;
    shipowners: string;
    portsAndTerminals: string;
    berthingAndCalls: string;
    invoicing: string;
    treasury: string;
    revenueRubrics: string;
    inspections: string;
    certificates: string;
    licenses: string;
    finesAndInfractions: string;
    reportsAndStats: string;
    configuration: string;
    onPremServer: string;
    serverActive: string;
  };
  common: {
    search: string;
    filter: string;
    edit: string;
    delete: string;
    save: string;
    cancel: string;
    create: string;
    activate: string;
    deactivate: string;
    status: string;
    active: string;
    inactive: string;
    total: string;
    date: string;
    actions: string;
    role: string;
    department: string;
    all: string;
    close: string;
    upload: string;
    photo: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    position: string;
    exportPdf: string;
    exportExcel: string;
    print: string;
    you: string;
    securityPolicy: string;
    yes: string;
    no: string;
    details: string;
    confirm: string;
    loading: string;
  };
  users: {
    title: string;
    subtitle: string;
    rbacModule: string;
    editMyProfile: string;
    createNewUser: string;
    totalUsers: string;
    activeAccounts: string;
    inactiveAccounts: string;
    currentPrivilege: string;
    totalDesc: string;
    activeDesc: string;
    inactiveDesc: string;
    privilegeDescAdmin: string;
    privilegeDescRestricted: string;
    securityBannerTitle: string;
    securityBannerDesc: string;
    activeSession: string;
    filterRole: string;
    filterStatus: string;
    userAndPhoto: string;
    contacts: string;
    roleRbac: string;
    lastAccess: string;
    actionsAndControl: string;
    noUsersFound: string;
    editProfileTitle: string;
    editProfileDesc: string;
    createUserTitle: string;
    createUserDesc: string;
    userPhoto: string;
    orSelectPreset: string;
    orPasteUrl: string;
    fullName: string;
    corporateEmail: string;
    initialPassword: string;
    contactPhone: string;
    positionLabel: string;
    departmentLabel: string;
    rbacFunctionLabel: string;
    rbacProtectedDesc: string;
    saveChanges: string;
    registerUser: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    activeBerths: string;
    totalVessels: string;
    pendingInvoices: string;
    monthlyInspections: string;
    recentBerthing: string;
    quickActions: string;
    systemAlerts: string;
  };
  vessels: {
    title: string;
    subtitle: string;
    addVessel: string;
    imo: string;
    flag: string;
    type: string;
    grossTonnage: string;
    agent: string;
    shipowner: string;
  };
  invoicing: {
    title: string;
    subtitle: string;
    newInvoice: string;
    totalInvoiced: string;
    paidInvoices: string;
    pendingInvoices: string;
  };
  treasury: {
    title: string;
    subtitle: string;
    currentBalance: string;
    totalInflows: string;
    totalOutflows: string;
    newTransaction: string;
  };
  inspections: {
    title: string;
    subtitle: string;
    newInspection: string;
    approved: string;
    rejected: string;
    inspector: string;
  };
}

export const translations: Record<Language, Translations> = {
  pt: {
    header: {
      title: 'NHOMINCA',
      subtitle: 'Instituto Marítimo Portuário da Guiné-Bissau',
      version: 'v1.0 • IMP',
      searchPlaceholder: 'Pesquisar IMO, Navio, Atracação ou Factura...',
      notifications: 'Notificações do Sistema',
      language: 'Idioma / Langue / Language',
      activeRole: 'Perfil Activo:',
      simulateRole: 'Simular Papel:',
      adminGeral: 'Admin Geral (IMP)',
      capitania: 'Capitania dos Portos',
      tesouraria: 'Tesouraria & Facturação',
      inspector: 'Inspecção Marítima',
      agenteMaritimo: 'Agente Marítimo',
      userFallback: 'Utilizador IMP',
      roleFallback: 'Operador System',
    },
    sidebar: {
      systemAndOverview: 'SISTEMA & VISÃO GERAL',
      portOperations: 'OPERAÇÕES PORTUÁRIAS',
      financesAndRevenue: 'FINANÇAS & RECEITAS',
      regulationAndSafety: 'REGULAMENTAÇÃO & SEGURANÇA',
      administration: 'ADMINISTRAÇÃO',
      authentication: 'Autenticação & Sessão',
      dashboard: 'Dashboard Operacional',
      usersAndProfiles: 'Utilizadores & Perfis',
      vessels: 'Embarcações',
      agencies: 'Agências Marítimas',
      shipowners: 'Armadores',
      portsAndTerminals: 'Portos & Terminais',
      berthingAndCalls: 'Atracações & Escalas',
      invoicing: 'Facturação',
      treasury: 'Tesouraria',
      revenueRubrics: 'Receitas & Rubricas',
      inspections: 'Inspecções Marítimas',
      certificates: 'Certificados',
      licenses: 'Licenças de Navegação',
      finesAndInfractions: 'Multas & Infrações',
      reportsAndStats: 'Relatórios & Estatísticas',
      configuration: 'Configuração',
      onPremServer: 'SERVIDOR LOCAL',
      serverActive: 'PostgreSQL 16 • Activo',
    },
    common: {
      search: 'Pesquisar',
      filter: 'Filtrar',
      edit: 'Editar',
      delete: 'Eliminar',
      save: 'Guardar',
      cancel: 'Cancelar',
      create: 'Criar',
      activate: 'Activar',
      deactivate: 'Desactivar',
      status: 'Estado',
      active: 'Ativo',
      inactive: 'Inativo',
      total: 'Total',
      date: 'Data',
      actions: 'Ações',
      role: 'Função',
      department: 'Departamento',
      all: 'Todos',
      close: 'Fechar',
      upload: 'Carregar',
      photo: 'Foto',
      name: 'Nome',
      email: 'Email',
      password: 'Palavra-passe',
      phone: 'Telefone',
      position: 'Cargo',
      exportPdf: 'Exportar PDF',
      exportExcel: 'Exportar Excel',
      print: 'Imprimir',
      you: 'Você',
      securityPolicy: 'Política de Segurança',
      yes: 'Sim',
      no: 'Não',
      details: 'Detalhes',
      confirm: 'Confirmar',
      loading: 'A carregar...',
    },
    users: {
      title: 'Gestão de Utilizadores, Perfis & Controlo de Acesso',
      subtitle: 'Gestão de credenciais institucionais, fotos de perfil, dados de contacto e activação/desactivação de contas pelo Administrador',
      rbacModule: 'Módulo RBAC',
      editMyProfile: 'Editar O Meu Perfil',
      createNewUser: 'Criar Novo Utilizador',
      totalUsers: 'Total de Utilizadores',
      activeAccounts: 'Contas Activas',
      inactiveAccounts: 'Contas Inactivas',
      currentPrivilege: 'Nível de Privilégio Actual',
      totalDesc: 'Cadastrados no Sistema IMP',
      activeDesc: 'Com acesso liberado',
      inactiveDesc: 'Acesso suspenso pelo Admin',
      privilegeDescAdmin: 'Poder Total (Ativar/Desativar)',
      privilegeDescRestricted: 'Leitura & Operação Restrita',
      securityBannerTitle: 'Política de Segurança & Privilégios Institucionais',
      securityBannerDesc: 'Cada utilizador pode actualizar a sua foto de perfil, dados de contacto e palavra-passe. O Administrador Geral possui controlo total para ativar ou desativar utilizadores a qualquer momento.',
      activeSession: 'Sessão Activa:',
      filterRole: 'Função:',
      filterStatus: 'Estado:',
      userAndPhoto: 'Utilizador & Foto',
      contacts: 'Contactos',
      roleRbac: 'Papel / Perfil RBAC',
      lastAccess: 'Último Acesso',
      actionsAndControl: 'Ações & Controlo',
      noUsersFound: 'Nenhum utilizador encontrado para os filtros selecionados.',
      editProfileTitle: 'Editar Perfil de Utilizador',
      editProfileDesc: 'Alteração de dados pessoais, foto de perfil, dados de contacto e credenciais',
      createUserTitle: 'Criar Novo Utilizador',
      createUserDesc: 'Registo institucional de nova conta no sistema marítimo IMP',
      userPhoto: 'Foto de Perfil do Utilizador',
      orSelectPreset: 'ou escolha um dos avatares oficiais:',
      orPasteUrl: 'Ou cole a URL da imagem aqui (https://...)',
      fullName: 'Nome Completo',
      corporateEmail: 'Email Corporativo',
      initialPassword: 'Palavra-passe (Senha)',
      contactPhone: 'Telefone de Contacto',
      positionLabel: 'Cargo / Posição',
      departmentLabel: 'Departamento',
      rbacFunctionLabel: 'Função / Perfil RBAC',
      rbacProtectedDesc: 'As permissões de acesso ao sistema (função RBAC) são mantidas e protegidas de acordo com o contrato institucional. É permitido alterar a foto, nome, email, palavra-passe e dados pessoais.',
      saveChanges: 'Guardar Alterações',
      registerUser: 'Cadastrar Utilizador',
    },
    dashboard: {
      title: 'Painel Geral de Operações Marítimas',
      subtitle: 'Monitorização em tempo real de atracações, frotas, inspecções e facturação portuária',
      activeBerths: 'Atracações Activas',
      totalVessels: 'Navios Registados',
      pendingInvoices: 'Facturas Pendentes',
      monthlyInspections: 'Inspecções do Mês',
      recentBerthing: 'Movimentação Recente de Navios',
      quickActions: 'Ações Rápidas',
      systemAlerts: 'Alertas do Sistema',
    },
    vessels: {
      title: 'Registo de Embarcações',
      subtitle: 'Cadastro e controlo técnico da frota de navios e embarcações portuárias',
      addVessel: 'Adicionar Embarcação',
      imo: 'Número IMO',
      flag: 'Bandeira',
      type: 'Tipo de Navio',
      grossTonnage: 'Tonelagem Bruta (GT)',
      agent: 'Agência Marítima',
      shipowner: 'Armador',
    },
    invoicing: {
      title: 'Facturação & Tarifas Marítimas',
      subtitle: 'Emissão e controlo de facturas de emolumentos, pilotagem e acostagem',
      newInvoice: 'Emitir Nova Factura',
      totalInvoiced: 'Total Facturado',
      paidInvoices: 'Facturas Pagas',
      pendingInvoices: 'Facturas Pendentes',
    },
    treasury: {
      title: 'Tesouraria & Controlo Financeiro',
      subtitle: 'Gestão de fluxos de caixa, recebimentos e conciliação bancária',
      currentBalance: 'Saldo Actual em Caixa',
      totalInflows: 'Entradas do Mês',
      totalOutflows: 'Saídas do Mês',
      newTransaction: 'Registar Transação',
    },
    inspections: {
      title: 'Inspecções Marítimas & Segurança (PSC)',
      subtitle: 'Controlo de vistorias técnicas e segurança de navios',
      newInspection: 'Nova Inspecção',
      approved: 'Aprovadas',
      rejected: 'Com Deficiências',
      inspector: 'Inspector Responsável',
    },
  },
  fr: {
    header: {
      title: 'NHOMINCA',
      subtitle: 'Institut Maritime Portuaire de Guinée-Bissau',
      version: 'v1.0 • IMP',
      searchPlaceholder: 'Rechercher OMI, Navire, Accostage ou Facture...',
      notifications: 'Notifications Système',
      language: 'Langue / Language / Idioma',
      activeRole: 'Profil Actif:',
      simulateRole: 'Simuler le Rôle:',
      adminGeral: 'Admin Général (IMP)',
      capitania: 'Capitainerie des Ports',
      tesouraria: 'Trésorerie & Facturation',
      inspector: 'Inspection Maritime',
      agenteMaritimo: 'Agent Maritime',
      userFallback: 'Utilisateur IMP',
      roleFallback: 'Opérateur Système',
    },
    sidebar: {
      systemAndOverview: 'SYSTÈME & APERÇU',
      portOperations: 'OPÉRATIONS PORTUAIRES',
      financesAndRevenue: 'FINANCES & RECETTES',
      regulationAndSafety: 'RÉGLEMENTATION & SÉCURITÉ',
      administration: 'ADMINISTRATION',
      authentication: 'Authentification & Session',
      dashboard: 'Tableau de Bord Opérationnel',
      usersAndProfiles: 'Utilisateurs & Profils',
      vessels: 'Navires & Embarcations',
      agencies: 'Agences Maritimes',
      shipowners: 'Armateurs',
      portsAndTerminals: 'Ports & Terminaisons',
      berthingAndCalls: 'Accostages & Escales',
      invoicing: 'Facturation',
      treasury: 'Trésorerie',
      revenueRubrics: 'Recettes & Rubriques',
      inspections: 'Inspections Maritimes',
      certificates: 'Certificats',
      licenses: 'Permis de Navigation',
      finesAndInfractions: 'Amendes & Infractions',
      reportsAndStats: 'Rapports & Statistiques',
      configuration: 'Configuration',
      onPremServer: 'SERVEUR LOCAL',
      serverActive: 'PostgreSQL 16 • Actif',
    },
    common: {
      search: 'Rechercher',
      filter: 'Filtrer',
      edit: 'Modifier',
      delete: 'Supprimer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      create: 'Créer',
      activate: 'Activer',
      deactivate: 'Désactiver',
      status: 'Statut',
      active: 'Actif',
      inactive: 'Inactif',
      total: 'Total',
      date: 'Date',
      actions: 'Actions',
      role: 'Rôle',
      department: 'Département',
      all: 'Tous',
      close: 'Fermer',
      upload: 'Téléverser',
      photo: 'Photo',
      name: 'Nom',
      email: 'E-mail',
      password: 'Mot de passe',
      phone: 'Téléphone',
      position: 'Poste',
      exportPdf: 'Exporter PDF',
      exportExcel: 'Exporter Excel',
      print: 'Imprimer',
      you: 'Vous',
      securityPolicy: 'Politique de Sécurité',
      yes: 'Oui',
      no: 'Non',
      details: 'Détails',
      confirm: 'Confirmer',
      loading: 'Chargement...',
    },
    users: {
      title: 'Gestion des Utilisateurs, Profils & Contrôle d\'Accès',
      subtitle: 'Gestion des identifiants institutionnels, photos de profil, coordonnées et activation/désactivation des comptes par l\'administrateur',
      rbacModule: 'Module RBAC',
      editMyProfile: 'Modifier Mon Profil',
      createNewUser: 'Créer un Nouvel Utilisateur',
      totalUsers: 'Total d\'Utilisateurs',
      activeAccounts: 'Comptes Actifs',
      inactiveAccounts: 'Comptes Inactifs',
      currentPrivilege: 'Niveau de Privilège Actuel',
      totalDesc: 'Enregistrés dans le Système IMP',
      activeDesc: 'Avec accès autorisé',
      inactiveDesc: 'Accès suspendu par l\'Admin',
      privilegeDescAdmin: 'Pouvoir Total (Activer/Désactiver)',
      privilegeDescRestricted: 'Lecture & Opération Restreinte',
      securityBannerTitle: 'Politique de Sécurité & Privilèges Institutionnels',
      securityBannerDesc: 'Chaque utilisateur peut mettre à jour sa photo de profil, ses coordonnées et son mot de passe. L\'Administrateur Général dispose d\'un contrôle total pour activer ou désactiver les utilisateurs à tout moment.',
      activeSession: 'Session Active:',
      filterRole: 'Rôle:',
      filterStatus: 'Statut:',
      userAndPhoto: 'Utilisateur & Photo',
      contacts: 'Coordonnées',
      roleRbac: 'Rôle / Profil RBAC',
      lastAccess: 'Dernier Accès',
      actionsAndControl: 'Actions & Contrôle',
      noUsersFound: 'Aucun utilisateur trouvé pour les filtres sélectionnés.',
      editProfileTitle: 'Modifier le Profil de l\'Utilisateur',
      editProfileDesc: 'Modification des données personnelles, photo de profil, coordonnées et identifiants',
      createUserTitle: 'Créer un Nouvel Utilisateur',
      createUserDesc: 'Enregistrement institutionnel d\'un nouveau compte maritime IMP',
      userPhoto: 'Photo de Profil de l\'Utilisateur',
      orSelectPreset: 'ou choisissez un avatar officiel:',
      orPasteUrl: 'Ou collez l\'URL de l\'image ici (https://...)',
      fullName: 'Nom Complet',
      corporateEmail: 'E-mail Professionnel',
      initialPassword: 'Mot de passe Initial',
      contactPhone: 'Téléphone de Contact',
      positionLabel: 'Poste / Fonction',
      departmentLabel: 'Département',
      rbacFunctionLabel: 'Rôle / Profil RBAC',
      rbacProtectedDesc: 'Les autorisations d\'accès au système (rôle RBAC) sont maintenues et protégées conformément au contrat institutionnel. La modification de la photo, du nom, de l\'email, du mot de passe et des coordonnées est autorisée.',
      saveChanges: 'Enregistrer les Modifications',
      registerUser: 'Inscrire l\'Utilisateur',
    },
    dashboard: {
      title: 'Tableau Général des Opérations Maritimes',
      subtitle: 'Surveillance en temps réel des accostages, flottes, inspections et facturations portuaires',
      activeBerths: 'Accostages Actifs',
      totalVessels: 'Navires Enregistrés',
      pendingInvoices: 'Factures En Attente',
      monthlyInspections: 'Inspections du Mois',
      recentBerthing: 'Mouvements Récents de Navires',
      quickActions: 'Actions Rapides',
      systemAlerts: 'Alertes Système',
    },
    vessels: {
      title: 'Registre des Navires',
      subtitle: 'Enregistrement et contrôle technique de la flotte de navires et embarcations portuaires',
      addVessel: 'Ajouter un Navire',
      imo: 'Numéro OMI',
      flag: 'Pavillon',
      type: 'Type de Navire',
      grossTonnage: 'Jauge Brute (GT)',
      agent: 'Agence Maritime',
      shipowner: 'Armateur',
    },
    invoicing: {
      title: 'Facturation & Tarifs Maritimes',
      subtitle: 'Émission et contrôle des factures de redevances, pilotage et accostage',
      newInvoice: 'Émettre une Nouvelle Facture',
      totalInvoiced: 'Total Facturé',
      paidInvoices: 'Factures Payées',
      pendingInvoices: 'Factures En Attente',
    },
    treasury: {
      title: 'Trésorerie & Contrôle Financier',
      subtitle: 'Gestion des flux de trésorerie, encaissements et rapprochements bancaires',
      currentBalance: 'Solde Actuel en Caisse',
      totalInflows: 'Entrées du Mois',
      totalOutflows: 'Sorties du Mois',
      newTransaction: 'Enregistrer une Transaction',
    },
    inspections: {
      title: 'Inspections Maritimes & Sécurité (PSC)',
      subtitle: 'Contrôle des visites techniques et sécurité des navires',
      newInspection: 'Nouvelle Inspection',
      approved: 'Approuvées',
      rejected: 'Avec Déficiences',
      inspector: 'Inspecteur Responsable',
    },
  },
  en: {
    header: {
      title: 'NHOMINCA',
      subtitle: 'Maritime & Port Institute of Guinea-Bissau',
      version: 'v1.0 • IMP',
      searchPlaceholder: 'Search IMO, Vessel, Berthing, or Invoice...',
      notifications: 'System Notifications',
      language: 'Language / Idioma / Langue',
      activeRole: 'Active Profile:',
      simulateRole: 'Simulate Role:',
      adminGeral: 'General Admin (IMP)',
      capitania: 'Harbor Master',
      tesouraria: 'Treasury & Invoicing',
      inspector: 'Maritime Inspection',
      agenteMaritimo: 'Shipping Agent',
      userFallback: 'IMP User',
      roleFallback: 'System Operator',
    },
    sidebar: {
      systemAndOverview: 'SYSTEM & OVERVIEW',
      portOperations: 'PORT OPERATIONS',
      financesAndRevenue: 'FINANCES & REVENUE',
      regulationAndSafety: 'REGULATION & SAFETY',
      administration: 'ADMINISTRATION',
      authentication: 'Authentication & Session',
      dashboard: 'Operational Dashboard',
      usersAndProfiles: 'Users & Profiles',
      vessels: 'Vessels',
      agencies: 'Maritime Agencies',
      shipowners: 'Shipowners',
      portsAndTerminals: 'Ports & Terminals',
      berthingAndCalls: 'Berthing & Calls',
      invoicing: 'Invoicing',
      treasury: 'Treasury',
      revenueRubrics: 'Revenue & Rubrics',
      inspections: 'Maritime Inspections',
      certificates: 'Certificates',
      licenses: 'Navigation Licenses',
      finesAndInfractions: 'Fines & Infractions',
      reportsAndStats: 'Reports & Statistics',
      configuration: 'Configuration',
      onPremServer: 'ON-PREMISES SERVER',
      serverActive: 'PostgreSQL 16 • Active',
    },
    common: {
      search: 'Search',
      filter: 'Filter',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      create: 'Create',
      activate: 'Activate',
      deactivate: 'Deactivate',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      total: 'Total',
      date: 'Date',
      actions: 'Actions',
      role: 'Role',
      department: 'Department',
      all: 'All',
      close: 'Close',
      upload: 'Upload',
      photo: 'Photo',
      name: 'Name',
      email: 'Email',
      password: 'Password',
      phone: 'Phone',
      position: 'Position',
      exportPdf: 'Export PDF',
      exportExcel: 'Export Excel',
      print: 'Print',
      you: 'You',
      securityPolicy: 'Security Policy',
      yes: 'Yes',
      no: 'No',
      details: 'Details',
      confirm: 'Confirm',
      loading: 'Loading...',
    },
    users: {
      title: 'User Management, Profiles & Access Control',
      subtitle: 'Management of institutional credentials, profile photos, contact details, and account activation/deactivation by Administrator',
      rbacModule: 'RBAC Module',
      editMyProfile: 'Edit My Profile',
      createNewUser: 'Create New User',
      totalUsers: 'Total Users',
      activeAccounts: 'Active Accounts',
      inactiveAccounts: 'Inactive Accounts',
      currentPrivilege: 'Current Privilege Level',
      totalDesc: 'Registered in IMP System',
      activeDesc: 'With granted access',
      inactiveDesc: 'Access suspended by Admin',
      privilegeDescAdmin: 'Full Power (Activate/Deactivate)',
      privilegeDescRestricted: 'Restricted Read & Operations',
      securityBannerTitle: 'Institutional Security Policy & Privileges',
      securityBannerDesc: 'Each user can update their profile photo, contact details, and password. The General Administrator has full control to activate or deactivate users at any time.',
      activeSession: 'Active Session:',
      filterRole: 'Role:',
      filterStatus: 'Status:',
      userAndPhoto: 'User & Photo',
      contacts: 'Contacts',
      roleRbac: 'Role / RBAC Profile',
      lastAccess: 'Last Access',
      actionsAndControl: 'Actions & Control',
      noUsersFound: 'No users found for the selected filters.',
      editProfileTitle: 'Edit User Profile',
      editProfileDesc: 'Update personal details, profile photo, contacts, and credentials',
      createUserTitle: 'Create New User',
      createUserDesc: 'Institutional registration for a new IMP maritime account',
      userPhoto: 'User Profile Photo',
      orSelectPreset: 'or select an official avatar:',
      orPasteUrl: 'Or paste image URL here (https://...)',
      fullName: 'Full Name',
      corporateEmail: 'Corporate Email',
      initialPassword: 'Initial Password',
      contactPhone: 'Contact Phone',
      positionLabel: 'Position / Role',
      departmentLabel: 'Department',
      rbacFunctionLabel: 'Role / RBAC Profile',
      rbacProtectedDesc: 'System access permissions (RBAC role) are protected according to institutional policies. Changing photo, name, email, password, and contact details is allowed.',
      saveChanges: 'Save Changes',
      registerUser: 'Register User',
    },
    dashboard: {
      title: 'General Maritime Operations Dashboard',
      subtitle: 'Real-time monitoring of berthing, fleets, inspections, and port invoicing',
      activeBerths: 'Active Berths',
      totalVessels: 'Registered Vessels',
      pendingInvoices: 'Pending Invoices',
      monthlyInspections: 'Monthly Inspections',
      recentBerthing: 'Recent Vessel Movements',
      quickActions: 'Quick Actions',
      systemAlerts: 'System Alerts',
    },
    vessels: {
      title: 'Vessel Registry',
      subtitle: 'Registration and technical monitoring of port vessels and fleet',
      addVessel: 'Add Vessel',
      imo: 'IMO Number',
      flag: 'Flag',
      type: 'Vessel Type',
      grossTonnage: 'Gross Tonnage (GT)',
      agent: 'Shipping Agency',
      shipowner: 'Shipowner',
    },
    invoicing: {
      title: 'Invoicing & Maritime Tariffs',
      subtitle: 'Issuance and management of dues, pilotage, and berthing invoices',
      newInvoice: 'Issue New Invoice',
      totalInvoiced: 'Total Invoiced',
      paidInvoices: 'Paid Invoices',
      pendingInvoices: 'Pending Invoices',
    },
    treasury: {
      title: 'Treasury & Financial Control',
      subtitle: 'Cash flow management, receipts, and bank reconciliation',
      currentBalance: 'Current Cash Balance',
      totalInflows: 'Monthly Inflows',
      totalOutflows: 'Monthly Outflows',
      newTransaction: 'Record Transaction',
    },
    inspections: {
      title: 'Maritime Inspections & Safety (PSC)',
      subtitle: 'Technical inspection and vessel safety monitoring',
      newInspection: 'New Inspection',
      approved: 'Approved',
      rejected: 'With Deficiencies',
      inspector: 'Inspector in Charge',
    },
  },
};
