export type DashboardStat = {
  label: string
  value: string
  note: string
}

export type BandSummary = {
  id: string
  name: string
  genre: string
  members: number
  rehearsalDay: string
  nextEvent: string
  status: string
}

export type MemberSummary = {
  id: string
  name: string
  role: string
  band: string
  status: string
  contact: string
}

export type InvitationSummary = {
  id: string
  email: string
  band: string
  role: string
  expiresAt: string
  status: string
}

export type SongSummary = {
  id: string
  title: string
  artist: string
  key: string
  bpm: number
  duration: string
  tags: string[]
  updatedAt: string
  lyrics: string
  chords: string
}

export type SetlistSummary = {
  id: string
  title: string
  band: string
  event: string
  songs: string[]
  duration: string
}

export type CalendarEvent = {
  id: string
  title: string
  type: string
  band: string
  when: string
  location: string
}

export type ProductFeature = {
  title: string
  description: string
}

export const dashboardStats: DashboardStat[] = [
  {
    label: "Песен в репертуаре",
    value: "148",
    note: "12 новых аранжировок за последний месяц",
  },
  {
    label: "Активных бендов",
    value: "4",
    note: "2 состава готовятся к ближайшим выступлениям",
  },
  {
    label: "Открытых приглашений",
    value: "7",
    note: "ожидают подтверждения от музыкантов",
  },
  {
    label: "Событий в календаре",
    value: "9",
    note: "репетиции, саундчеки и концерты на квартал",
  },
]

export const productFeatures: ProductFeature[] = [
  {
    title: "Единая база репертуара",
    description: "Песни, тексты, аккорды, ноты и версии аранжировок в одном месте.",
  },
  {
    title: "Управление бендами",
    description: "Составы, роли участников, приглашения и история активности по каждому бенду.",
  },
  {
    title: "Сетлисты и выступления",
    description: "Подготовка концертных программ, привязка к календарям и контроль готовности.",
  },
  {
    title: "Удобство на сцене и в дороге",
    description: "Адаптивный интерфейс для ноутбука, планшета и телефона без лишней перегрузки.",
  },
]

export const bands: BandSummary[] = [
  {
    id: "midnight-sound",
    name: "Midnight Sound",
    genre: "Pop Rock",
    members: 6,
    rehearsalDay: "Вт / Чт",
    nextEvent: "15 апреля · клуб Re:Public",
    status: "Готовится к концерту",
  },
  {
    id: "grace-notes",
    name: "Grace Notes",
    genre: "Worship / Acoustic",
    members: 5,
    rehearsalDay: "Ср",
    nextEvent: "20 апреля · городская сцена",
    status: "Новый сетлист в работе",
  },
  {
    id: "northern-lights",
    name: "Northern Lights",
    genre: "Indie Pop",
    members: 4,
    rehearsalDay: "Пн / Пт",
    nextEvent: "28 апреля · фестиваль Open Air",
    status: "Нужен гитарист на замену",
  },
]

export const members: MemberSummary[] = [
  {
    id: "m1",
    name: "Игорь Сидоров",
    role: "Лидер / вокал",
    band: "Midnight Sound",
    status: "Активен",
    contact: "igor@wband.local",
  },
  {
    id: "m2",
    name: "Анна Ковалёва",
    role: "Клавиши",
    band: "Grace Notes",
    status: "Активна",
    contact: "anna@wband.local",
  },
  {
    id: "m3",
    name: "Павел Романов",
    role: "Барабаны",
    band: "Midnight Sound",
    status: "Подтвердил участие",
    contact: "pavel@wband.local",
  },
  {
    id: "m4",
    name: "Мария Иванова",
    role: "Бэк-вокал",
    band: "Northern Lights",
    status: "Ожидает приглашение",
    contact: "maria@wband.local",
  },
]

export const invitations: InvitationSummary[] = [
  {
    id: "i1",
    email: "guitarist@example.com",
    band: "Northern Lights",
    role: "Электрогитара",
    expiresAt: "18 марта",
    status: "Отправлено",
  },
  {
    id: "i2",
    email: "violin@example.com",
    band: "Grace Notes",
    role: "Скрипка",
    expiresAt: "21 марта",
    status: "Ожидает ответа",
  },
  {
    id: "i3",
    email: "sound@example.com",
    band: "Midnight Sound",
    role: "Звукорежиссёр",
    expiresAt: "22 марта",
    status: "Черновик",
  },
]

