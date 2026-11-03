import CourseApp from '@/components/course-app';
import { lessons } from '@/lib/course-data';

export function generateStaticParams() {
  return lessons.map(({ slug }) => ({ slug }));
}

export default function Page(){ return <CourseApp/>; }
