import { User, Course, Chapter, ChapterElement, TheoryContent, TestConfig, ArtifactTemplate, PracticalTask, ExtraMaterial, TaskSubmission, ExpertReview, ListenerProgress, Notification } from '../types';

export const users: User[] = [
  { id: 'u1', email: 'admin@airline.ru', fullName: 'Иванов Алексей Петрович', role: 'ADMIN' },
  { id: 'u2', email: 'expert1@airline.ru', fullName: 'Петрова Мария Сергеевна', role: 'EXPERT' },
  { id: 'u3', email: 'expert2@airline.ru', fullName: 'Сидоров Дмитрий Олегович', role: 'EXPERT' },
  { id: 'u4', email: 'listener1@airline.ru', fullName: 'Козлов Артём Викторович', role: 'LISTENER' },
  { id: 'u5', email: 'listener2@airline.ru', fullName: 'Новикова Елена Андреевна', role: 'LISTENER' },
  { id: 'u6', email: 'listener3@airline.ru', fullName: 'Морозов Кирилл Дмитриевич', role: 'LISTENER' },
];

export const course: Course = {
  id: 'c1',
  title: 'Обучающий курс для аналитиков авиакомпании',
  description: 'Комплексный курс по системному анализу в авиационной отрасли. 6 глав, от идеи до внедрения.',
  isActive: true,
};

export const chapters: Chapter[] = [
  {
    id: 'ch1', courseId: 'c1', order: 1,
    title: 'Идея и инициирование',
    lifecycleStage: 'Идея и инициирование',
    mainQuestion: 'Зачем создаём/меняем продукт?',
    topics: ['Бизнес-кейс', 'Stakeholder-анализ', 'Устав проекта', 'Инициация проекта'],
    icon: '💡',
  },
  {
    id: 'ch2', courseId: 'c1', order: 2,
    title: 'Сбор и анализ требований',
    lifecycleStage: 'Планирование',
    mainQuestion: 'Что именно нужно бизнесу?',
    topics: ['Интервью', 'Анкетирование', 'Анализ документов', 'Моделирование процессов AS-IS'],
    icon: '📋',
  },
  {
    id: 'ch3', courseId: 'c1', order: 3,
    title: 'Моделирование процессов',
    lifecycleStage: 'Проектирование',
    mainQuestion: 'Как будет работать решение?',
    topics: ['BPMN 2.0', 'UML', 'Use Case', 'Пользовательские истории'],
    icon: '🔄',
  },
  {
    id: 'ch4', courseId: 'c1', order: 4,
    title: 'Проектирование решения',
    lifecycleStage: 'Проектирование',
    mainQuestion: 'Как описать решение для разработки?',
    topics: ['SRS', 'Прототипирование', 'API-спецификация', 'Модель данных'],
    icon: '🏗️',
  },
  {
    id: 'ch5', courseId: 'c1', order: 5,
    title: 'Валидация и верификация',
    lifecycleStage: 'Тестирование',
    mainQuestion: 'Соответствует ли решение требованиям?',
    topics: ['UAT', 'Приёмочные тесты', 'Трассировка требований', 'Регрессионный анализ'],
    icon: '✅',
  },
  {
    id: 'ch6', courseId: 'c1', order: 6,
    title: 'Внедрение и сопровождение',
    lifecycleStage: 'Внедрение',
    mainQuestion: 'Как обеспечить успешный запуск?',
    topics: ['План внедрения', 'Обучение пользователей', 'Мониторинг', 'Обратная связь'],
    icon: '🚀',
  },
];