export const songs: SongSummary[] = [
  {
    id: "city-lights",
    title: "City Lights",
    artist: "Midnight Sound",
    key: "Bm",
    bpm: 122,
    duration: "4:18",
    tags: ["Открытие", "Энергично", "Концерт"],
    updatedAt: "обновлено 2 дня назад",
    lyrics: "[Verse]\nГород дышит в такт шагам\nМы идём навстречу огням\n\n[Chorus]\nПодними глаза наверх\nТам наш свет и новый разбег",
    chords: "[Verse]\nBm  G  D  A\nBm  G  D  A\n\n[Chorus]\nG  D  A  Bm\nG  D  A",
  },
  {
    id: "come-home",
    title: "Come Home",
    artist: "Grace Notes",
    key: "G",
    bpm: 76,
    duration: "5:02",
    tags: ["Акустика", "Служение", "Лирика"],
    updatedAt: "обновлено неделю назад",
    lyrics: "[Verse]\nТихо падает свет на ладонь\nСнова слышу знакомый огонь\n\n[Bridge]\nСердце ищет твой голос в ночи",
    chords: "[Verse]\nG  D/F#  Em7  C\nG  D/F#  C\n\n[Bridge]\nEm7  C  G  D",
  },
  {
    id: "run-with-me",
    title: "Run With Me",
    artist: "Northern Lights",
    key: "F#m",
    bpm: 134,
    duration: "3:47",
    tags: ["Инди", "Фестиваль", "Синт"],
    updatedAt: "обновлено сегодня",
    lyrics: "[Verse]\nПульс на старте, шум дорог\nКаждый вдох как новый ток\n\n[Chorus]\nRun with me into the sound",
    chords: "[Verse]\nF#m  D  A  E\nF#m  D  A  E\n\n[Chorus]\nD  A  E  F#m",
  },
]

export const setlists: SetlistSummary[] = [
  {
    id: "spring-showcase",
    title: "Spring Showcase",
    band: "Midnight Sound",
    event: "15 апреля · клуб Re:Public",
    songs: ["City Lights", "Run With Me", "Come Home"],
    duration: "48 минут",
  },
  {
    id: "easter-service",
    title: "Easter Service",
    band: "Grace Notes",
    event: "20 апреля · городская сцена",
    songs: ["Come Home", "City Lights"],
    duration: "32 минуты",
  },
]

export const calendarEvents: CalendarEvent[] = [
  {
    id: "c1",
    title: "Общая репетиция",
    type: "Репетиция",
    band: "Midnight Sound",
    when: "13 апреля · 19:00",
    location: "Репточка #3",
  },
  {
    id: "c2",
    title: "Саундчек",
    type: "Подготовка",
    band: "Grace Notes",
    when: "20 апреля · 14:30",
    location: "Городская сцена",
  },
  {
    id: "c3",
    title: "Фестиваль Open Air",
    type: "Выступление",
    band: "Northern Lights",
    when: "28 апреля · 18:00",
    location: "Летняя площадка",
  },
]

export type RouteMeta = {
  section: string
  title: string
  description: string
}

const routeMatchers: Array<{
  match: (pathname: string) => boolean
  meta: RouteMeta
}> = [
  {
    match: (pathname) => pathname === "/app",
    meta: {
      section: "Рабочее пространство",
      title: "Обзор",
      description: "Сводка по репертуару, бендам, сетлистам и ближайшим событиям.",
    },
  },
  {
    match: (pathname) => pathname === "/bands",
    meta: {
      section: "Управление бендами",
      title: "Бенды",
      description: "Составы, статусы подготовки, репетиции и ближайшие выступления.",
    },
  },
  {
    match: (pathname) => pathname === "/members",
    meta: {
      section: "Управление бендами",
      title: "Участники",
      description: "Роли музыкантов, контакты и текущий статус участия в составах.",
    },
  },
  {
    match: (pathname) => pathname === "/invitations",
    meta: {
      section: "Управление бендами",
      title: "Приглашения",
      description: "Приглашения в бенд и контроль их статуса.",
    },
  },
  {
    match: (pathname) => pathname === "/songs",
    meta: {
      section: "Репертуар",
      title: "Песни",
      description: "Каталог песен с ключами, BPM, лирикой и аккордами.",
    },
  },
  {
    match: (pathname) => pathname.startsWith("/songs/"),
    meta: {
      section: "Репертуар",
      title: "Карточка песни",
      description: "Рабочая карточка песни с текстом, аккордами и базовой мета-информацией.",
    },
  },
  {
    match: (pathname) => pathname === "/setlists",
    meta: {
      section: "Выступления",
      title: "Сетлисты",
      description: "Подготовка программ и контроль длительности выступлений.",
    },
  },
  {
    match: (pathname) => pathname === "/calendar",
    meta: {
      section: "Выступления",
      title: "Календарь",
      description: "Календарь репетиций, саундчеков и концертов.",
    },
  },
]

export function getRouteMeta(pathname: string): RouteMeta {
  return (
    routeMatchers.find((route) => route.match(pathname))?.meta ?? {
      section: "Приложение",
      title: "Страница",
      description: "Раздел приложения для подготовки и проведения выступлений.",
    }
  )
}

export function getSongById(songId: string) {
  return songs.find((song) => song.id === songId)
}
