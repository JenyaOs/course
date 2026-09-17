export type Role = 'LISTENER' | 'EXPERT' | 'ADMIN';

export type ChapterElementType = 'THEORY' | 'TEST' | 'ARTIFACT_OVERVIEW' | 'PRACTICAL_TASK' | 'EXPERT_REVIEW' | 'EXTRA_MATERIALS';

export type QuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'ON_REVIEW' | 'NEEDS_REWORK' | 'ACCEPTED';

export type ReviewStatus = 'ACCEPTED' | 'NEEDS_REWORK';

export type MaterialType = 'ARTICLE' | 'GLOSSARY' | 'REGULATION' | 'BOOK';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatar?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

export interface Chapter {
  id: string;
  courseId: string;
  order: number;
  title: string;
  lifecycleStage: string;
  mainQuestion: string;
  topics: string[];
  icon: string;
}

export interface ChapterElement {
  id: string;
  chapterId: string;
  order: number;
  type: ChapterElementType;
  title: string;
}

export interface TheoryContent {
  elementId: string;
  videoUrl: string;
  videoDurationSec: number;
  videoTitle: string;
  presentationFileUrl: string;
  minWatchPercent: number;
  content: string;
}

export interface TestQuestion {
  id: string;
  order: number;
  questionText: string;
  type: QuestionType;
  options: { id: string; text: string }[];
  correctOptionIds: string[];
  explanation: string;
}

export interface TestConfig {
  elementId: string;
  passingScore: number;
  maxAttempts: number;
  timeLimitMin: number;
  questions: TestQuestion[];
}

export interface ArtifactTemplate {
  elementId: string;
  title: string;
  description: string;
  templateFileUrl: string;
  externalLink: string;
  exampleImage?: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
}

export interface PracticalTask {
  elementId: string;
  title: string;
  contextText: string;
  inputMaterials: { name: string; type: string; url: string }[];
  rubric: RubricCriterion[];
  assignedExpertId: string;
}

export interface TaskSubmission {
  id: string;
  listenerId: string;
  taskId: string;
  attemptNumber: number;
  files: { name: string; size: number; url: string }[];
  externalLinks: string[];
  comment: string;
  status: SubmissionStatus;
  submittedAt: string;
}

export interface ExpertReview {
  id: string;
  submissionId: string;
  expertId: string;
  status: ReviewStatus;
  scores: Record<string, number>;
  totalScore: number;
  feedbackComment: string;
  reviewedAt: string;
}

export interface ListenerProgress {
  chapterId: string;
  theoryWatchedPercent: number;
  testPassed: boolean;
  testScore: number;
  testAttempts: number;
  taskAccepted: boolean;
  unlocked: boolean;
}

export interface ExtraMaterial {
  id: string;
  elementId: string;
  title: string;
  url: string;
  type: MaterialType;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'review_request' | 'rework' | 'accepted' | 'test_available';
}