export const chapterElements: Record<string, ChapterElement[]> = {
  ch1: [
    { id: 'e1-1', chapterId: 'ch1', order: 1, type: 'THEORY', title: 'Теория: Инициация проекта' },
    { id: 'e1-2', chapterId: 'ch1', order: 2, type: 'TEST', title: 'Тест: Основы инициации' },
    { id: 'e1-3', chapterId: 'ch1', order: 3, type: 'ARTIFACT_OVERVIEW', title: 'Артефакт: Протокол встречи' },
    { id: 'e1-4', chapterId: 'ch1', order: 4, type: 'PRACTICAL_TASK', title: 'Задание: Извлечение требований' },
    { id: 'e1-5', chapterId: 'ch1', order: 5, type: 'EXPERT_REVIEW', title: 'Экспертная проверка' },
    { id: 'e1-6', chapterId: 'ch1', order: 6, type: 'EXTRA_MATERIALS', title: 'Дополнительные материалы' },
  ],
  ch2: [
    { id: 'e2-1', chapterId: 'ch2', order: 1, type: 'THEORY', title: 'Теория: Методы сбора требований' },
    { id: 'e2-2', chapterId: 'ch2', order: 2, type: 'TEST', title: 'Тест: Сбор требований' },
    { id: 'e2-3', chapterId: 'ch2', order: 3, type: 'ARTIFACT_OVERVIEW', title: 'Артефакт: Бриф интервью' },
    { id: 'e2-4', chapterId: 'ch2', order: 4, type: 'PRACTICAL_TASK', title: 'Задание: Проведение интервью' },
    { id: 'e2-5', chapterId: 'ch2', order: 5, type: 'EXPERT_REVIEW', title: 'Экспертная проверка' },
    { id: 'e2-6', chapterId: 'ch2', order: 6, type: 'EXTRA_MATERIALS', title: 'Дополнительные материалы' },
  ],
  ch3: [
    { id: 'e3-1', chapterId: 'ch3', order: 1, type: 'THEORY', title: 'Теория: BPMN и UML' },
    { id: 'e3-2', chapterId: 'ch3', order: 2, type: 'TEST', title: 'Тест: Моделирование' },
    { id: 'e3-3', chapterId: 'ch3', order: 3, type: 'ARTIFACT_OVERVIEW', title: 'Артефакт: Диаграмма BPMN' },
    { id: 'e3-4', chapterId: 'ch3', order: 4, type: 'PRACTICAL_TASK', title: 'Задание: Модель процесса' },
    { id: 'e3-5', chapterId: 'ch3', order: 5, type: 'EXPERT_REVIEW', title: 'Экспертная проверка' },
    { id: 'e3-6', chapterId: 'ch3', order: 6, type: 'EXTRA_MATERIALS', title: 'Дополнительные материалы' },
  ],
  ch4: [
    { id: 'e4-1', chapterId: 'ch4', order: 1, type: 'THEORY', title: 'Теория: SRS и прототипы' },
    { id: 'e4-2', chapterId: 'ch4', order: 2, type: 'TEST', title: 'Тест: Проектирование' },
    { id: 'e4-3', chapterId: 'ch4', order: 3, type: 'ARTIFACT_OVERVIEW', title: 'Артефакт: SRS-документ' },
    { id: 'e4-4', chapterId: 'ch4', order: 4, type: 'PRACTICAL_TASK', title: 'Задание: Спецификация' },
    { id: 'e4-5', chapterId: 'ch4', order: 5, type: 'EXPERT_REVIEW', title: 'Экспертная проверка' },
    { id: 'e4-6', chapterId: 'ch4', order: 6, type: 'EXTRA_MATERIALS', title: 'Дополнительные материалы' },
  ],
  ch5: [
    { id: 'e5-1', chapterId: 'ch5', order: 1, type: 'THEORY', title: 'Теория: Валидация требований' },
    { id: 'e5-2', chapterId: 'ch5', order: 2, type: 'TEST', title: 'Тест: Тестирование' },
    { id: 'e5-3', chapterId: 'ch5', order: 3, type: 'ARTIFACT_OVERVIEW', title: 'Артефакт: Матрица трассировки' },
    { id: 'e5-4', chapterId: 'ch5', order: 4, type: 'PRACTICAL_TASK', title: 'Задание: UAT-сценарии' },
    { id: 'e5-5', chapterId: 'ch5', order: 5, type: 'EXPERT_REVIEW', title: 'Экспертная проверка' },
    { id: 'e5-6', chapterId: 'ch5', order: 6, type: 'EXTRA_MATERIALS', title: 'Дополнительные материалы' },
  ],
  ch6: [
    { id: 'e6-1', chapterId: 'ch6', order: 1, type: 'THEORY', title: 'Теория: Внедрение систем' },
    { id: 'e6-2', chapterId: 'ch6', order: 2, type: 'TEST', title: 'Тест: Внедрение' },
    { id: 'e6-3', chapterId: 'ch6', order: 3, type: 'ARTIFACT_OVERVIEW', title: 'Артефакт: План внедрения' },
    { id: 'e6-4', chapterId: 'ch6', order: 4, type: 'PRACTICAL_TASK', title: 'Задание: План запуска' },
    { id: 'e6-5', chapterId: 'ch6', order: 5, type: 'EXPERT_REVIEW', title: 'Экспертная проверка' },
    { id: 'e6-6', chapterId: 'ch6', order: 6, type: 'EXTRA_MATERIALS', title: 'Дополнительные материалы' },
  ],
};

