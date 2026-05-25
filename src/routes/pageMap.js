import StudentHome from "../pages/student/StudentHome";
import StudentCourses from "../pages/student/StudentCourses";
import LessonViewer from "../pages/student/LessonViewer";
import StudentQuiz from "../pages/student/StudentQuiz";
import MarketplacePage from "../pages/shared/MarketplacePage";
import StudentExploreCourses from "../pages/student/StudentExploreCourses";

import ParentHome from "../pages/parent/ParentHome";
import ParentScores from "../pages/parent/ParentScores";
import ParentAttendance from "../pages/parent/ParentAttendance";

import AdminHome from "../pages/admin/AdminHome";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import AdminTracking from "../pages/admin/AdminTracking";
import AdminCourses from "../pages/admin/AdminCourses";

function StudentLessonPage(props) {
  const payload = props.pagePayload || props.payload || {};

  return (
    <LessonViewer
      {...props}
      courseId={payload.courseId || props.courseId}
      lessonId={payload.lessonId || props.lessonId}
    />
  );
}

function StudentQuizPage(props) {
  const payload = props.pagePayload || props.payload || {};

  return (
    <StudentQuiz
      {...props}
      courseId={payload.courseId || props.courseId}
      quizId={payload.quizId || props.quizId}
    />
  );
}

export const PAGES_BY_ROLE = {
  student: {
    home: StudentHome,
    courses: StudentCourses,
    "explore-courses": StudentExploreCourses,
    lesson: StudentLessonPage,
    quiz: StudentQuizPage,
    quizzes: StudentQuiz,

    // tạm map về StudentHome vì chưa có file riêng
    progress: StudentHome,
    activity: StudentHome,

    marketplace: MarketplacePage,
  },

  parent: {
    home: ParentHome,

    "child-progress": ParentHome,
    activity: ParentHome,

    scores: ParentScores,
    attendance: ParentAttendance,
  },

  admin: {
    home: AdminHome,
    users: AdminUsers,
    courses: AdminCourses,
    analytics: AdminAnalytics,
    tracking: AdminTracking,
    marketplace: MarketplacePage,
  },
};