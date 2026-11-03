import CourseApp from '@/components/course-app';
import { problems } from '@/lib/course-data';

export function generateStaticParams() {
  return problems.map(({ slug }) => ({ slug }));
}

export default function Page(){ return <CourseApp/>; }