export const theoryContents: Record<string, TheoryContent> = {
  'e1-1': {
    elementId: 'e1-1', videoUrl: '', videoDurationSec: 1800, videoTitle: 'Инициация проекта в авиации',
    presentationFileUrl: '', minWatchPercent: 80,
    content: '## Инициация проекта\n\nВ авиационной отрасли инициация проекта — критический этап. Любой новый продукт или изменение существующего должны пройти через формальную процедуру одобрения.\n\n### Ключевые шаги:\n1. **Определение бизнес-потребности** — зачем мы это делаем?\n2. **Анализ стейкхолдеров** — кто влияет на проект?\n3. **Создание устава проекта** — формальное разрешение на работу\n4. **Оценка осуществимости** — технически и экономически возможно?\n\n### Особенности авиации:\n- Жёсткое регулирование (ФАП, ICAO, EASA)\n- Высокие требования к безопасности\n- Длительные циклы согласования\n- Множество внешних стейкхолдеров'
  },
  'e2-1': {
    elementId: 'e2-1', videoUrl: '', videoDurationSec: 2400, videoTitle: 'Методы сбора требований',
    presentationFileUrl: '', minWatchPercent: 80,
    content: '## Методы сбора требований\n\n### Интервью\nОсновной метод. Готовьте план, записывайте, уточняйте.\n\n### Анкетирование\nДля массового сбора. Используйте закрытые и открытые вопросы.\n\n### Анализ документов\nИзучите регламенты, инструкции, отчёты.\n\n### Наблюдение\nПобудьте рядом с пользователем, посмотрите как он работает.\n\n### Мозговой штурм\nГенерация идей с командой.\n\n### Прототипирование\nПокажите макет — получите обратную связь.'
  },
  'e3-1': {
    elementId: 'e3-1', videoUrl: '', videoDurationSec: 2100, videoTitle: 'BPMN и UML для аналитика',
    presentationFileUrl: '', minWatchPercent: 80,
    content: '## Моделирование бизнес-процессов\n\n### BPMN 2.0\nСтандарт описания бизнес-процессов. Ключевые элементы:\n- **События** (start, intermediate, end)\n- **Задачи** (user, service, script)\n- **Шлюзы** (exclusive, parallel, inclusive)\n- **Дорожки** (pool, lane)\n\n### UML\n- **Use Case Diagram** — кто и что делает\n- **Activity Diagram** — поток действий\n- **Sequence Diagram** — взаимодействие объектов\n- **Class Diagram** — структура данных'
  },
  'e4-1': {
    elementId: 'e4-1', videoUrl: '', videoDurationSec: 2700, videoTitle: 'Спецификация требований (SRS)',
    presentationFileUrl: '', minWatchPercent: 80,
    content: '## Спецификация требований (SRS)\n\n### Структура SRS (IEEE 830):\n1. Введение (цель, объём, определения)\n2. Общее описание (контекст, ограничения)\n3. Конкретные требования\n   - Функциональные\n   - Нефункциональные\n   - Интерфейсные\n\n### Прототипирование:\n- Low-fi (wireframes)\n- Hi-fi (интерактивные макеты)\n- Инструменты: Figma, Axure, Balsamiq'
  },
  'e5-1': {
    elementId: 'e5-1', videoUrl: '', videoDurationSec: 1500, videoTitle: 'Валидация и верификация',
    presentationFileUrl: '', minWatchPercent: 80,
    content: '## Валидация vs Верификация\n\n**Верификация**: «Мы построили систему правильно?» (соответствие спецификации)\n**Валидация**: «Мы построили правильную систему?» (соответствие потребностям)\n\n### Методы:\n- Инспекции и ревью\n- Прототип-тестирование\n- UAT (User Acceptance Testing)\n- Матрица трассировки требований'
  },
  'e6-1': {
    elementId: 'e6-1', videoUrl: '', videoDurationSec: 1800, videoTitle: 'Внедрение информационных систем',
    presentationFileUrl: '', minWatchPercent: 80,
    content: '## Внедрение и сопровождение\n\n### Стратегии внедрения:\n- **Прямое** (big bang) — рискованно, быстро\n- **Параллельное** — безопасно, дорого\n- **Поэтапное** — баланс риска и стоимости\n- **Пилотное** — тест на малой группе\n\n### План внедрения:\n1. Подготовка инфраструктуры\n2. Миграция данных\n3. Обучение пользователей\n4. Промышленный запуск\n5. Пост-релизная поддержка'
  },
};

export const testConfigs: Record<string, TestConfig> = {
  'e1-2': {
    elementId: 'e1-2', passingScore: 80, maxAttempts: 3, timeLimitMin: 15,
    questions: [
      { id: 'q1', order: 1, questionText: 'Что является первым шагом инициации проекта?', type: 'SINGLE_CHOICE', options: [{ id: 'a', text: 'Создание устава' }, { id: 'b', text: 'Определение бизнес-потребности' }, { id: 'c', text: 'Набор команды' }, { id: 'd', text: 'Выбор методологии' }], correctOptionIds: ['b'], explanation: 'Сначала определяем зачем, потом формализуем.' },
      { id: 'q2', order: 2, questionText: 'Какой документ формально разрешает начало проекта?', type: 'SINGLE_CHOICE', options: [{ id: 'a', text: 'Бизнес-план' }, { id: 'b', text: 'Устав проекта' }, { id: 'c', text: 'Техническое задание' }, { id: 'd', text: 'Протокол встречи' }], correctOptionIds: ['b'], explanation: 'Устав проекта (Project Charter) — формальное разрешение.' },
      { id: 'q3', order: 3, questionText: 'В авиации стейкхолдерами могут быть:', type: 'MULTIPLE_CHOICE', options: [{ id: 'a', text: 'Регулятор (Росавиация)' }, { id: 'b', text: 'Пассажиры' }, { id: 'c', text: 'Пилоты' }, { id: 'd', text: 'Все перечисленные' }], correctOptionIds: ['d'], explanation: 'Все перечисленные являются стейкхолдерами.' },
      { id: 'q4', order: 4, questionText: 'Оценка осуществимости включает технический и экономический анализ.', type: 'TRUE_FALSE', options: [{ id: 'a', text: 'Верно' }, { id: 'b', text: 'Неверно' }], correctOptionIds: ['a'], explanation: 'Да, feasibility study включает оба аспекта.' },
    ]
  },
  'e2-2': {
    elementId: 'e2-2', passingScore: 80, maxAttempts: 3, timeLimitMin: 15,
    questions: [
      { id: 'q5', order: 1, questionText: 'Какой метод лучше для массового сбора данных?', type: 'SINGLE_CHOICE', options: [{ id: 'a', text: 'Интервью' }, { id: 'b', text: 'Анкетирование' }, { id: 'c', text: 'Наблюдение' }, { id: 'd', text: 'Мозговой штурм' }], correctOptionIds: ['b'], explanation: 'Анкетирование масштабируется на большую аудиторию.' },
      { id: 'q6', order: 2, questionText: 'При интервью важно:', type: 'MULTIPLE_CHOICE', options: [{ id: 'a', text: 'Подготовить план вопросов' }, { id: 'b', text: 'Записывать ответы' }, { id: 'c', text: 'Перебивать собеседника' }, { id: 'd', text: 'Задавать уточняющие вопросы' }], correctOptionIds: ['a', 'b', 'd'], explanation: 'Перебивать — плохая практика.' },
      { id: 'q7', order: 3, questionText: 'Анализ документов — это пассивный метод сбора требований.', type: 'TRUE_FALSE', options: [{ id: 'a', text: 'Верно' }, { id: 'b', text: 'Неверно' }], correctOptionIds: ['a'], explanation: 'Документы уже существуют, аналитик их изучает.' },
    ]
  },
  'e3-2': {
    elementId: 'e3-2', passingScore: 80, maxAttempts: 3, timeLimitMin: 20,
    questions: [
      { id: 'q8', order: 1, questionText: 'BPMN расшифровывается как:', type: 'SINGLE_CHOICE', options: [{ id: 'a', text: 'Business Process Model and Notation' }, { id: 'b', text: 'Business Protocol Management Network' }, { id: 'c', text: 'Basic Process Mapping Notation' }, { id: 'd', text: 'Business Performance Measurement Network' }], correctOptionIds: ['a'], explanation: 'Business Process Model and Notation — стандарт OMG.' },
      { id: 'q9', order: 2, questionText: 'Какие элементы НЕ относятся к BPMN?', type: 'MULTIPLE_CHOICE', options: [{ id: 'a', text: 'Событие' }, { id: 'b', text: 'Класс' }, { id: 'c', text: 'Шлюз' }, { id: 'd', text: 'Наследование' }], correctOptionIds: ['b', 'd'], explanation: 'Класс и наследование — из UML Class Diagram.' },
      { id: 'q10', order: 3, questionText: 'Use Case Diagram показывает взаимодействие актёров с системой.', type: 'TRUE_FALSE', options: [{ id: 'a', text: 'Верно' }, { id: 'b', text: 'Неверно' }], correctOptionIds: ['a'], explanation: 'Use Case описывает функциональность с точки зрения пользователей.' },
    ]
  },
  'e4-2': {
    elementId: 'e4-2', passingScore: 80, maxAttempts: 3, timeLimitMin: 15,
    questions: [
      { id: 'q11', order: 1, questionText: 'Стандарт IEEE 830 описывает:', type: 'SINGLE_CHOICE', options: [{ id: 'a', text: 'Управление проектами' }, { id: 'b', text: 'Спецификацию требований к ПО' }, { id: 'c', text: 'Тестирование ПО' }, { id: 'd', text: 'Архитектуру систем' }], correctOptionIds: ['b'], explanation: 'IEEE 830 — Recommended Practice for Software Requirements Specifications.' },
      { id: 'q12', order: 2, questionText: 'Нефункциональные требования включают:', type: 'MULTIPLE_CHOICE', options: [{ id: 'a', text: 'Производительность' }, { id: 'b', text: 'Безопасность' }, { id: 'c', text: 'Расчёт стоимости билета' }, { id: 'd', text: 'Надёжность' }], correctOptionIds: ['a', 'b', 'd'], explanation: 'Расчёт стоимости — функциональное требование.' },
    ]
  },
  'e5-2': {
    elementId: 'e5-2', passingScore: 80, maxAttempts: 3, timeLimitMin: 15,
    questions: [
      { id: 'q13', order: 1, questionText: 'Валидация отвечает на вопрос:', type: 'SINGLE_CHOICE', options: [{ id: 'a', text: 'Мы построили систему правильно?' }, { id: 'b', text: 'Мы построили правильную систему?' }, { id: 'c', text: 'Сколько это стоит?' }, { id: 'd', text: 'Кто будет использовать?' }], correctOptionIds: ['b'], explanation: 'Валидация = построили ли мы то, что нужно пользователю.' },
      { id: 'q14', order: 2, questionText: 'Матрица трассировки связывает требования с тест-кейсами.', type: 'TRUE_FALSE', options: [{ id: 'a', text: 'Верно' }, { id: 'b', text: 'Неверно' }], correctOptionIds: ['a'], explanation: 'Трассировка обеспечивает покрытие всех требований тестами.' },
    ]
  },
  'e6-2': {
    elementId: 'e6-2', passingScore: 80, maxAttempts: 3, timeLimitMin: 15,
    questions: [
      { id: 'q15', order: 1, questionText: 'Пилотное внедрение — это:', type: 'SINGLE_CHOICE', options: [{ id: 'a', text: 'Запуск для всех пользователей сразу' }, { id: 'b', text: 'Тест на ограниченной группе' }, { id: 'c', text: 'Параллельная работа двух систем' }, { id: 'd', text: 'Поэтапный запуск модулей' }], correctOptionIds: ['b'], explanation: 'Пилот — тестирование на малой группе перед полным запуском.' },
      { id: 'q16', order: 2, questionText: 'Какие стратегии внедрения существуют?', type: 'MULTIPLE_CHOICE', options: [{ id: 'a', text: 'Прямое' }, { id: 'b', text: 'Параллельное' }, { id: 'c', text: 'Случайное' }, { id: 'd', text: 'Поэтапное' }], correctOptionIds: ['a', 'b', 'd'], explanation: 'Случайного внедрения не существует.' },
    ]
  },
};

export const artifactTemplates: Record<string, ArtifactTemplate> = {
  'e1-3': { elementId: 'e1-3', title: 'Протокол встречи по инициации', description: 'Шаблон протокола установочной встречи проекта. Включает разделы: участники, повестка, решения, действия.', templateFileUrl: '#', externalLink: 'https://confluence.example.com/templates/meeting-protocol' },
  'e2-3': { elementId: 'e2-3', title: 'Бриф интервью', description: 'Шаблон подготовки к интервью со стейкхолдером. Цели, вопросы, ожидаемые артефакты.', templateFileUrl: '#', externalLink: 'https://confluence.example.com/templates/interview-brief' },
  'e3-3': { elementId: 'e3-3', title: 'Диаграмма BPMN', description: 'Шаблон для создания диаграммы бизнес-процесса в нотации BPMN 2.0.', templateFileUrl: '#', externalLink: 'https://miro.com/templates/bpmn' },
  'e4-3': { elementId: 'e4-3', title: 'SRS-документ', description: 'Шаблон спецификации требований по стандарту IEEE 830.', templateFileUrl: '#', externalLink: 'https://confluence.example.com/templates/srs' },
  'e5-3': { elementId: 'e5-3', title: 'Матрица трассировки', description: 'Excel-шаблон для трассировки требований к тест-кейсам и артефактам.', templateFileUrl: '#', externalLink: 'https://confluence.example.com/templates/traceability' },
  'e6-3': { elementId: 'e6-3', title: 'План внедрения', description: 'Шаблон плана внедрения информационной системы с контрольными точками.', templateFileUrl: '#', externalLink: 'https://confluence.example.com/templates/deployment-plan' },
};

export const practicalTasks: Record<string, PracticalTask> = {
  'e1-4': {
    elementId: 'e1-4', title: 'Извлечение требований из встречи',
    contextText: 'Вы — аналитик авиакомпании «Аэролайн». Прошла установочная встреча по проекту «Модуль онлайн-регистрации». Вам предоставлена стенограмма встречи. Необходимо извлечь требования, идентифицировать стейкхолдеров и составить краткий протокол.',
    inputMaterials: [
      { name: 'Стенограмма встречи.pdf', type: 'pdf', url: '#' },
      { name: 'Список участников.xlsx', type: 'xlsx', url: '#' },
    ],
    rubric: [
      { id: 'r1-1', name: 'Полнота требований', description: 'Все ключевые требования извлечены', maxPoints: 30 },
      { id: 'r1-2', name: 'Классификация', description: 'Требования разделены на функциональные/нефункциональные', maxPoints: 20 },
      { id: 'r1-3', name: 'Стейкхолдеры', description: 'Идентифицированы все стейкхолдеры', maxPoints: 20 },
      { id: 'r1-4', name: 'Формат протокола', description: 'Соответствует шаблону', maxPoints: 15 },
      { id: 'r1-5', name: 'Качество формулировок', description: 'Требования SMART', maxPoints: 15 },
    ],
    assignedExpertId: 'u2',
  },
  'e2-4': {
    elementId: 'e2-4', title: 'Проведение интервью с стейкхолдером',
    contextText: 'Подготовьте и проведите (симуляция) интервью с руководителем службы бортового питания. Цель — выявить требования к новой системе учёта catering-заказов.',
    inputMaterials: [
      { name: 'Профиль стейкхолдера.pdf', type: 'pdf', url: '#' },
      { name: 'Текущий регламент.pdf', type: 'pdf', url: '#' },
    ],
    rubric: [
      { id: 'r2-1', name: 'Подготовка', description: 'План интервью, цели, гипотезы', maxPoints: 25 },
      { id: 'r2-2', name: 'Вопросы', description: 'Открытые/закрытые, логическая последовательность', maxPoints: 25 },
      { id: 'r2-3', name: 'Результаты', description: 'Извлечённые требования и инсайты', maxPoints: 30 },
      { id: 'r2-4', name: 'Документирование', description: 'Оформление результатов', maxPoints: 20 },
    ],
    assignedExpertId: 'u3',
  },
  'e3-4': {
    elementId: 'e3-4', title: 'Моделирование процесса регистрации',
    contextText: 'Смоделируйте бизнес-процесс «Онлайн-регистрация пассажира» в нотации BPMN 2.0. Процесс должен включать: выбор рейса, ввод данных, выбор места, оплату багажа, получение boarding pass.',
    inputMaterials: [
      { name: 'Описание процесса AS-IS.pdf', type: 'pdf', url: '#' },
      { name: 'Скриншоты текущего интерфейса.png', type: 'png', url: '#' },
    ],
    rubric: [
      { id: 'r3-1', name: 'Корректность BPMN', description: 'Правильное использование элементов нотации', maxPoints: 30 },
      { id: 'r3-2', name: 'Полнота', description: 'Все шаги процесса отражены', maxPoints: 25 },
      { id: 'r3-3', name: 'Альтернативные сценарии', description: 'Обработаны исключения', maxPoints: 25 },
      { id: 'r3-4', name: 'Дорожки', description: 'Корректное распределение по участникам', maxPoints: 20 },
    ],
    assignedExpertId: 'u2',
  },
  'e4-4': {
    elementId: 'e4-4', title: 'Написание SRS для модуля уведомлений',
    contextText: 'Напишите спецификацию требований (SRS) для модуля push-уведомлений в мобильном приложении авиакомпании. Включите функциональные и нефункциональные требования.',
    inputMaterials: [
      { name: 'Бизнес-требования.pdf', type: 'pdf', url: '#' },
      { name: 'Прототип экрана.png', type: 'png', url: '#' },
    ],
    rubric: [
      { id: 'r4-1', name: 'Структура SRS', description: 'Соответствие IEEE 830', maxPoints: 20 },
      { id: 'r4-2', name: 'Функциональные требования', description: 'Полнота и корректность', maxPoints: 30 },
      { id: 'r4-3', name: 'Нефункциональные требования', description: 'Производительность, безопасность', maxPoints: 25 },
      { id: 'r4-4', name: 'Качество формулировок', description: 'Однозначность, тестируемость', maxPoints: 25 },
    ],
    assignedExpertId: 'u3',
  },
  'e5-4': {
    elementId: 'e5-4', title: 'Разработка UAT-сценариев',
    contextText: 'Разработайте сценарии приёмочного тестирования (UAT) для функции «Управление бронированием». Включите позитивные и негативные сценарии.',
    inputMaterials: [
      { name: 'SRS модуля бронирования.pdf', type: 'pdf', url: '#' },
      { name: 'Матрица трассировки.xlsx', type: 'xlsx', url: '#' },
    ],
    rubric: [
      { id: 'r5-1', name: 'Покрытие требований', description: 'Все требования покрыты', maxPoints: 30 },
      { id: 'r5-2', name: 'Качество шагов', description: 'Чёткие предусловия, шаги, ожидаемый результат', maxPoints: 30 },
      { id: 'r5-3', name: 'Негативные сценарии', description: 'Обработка ошибок и граничных случаев', maxPoints: 25 },
      { id: 'r5-4', name: 'Формат', description: 'Соответствие шаблону', maxPoints: 15 },
    ],
    assignedExpertId: 'u2',
  },
  'e6-4': {
    elementId: 'e6-4', title: 'План внедрения системы управления полётами',
    contextText: 'Составьте план внедрения новой системы управления полётными данными. Выберите стратегию, определите этапы, риски и план обучения.',
    inputMaterials: [
      { name: 'Техническая архитектура.pdf', type: 'pdf', url: '#' },
      { name: 'Список аэропортов-пилотов.xlsx', type: 'xlsx', url: '#' },
    ],
    rubric: [
      { id: 'r6-1', name: 'Выбор стратегии', description: 'Обоснование выбора', maxPoints: 20 },
      { id: 'r6-2', name: 'Этапы', description: 'Детализация и сроки', maxPoints: 25 },
      { id: 'r6-3', name: 'Управление рисками', description: 'Идентификация и митигация', maxPoints: 25 },
      { id: 'r6-4', name: 'План обучения', description: 'Программа для пользователей', maxPoints: 15 },
      { id: 'r6-5', name: 'KPI успеха', description: 'Метрики успешного внедрения', maxPoints: 15 },
    ],
    assignedExpertId: 'u3',
  },
};

export const extraMaterials: Record<string, ExtraMaterial[]> = {
  'e1-6': [
    { id: 'm1', elementId: 'e1-6', title: 'PMBOK Guide — Глава 4: Инициация', url: '#', type: 'BOOK' },
    { id: 'm2', elementId: 'e1-6', title: 'BABOK Guide — Task: Define Business Problem', url: '#', type: 'REGULATION' },
    { id: 'm3', elementId: 'e1-6', title: 'Шаблон устава проекта (IATA)', url: '#', type: 'REGULATION' },
  ],
  'e2-6': [
    { id: 'm4', elementId: 'e2-6', title: '«Спасибо за интервью» — Купер', url: '#', type: 'BOOK' },
    { id: 'm5', elementId: 'e2-6', title: 'Глоссарий IIBA: термины сбора требований', url: '#', type: 'GLOSSARY' },
    { id: 'm6', elementId: 'e2-6', title: 'Чек-лист подготовки к интервью', url: '#', type: 'ARTICLE' },
  ],
  'e3-6': [
    { id: 'm7', elementId: 'e3-6', title: 'BPMN 2.0 Reference Guide', url: '#', type: 'BOOK' },
    { id: 'm8', elementId: 'e3-6', title: 'UML Distilled — Martin Fowler', url: '#', type: 'BOOK' },
    { id: 'm9', elementId: 'e3-6', title: 'Справочник нотации BPMN', url: '#', type: 'GLOSSARY' },
  ],
  'e4-6': [
    { id: 'm10', elementId: 'e4-6', title: 'IEEE 830-1998 Standard', url: '#', type: 'REGULATION' },
    { id: 'm11', elementId: 'e4-6', title: 'Примеры SRS из авиационных проектов', url: '#', type: 'ARTICLE' },
    { id: 'm12', elementId: 'e4-6', title: 'Figma для аналитика: гайд', url: '#', type: 'ARTICLE' },
  ],
  'e5-6': [
    { id: 'm13', elementId: 'e5-6', title: 'ISTQB Foundation — Syllabus', url: '#', type: 'BOOK' },
    { id: 'm14', elementId: 'e5-6', title: 'Матрица трассировки: best practices', url: '#', type: 'ARTICLE' },
    { id: 'm15', elementId: 'e5-6', title: 'Глоссарий тестирования (ISTQB)', url: '#', type: 'GLOSSARY' },
  ],
  'e6-6': [
    { id: 'm16', elementId: 'e6-6', title: 'ADKAR Model для управления изменениями', url: '#', type: 'BOOK' },
    { id: 'm17', elementId: 'e6-6', title: 'ITIL v4 — Release Management', url: '#', type: 'REGULATION' },
    { id: 'm18', elementId: 'e6-6', title: 'Чек-лист готовности к внедрению', url: '#', type: 'ARTICLE' },
  ],
};

export const initialProgress: Record<string, ListenerProgress[]> = {
  u4: [
    { chapterId: 'ch1', theoryWatchedPercent: 100, testPassed: true, testScore: 85, testAttempts: 1, taskAccepted: true, unlocked: true },
    { chapterId: 'ch2', theoryWatchedPercent: 100, testPassed: true, testScore: 90, testAttempts: 1, taskAccepted: false, unlocked: true },
    { chapterId: 'ch3', theoryWatchedPercent: 65, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: true },
    { chapterId: 'ch4', theoryWatchedPercent: 0, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: false },
    { chapterId: 'ch5', theoryWatchedPercent: 0, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: false },
    { chapterId: 'ch6', theoryWatchedPercent: 0, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: false },
  ],
  u5: [
    { chapterId: 'ch1', theoryWatchedPercent: 100, testPassed: true, testScore: 95, testAttempts: 1, taskAccepted: true, unlocked: true },
    { chapterId: 'ch2', theoryWatchedPercent: 100, testPassed: true, testScore: 80, testAttempts: 2, taskAccepted: true, unlocked: true },
    { chapterId: 'ch3', theoryWatchedPercent: 100, testPassed: true, testScore: 85, testAttempts: 1, taskAccepted: true, unlocked: true },
    { chapterId: 'ch4', theoryWatchedPercent: 100, testPassed: true, testScore: 90, testAttempts: 1, taskAccepted: true, unlocked: true },
    { chapterId: 'ch5', theoryWatchedPercent: 40, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: true },
    { chapterId: 'ch6', theoryWatchedPercent: 0, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: false },
  ],
  u6: [
    { chapterId: 'ch1', theoryWatchedPercent: 100, testPassed: true, testScore: 80, testAttempts: 1, taskAccepted: true, unlocked: true },
    { chapterId: 'ch2', theoryWatchedPercent: 30, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: true },
    { chapterId: 'ch3', theoryWatchedPercent: 0, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: false },
    { chapterId: 'ch4', theoryWatchedPercent: 0, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: false },
    { chapterId: 'ch5', theoryWatchedPercent: 0, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: false },
    { chapterId: 'ch6', theoryWatchedPercent: 0, testPassed: false, testScore: 0, testAttempts: 0, taskAccepted: false, unlocked: false },
  ],
};

export const submissions: TaskSubmission[] = [
  {
    id: 'sub1', listenerId: 'u4', taskId: 'e2-4', attemptNumber: 1,
    files: [{ name: 'Результаты_интервью.docx', size: 245000, url: '#' }],
    externalLinks: ['https://miro.com/board123'],
    comment: 'Выполнил задание. Провёл интервью с руководителем службы питания.',
    status: 'ON_REVIEW', submittedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'sub2', listenerId: 'u6', taskId: 'e1-4', attemptNumber: 2,
    files: [{ name: 'Протокол_встречи_v2.docx', size: 180000, url: '#' }],
    externalLinks: [],
    comment: 'Исправил замечания эксперта, добавил классификацию требований.',
    status: 'ACCEPTED', submittedAt: '2024-01-10T14:00:00Z',
  },
];

export const reviews: ExpertReview[] = [
  {
    id: 'rev1', submissionId: 'sub2', expertId: 'u2', status: 'ACCEPTED',
    scores: { 'r1-1': 28, 'r1-2': 18, 'r1-3': 20, 'r1-4': 14, 'r1-5': 13 },
    totalScore: 93, feedbackComment: 'Отличная работа! Все требования извлечены, классификация корректная.',
    reviewedAt: '2024-01-11T09:00:00Z',
  },
];

export const notifications: Notification[] = [
  { id: 'n1', userId: 'u2', title: 'Новая работа на проверке', message: 'Козлов А.В. загрузил работу «Проведение интервью»', read: false, createdAt: '2024-01-15T10:35:00Z', type: 'review_request' },
  { id: 'n2', userId: 'u4', title: 'Работа принята', message: 'Ваша работа по главе 1 принята экспертом', read: true, createdAt: '2024-01-11T09:05:00Z', type: 'accepted' },
  { id: 'n3', userId: 'u4', title: 'Тест доступен', message: 'Тест по главе 2 разблокирован', read: true, createdAt: '2024-01-12T08:00:00Z', type: 'test_available' },
];
