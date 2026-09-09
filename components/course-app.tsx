'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Bookmark, BookOpen, BrainCircuit, Calculator, Check,
  ChevronRight, CircleHelp, Compass, ExternalLink, Library, Menu,
  Moon, Network, Play, RotateCcw, Search, ShieldCheck, Sparkles, Sun,
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { courseStats, lessons, problems, resources, reviewCards, sourceSnapshot, tracks } from '@/lib/course-data';
import type { DesignProblem, Lesson, Resource } from '@/lib/course-types';
import {
  completionPercent, emptyProgress, isDue, loadProgress, type LearnerProgress,
  type CardRating, PROGRESS_VERSION, sanitizeYouTubeId, scheduleReview, STORAGE_KEY,
} from '@/lib/progress';

type View = 'dashboard' | 'roadmap' | 'practice' | 'review' | 'resources' | 'tools' | 'sources' | 'lesson' | 'problem';

function HardLink({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a {...props} data-hard-nav="true">{children}</a>;
}

function getRoute(): { view: View; slug?: string } {
  if (typeof window === 'undefined') return { view: 'dashboard' };
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (parts[0] === 'lesson') return { view: 'lesson', slug: parts[1] };
  if (parts[0] === 'practice' && parts[1]) return { view: 'problem', slug: parts[1] };
  const known = ['roadmap', 'practice', 'review', 'resources', 'tools', 'sources'];
  return { view: known.includes(parts[0]) ? parts[0] as View : 'dashboard' };
}

const nav = [
  ['dashboard', '/', 'Dashboard', Compass],
  ['roadmap', '/roadmap', 'Roadmap', BookOpen],
  ['practice', '/practice', 'Design labs', BrainCircuit],
  ['review', '/review', 'Review', RotateCcw],
  ['resources', '/resources', 'Library', Library],
  ['tools', '/tools', 'Estimators', Calculator],
  ['sources', '/sources', 'Sources', ShieldCheck],
] as const;

function useCourseProgress() {
  const [progress, setProgressState] = useState<LearnerProgress>(emptyProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setProgressState(loadProgress(window.localStorage));
      setHydrated(true);
    });
  }, []);

  const setProgress = useCallback((updater: (current: LearnerProgress) => LearnerProgress) => {
    setProgressState(current => {
      const next = updater(current);
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Private storage may be unavailable. */ }
      return next;
    });
  }, []);

  return { progress, setProgress, hydrated };
}

function Header({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <header className="mb-8 flex items-start gap-3">
      <SidebarTrigger className="mt-0.5 md:hidden"><Menu /></SidebarTrigger>
      <div><p className="kicker">{eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{title}</h1></div>
    </header>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return <div className="rounded-xl border border-border bg-card p-4"><div className="font-mono text-2xl font-semibold text-primary">{value}</div><div className="mt-1 text-sm text-muted-foreground">{label}</div></div>;
}

function Dashboard({ progress }: { progress: LearnerProgress }) {
  const percent = completionPercent(progress.completedLessonIds, lessons.length);
  const next = lessons.find(item => !progress.completedLessonIds.includes(item.id)) ?? lessons[0];
  const due = reviewCards.filter(card => progress.completedLessonIds.includes(card.lessonId) && isDue(progress.cardSchedules[card.id])).length;
  const completedProblems = progress.completedProblemIds.length;
  return <>
    <Header eyebrow="Command center" title="Build judgment, one decision at a time." />
    <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
      <article className="hero-panel">
        <div className="absolute right-0 top-0 h-44 w-44 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_68%)] opacity-20" />
        <p className="kicker">Continue · Track {tracks.find(t => t.id === next.trackId)?.order.toString().padStart(2, '0')}</p>
        <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-.035em]">{next.title}</h2>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{next.summary}</p>
        <div className="mt-7 flex flex-wrap gap-3"><Button nativeButton={false} render={<HardLink href={`/lesson/${next.slug}`} aria-label={`Open ${next.title}`} />}>Open lesson <ArrowRight /></Button><Button nativeButton={false} variant="outline" render={<HardLink href="/roadmap" aria-label="View roadmap" />}>View roadmap</Button></div>
      </article>
      <article className="review-panel">
        <div><p className="kicker !text-cyan-300">Today&apos;s review</p><div className="mt-7 text-6xl font-semibold">{due}</div><p className="mt-1 text-slate-400">cards due now</p></div>
        <Button nativeButton={false} className="mt-8 w-full bg-white text-slate-950 hover:bg-cyan-50" render={<HardLink href="/review" aria-label="Open review deck" />}>{due ? 'Start review' : 'Open review deck'} <ArrowRight /></Button>
      </article>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat value={`${percent}%`} label="lesson mastery"/><Stat value={progress.completedLessonIds.length} label={`of ${lessons.length} lessons`}/><Stat value={completedProblems} label="design labs complete"/><Stat value={courseStats.videos} label="video walkthroughs"/></div>
    <section className="mt-10"><div className="section-heading"><div><p className="kicker">Roadmap</p><h2>Keep the sequence, skip the guesswork</h2></div><HardLink className="text-link" href="/roadmap">All 13 tracks <ArrowRight/></HardLink></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{tracks.slice(0, 4).map(track => <TrackCard key={track.id} trackId={track.id} progress={progress}/>)}</div>
    </section>
  </>;
}

function TrackCard({ trackId, progress }: { trackId: string; progress: LearnerProgress }) {
  const track = tracks.find(item => item.id === trackId)!;
  const items = lessons.filter(item => item.trackId === trackId);
  const done = items.filter(item => progress.completedLessonIds.includes(item.id)).length;
  const first = items[0];
  return <HardLink href={first ? `/lesson/${first.slug}` : trackId === 'hld' || trackId === 'lld' ? '/practice' : '/resources'} className="track-card group">
    <div className="flex items-center justify-between"><span className="font-mono text-xs" style={{color: track.accent}}>{String(track.order).padStart(2, '0')}</span><span className="text-xs text-muted-foreground">{items.length || (trackId === 'hld' ? 45 : trackId === 'lld' ? 33 : 16)} items</span></div>
    <h3 className="mt-7 font-semibold group-hover:text-primary">{track.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{track.description}</p>
    {items.length > 0 && <Progress className="mt-5" value={items.length ? done / items.length * 100 : 0}/>}<p className="mt-2 text-xs text-muted-foreground">{done ? `${done} complete` : 'Ready when you are'}</p>
  </HardLink>;
}

function Roadmap({ progress }: { progress: LearnerProgress }) {
  return <><Header eyebrow="13-track curriculum" title="The complete architecture roadmap"/><p className="-mt-4 mb-8 max-w-3xl text-lg leading-8 text-muted-foreground">Move from quantitative foundations to distributed systems, production operations, HLD, Java LLD, and landmark systems.</p>
    <div className="space-y-4">{tracks.map(track => {
      const items = lessons.filter(item => item.trackId === track.id);
      const done = items.filter(item => progress.completedLessonIds.includes(item.id)).length;
      const practiceCount = track.id === 'hld' ? 45 : track.id === 'lld' ? 33 : 0;
      return <article key={track.id} className="roadmap-row"><div className="roadmap-number" style={{borderColor: track.accent, color: track.accent}}>{String(track.order).padStart(2, '0')}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-semibold">{track.title}</h2><span className="font-mono text-xs text-muted-foreground">{items.length ? `${done}/${items.length} lessons` : `${practiceCount || 16} guided items`}</span></div><p className="mt-1 text-sm leading-6 text-muted-foreground">{track.description}</p>{items.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{items.slice(0, 6).map(item => <HardLink key={item.id} href={`/lesson/${item.slug}`} className={`lesson-chip ${progress.completedLessonIds.includes(item.id) ? 'lesson-chip-done' : ''}`}>{progress.completedLessonIds.includes(item.id) && <Check/>}{item.title}</HardLink>)}{items.length > 6 && <span className="lesson-chip">+{items.length - 6} more</span>}</div>}</div><ChevronRight className="hidden shrink-0 text-muted-foreground sm:block"/></article>;
    })}</div>
  </>;
}

function LessonView({ lesson, progress, update }: { lesson: Lesson; progress: LearnerProgress; update: (fn: (p: LearnerProgress) => LearnerProgress) => void }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [note, setNote] = useState(progress.notes[lesson.id] ?? '');
  const complete = progress.completedLessonIds.includes(lesson.id);
  const bookmarked = progress.bookmarkedLessonIds.includes(lesson.id);
  const track = tracks.find(t => t.id === lesson.trackId)!;
  const related = lessons.filter(item => item.trackId === lesson.trackId);
  const index = related.findIndex(item => item.id === lesson.id);
  const next = related[index + 1];
  const sourceUrl = lesson.source === 'lld-repo' ? sourceSnapshot.lld.repository : sourceSnapshot.hld.repository;
  const sourceLabel = lesson.source === 'original' ? 'Original curriculum lesson' : lesson.source === 'lld-repo' ? 'LLD source catalog' : 'HLD source catalog';

  const toggleComplete = () => update(p => ({...p, lastLessonId: lesson.id, completedLessonIds: p.completedLessonIds.includes(lesson.id) ? p.completedLessonIds.filter(id => id !== lesson.id) : [...p.completedLessonIds, lesson.id]}));
  const toggleBookmark = () => update(p => ({...p, bookmarkedLessonIds: p.bookmarkedLessonIds.includes(lesson.id) ? p.bookmarkedLessonIds.filter(id => id !== lesson.id) : [...p.bookmarkedLessonIds, lesson.id]}));
  const saveNote = () => update(p => ({...p, notes: {...p.notes, [lesson.id]: note}}));
  const checkQuiz = () => { if (choice === null) return; setChecked(true); update(p => ({...p, quizScores: {...p.quizScores, [lesson.quiz.id]: choice === lesson.quiz.answer ? 100 : 0}})); };
  return <>
    <HardLink href="/roadmap" className="text-link mb-6 inline-flex"><ArrowLeft/>Back to roadmap</HardLink>
    <article className="lesson-layout">
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2"><Badge>{track.title}</Badge><Badge variant="outline">{lesson.duration} min</Badge><Badge variant="outline">{lesson.level}</Badge></div>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">{lesson.title}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{lesson.summary}</p>
        <section className="lesson-section"><p className="kicker">Mental model</p><h2>Place it in the reasoning chain</h2><div className="model-flow"><span>Constraint</span><ArrowRight/><strong>{lesson.title}</strong><ArrowRight/><span>New tradeoff</span></div><p>{lesson.mentalModel}</p></section>
        <section className="lesson-section"><p className="kicker">Concrete example</p><h2>See it in a system</h2><div className="callout">{lesson.example}</div></section>
        <section className="lesson-section"><p className="kicker">Decision review</p><h2>Tradeoffs to name out loud</h2><div className="grid gap-3 sm:grid-cols-3">{lesson.tradeoffs.map((item, i) => <div className="decision-card" key={item}><span>{String(i + 1).padStart(2,'0')}</span><p>{item}</p></div>)}</div></section>
        <section className="lesson-section"><p className="kicker">Failure review</p><h2>Common mistakes</h2><ul className="space-y-3">{lesson.mistakes.map(item => <li className="flex gap-3" key={item}><span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-red-500/10 text-xs text-red-500">!</span><span className="text-muted-foreground">{item}</span></li>)}</ul></section>
        <section className="lesson-section quiz-card"><p className="kicker">Knowledge check</p><h2>{lesson.quiz.prompt}</h2><div className="mt-5 space-y-2">{lesson.quiz.options.map((option, i) => <button key={option} onClick={() => {setChoice(i);setChecked(false);}} className={`quiz-option ${choice === i ? 'quiz-selected' : ''} ${checked && i === lesson.quiz.answer ? 'quiz-correct' : ''}`}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>{checked && <div className={`mt-4 rounded-lg p-4 text-sm ${choice === lesson.quiz.answer ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/10 text-amber-800 dark:text-amber-300'}`}>{choice === lesson.quiz.answer ? 'Correct. ' : 'Not quite. '}{lesson.quiz.explanation}</div>}<Button className="mt-5" onClick={checkQuiz} disabled={choice === null}>Check answer</Button></section>
        <section className="lesson-section"><p className="kicker">Your notes</p><h2>Capture the decision rule</h2><Textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Write the sentence you want to remember…" className="mt-4 min-h-32 bg-card"/><Button variant="outline" className="mt-3" onClick={saveNote}>Save note</Button></section>
        <section className="lesson-section"><p className="kicker">Sources</p><h2>Go deeper</h2><p className="text-muted-foreground">This lesson is written in original language and informed by the curated repositories and architecture practice.</p><a className="text-link mt-3 inline-flex" href={sourceUrl} target="_blank" rel="noreferrer">{sourceLabel}<ExternalLink/></a></section>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6"><Button variant={complete ? 'outline' : 'default'} onClick={toggleComplete}>{complete ? <><Check/>Completed</> : 'Mark complete'}</Button>{next && <Button nativeButton={false} render={<HardLink href={`/lesson/${next.slug}`} aria-label={`Open ${next.title}`} />}>Next: {next.title}<ArrowRight/></Button>}</div>
      </div>
      <aside className="lesson-aside"><div className="sticky top-6 space-y-3"><div className="rounded-xl border border-border bg-card p-5"><p className="kicker">Lesson status</p><Button variant="outline" className="mt-4 w-full" onClick={toggleBookmark}><Bookmark className={bookmarked ? 'fill-current' : ''}/>{bookmarked ? 'Bookmarked' : 'Bookmark'}</Button><Button className="mt-2 w-full" onClick={toggleComplete}>{complete ? <><Check/>Completed</> : 'Mark complete'}</Button></div><div className="rounded-xl border border-border bg-card p-5 text-sm"><p className="font-medium">In this track</p><p className="mt-2 text-muted-foreground">Lesson {index + 1} of {related.length}</p><Progress className="mt-4" value={(index + 1) / related.length * 100}/></div></div></aside>
    </article>
  </>;
}

const worksheetFields = [
  ['requirements', 'Requirements & constraints', 'Who uses it? What must it do? Name latency, availability, consistency, privacy, and scope.'],
  ['scale', 'Scale estimates', 'Estimate peak QPS, storage growth, bandwidth, and skew. Show assumptions.'],
  ['model', 'API and data model', 'Define the core contract and ownership of important state.'],
  ['design', 'Architecture or class design', 'Describe components/classes, responsibilities, and the critical interaction path.'],
  ['failure', 'Failures & tradeoffs', 'Name bottlenecks, partial failures, overload behavior, recovery, and rejected alternatives.'],
] as const;

function PracticeList({ progress }: { progress: LearnerProgress }) {
  const [kind, setKind] = useState<'all'|'HLD'|'LLD'>('all'); const [query, setQuery] = useState('');
  const filtered = problems.filter(p => (kind === 'all' || p.kind === kind) && p.title.toLowerCase().includes(query.toLowerCase()));
  return <><Header eyebrow="78 guided exercises" title="Design labs"/><div className="toolbar"><Tabs value={kind} onValueChange={v => setKind(v as typeof kind)}><TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="HLD">HLD · 45</TabsTrigger><TabsTrigger value="LLD">LLD · 33</TabsTrigger></TabsList></Tabs><div className="relative flex-1 sm:max-w-sm"><Search className="input-icon"/><Input aria-label="Search design labs" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search a system…" className="pl-10"/></div></div>
    <div className="mt-6 grid gap-3 lg:grid-cols-2">{filtered.map(problem => <HardLink href={`/practice/${problem.slug}`} key={problem.id} className="problem-card"><div><div className="flex gap-2"><Badge>{problem.kind}</Badge><Badge variant="outline">{problem.level}</Badge><span className="self-center font-mono text-xs text-muted-foreground">{problem.duration} min</span></div><h2 className="mt-4 text-lg font-semibold">{problem.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{problem.prompt}</p></div><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="text-sm">{progress.completedProblemIds.includes(problem.id) ? <span className="text-emerald-600">Completed</span> : 'Open worksheet'}</span><ArrowRight className="text-primary"/></div></HardLink>)}</div>
  </>;
}

function ProblemView({ problem, progress, update }: { problem: DesignProblem; progress: LearnerProgress; update: (fn: (p: LearnerProgress) => LearnerProgress) => void }) {
  const [answers, setAnswers] = useState<Record<string,string>>(progress.worksheets[problem.id] ?? {});
  const [saved, setSaved] = useState(false);
  const save = () => { update(p => ({...p, worksheets: {...p.worksheets, [problem.id]: answers}})); setSaved(true); setTimeout(()=>setSaved(false), 1500); };
  const complete = () => update(p => ({...p, completedProblemIds: p.completedProblemIds.includes(problem.id) ? p.completedProblemIds : [...p.completedProblemIds, problem.id], worksheets: {...p.worksheets, [problem.id]: answers}}));
  return <><HardLink href="/practice" className="text-link mb-6 inline-flex"><ArrowLeft/>All design labs</HardLink><div className="grid gap-7 xl:grid-cols-[1fr_320px]"><article><div className="flex gap-2"><Badge>{problem.kind}</Badge><Badge variant="outline">{problem.level}</Badge><Badge variant="outline">{problem.duration} min</Badge></div><h1 className="mt-5 text-4xl font-semibold tracking-[-.04em]">{problem.title}</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">{problem.prompt}</p><div className="mt-7 rounded-xl border border-primary/20 bg-primary/5 p-5"><p className="font-medium">Start with a blank page</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Spend five minutes clarifying the problem before reading the prompts. The worksheet saves only on this device.</p></div>
      <div className="mt-8 space-y-6">{worksheetFields.map(([key,title,placeholder], index) => <section className="worksheet-card" key={key}><div className="flex items-start gap-3"><span className="step-number">{index+1}</span><div className="flex-1"><label className="text-lg font-semibold" htmlFor={`${problem.id}-${key}`}>{title}</label><p className="mt-1 text-sm text-muted-foreground">{problem.focus[index]}</p><Textarea id={`${problem.id}-${key}`} value={answers[key] ?? ''} onChange={e=>setAnswers({...answers,[key]:e.target.value})} placeholder={placeholder} className="mt-4 min-h-36 bg-background"/></div></div></section>)}</div>
      {problem.kind === 'LLD' && <section className="lesson-section"><p className="kicker">Java starting point</p><h2>Make behavior visible</h2><pre className="code-block"><code>{problem.javaStarter}</code></pre></section>}
      {problem.videoId && sanitizeYouTubeId(problem.videoId) && <VideoPlayer resource={{id: problem.id,title:problem.title,kind:'video',url:`https://youtube.com/watch?v=${problem.videoId}`,description:'Source walkthrough',videoId:problem.videoId}}/>}
      <section className="lesson-section"><Accordion><AccordionItem value="rubric"><AccordionTrigger className="text-lg">Reveal evaluation rubric</AccordionTrigger><AccordionContent><ul className="space-y-3 pt-3">{problem.rubric.map(item=><li className="flex gap-3" key={item}><Check className="mt-0.5 size-4 shrink-0 text-emerald-500"/>{item}</li>)}</ul></AccordionContent></AccordionItem></Accordion></section>
      <div className="mt-7 flex flex-wrap gap-3"><Button onClick={save}>{saved ? <><Check/>Saved</> : 'Save worksheet'}</Button><Button variant="outline" onClick={complete}>Mark lab complete</Button><Button nativeButton={false} variant="ghost" render={<a aria-label="Open source material" target="_blank" rel="noreferrer" href={problem.sourceUrl}/>}>Source material<ExternalLink/></Button></div>
    </article><aside><div className="sticky top-6 rounded-xl border border-border bg-card p-5"><p className="kicker">Review checklist</p><ul className="mt-4 space-y-3 text-sm">{problem.focus.map(item=><li className="flex gap-2" key={item}><CircleHelp className="size-4 shrink-0 text-primary"/>{item}</li>)}</ul></div></aside></div></>;
}

function ReviewView({ progress, update }: { progress: LearnerProgress; update: (fn: (p: LearnerProgress) => LearnerProgress) => void }) {
  const cards = reviewCards.filter(card => progress.completedLessonIds.includes(card.lessonId) && isDue(progress.cardSchedules[card.id]));
  const [index,setIndex]=useState(0); const [flipped,setFlipped]=useState(false); const card=cards[index];
  const rate=(rating:CardRating)=>{if(!card)return;update(p=>({...p,cardSchedules:{...p.cardSchedules,[card.id]:scheduleReview(p.cardSchedules[card.id],rating)}}));setFlipped(false);setIndex(0);};
  return <><Header eyebrow="Spaced review" title="Strengthen recall before it fades"/>{!progress.completedLessonIds.length ? <EmptyState title="Your review deck is empty" text="Complete a lesson to add its architecture card to the review queue." action="Start the first lesson" href={`/lesson/${lessons[0].slug}`}/> : !card ? <EmptyState title="You are caught up" text="No cards are due. Keep learning and the queue will schedule itself." action="Continue course" href="/roadmap"/> : <div className="mx-auto max-w-3xl"><div className="mb-4 flex justify-between font-mono text-xs text-muted-foreground"><span>CARD {index+1} / {cards.length}</span><span>{cards.length-index} DUE</span></div><button onClick={()=>setFlipped(!flipped)} className="flashcard"><p className="kicker">{flipped?'Answer':'Recall'}</p><p className="mt-8 text-2xl font-medium leading-10">{flipped?card.back:card.front}</p><span className="mt-10 text-sm text-muted-foreground">Click to {flipped?'see prompt':'reveal answer'}</span></button>{flipped&&<div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"><Button variant="outline" onClick={()=>rate('again')}>Again · 10m</Button><Button variant="outline" onClick={()=>rate('hard')}>Hard · 1d</Button><Button variant="outline" onClick={()=>rate('good')}>Good · 3d</Button><Button onClick={()=>rate('easy')}>Easy · 7d</Button></div>}</div>}</>;
}

function EmptyState({title,text,action,href}:{title:string;text:string;action:string;href:string}) { return <div className="empty-state"><div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Sparkles/></div><h2 className="mt-5 text-2xl font-semibold">{title}</h2><p className="mt-2 max-w-md text-center leading-7 text-muted-foreground">{text}</p><Button nativeButton={false} className="mt-6" render={<HardLink href={href} aria-label={action}/>}>{action}<ArrowRight/></Button></div> }

function VideoPlayer({resource}:{resource:Resource}) {
  const id=resource.videoId&&sanitizeYouTubeId(resource.videoId); const [load,setLoad]=useState(false);
  if(!id)return null;
  return <section className="lesson-section"><p className="kicker">Video walkthrough</p><h2>{resource.title}</h2><div className="video-shell">{load?<iframe loading="lazy" title={`${resource.title} video`} src={`https://www.youtube-nocookie.com/embed/${id}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>:<button onClick={()=>setLoad(true)} aria-label={`Play ${resource.title}`}><Play className="size-8 fill-current"/><span>Load privacy-enhanced video</span></button>}</div><a className="text-link mt-3 inline-flex" target="_blank" rel="noreferrer" href={resource.url}>Open on YouTube<ExternalLink/></a></section>;
}

function ResourcesView() {
  const [query,setQuery]=useState('');const [kind,setKind]=useState('all');const [selected,setSelected]=useState<Resource|undefined>();
  const filtered=resources.filter(r=>(kind==='all'||r.kind===kind)&&(r.title+' '+r.description).toLowerCase().includes(query.toLowerCase()));
  return <><Header eyebrow={`${resources.length} curated resources`} title="Resource library"/><div className="toolbar"><div className="relative flex-1 sm:max-w-md"><Search className="input-icon"/><Input aria-label="Search resources" className="pl-10" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search videos, papers, cases…"/></div><select aria-label="Resource type" value={kind} onChange={e=>setKind(e.target.value)} className="select-control"><option value="all">All types</option><option value="video">Videos</option><option value="channel">Channels</option><option value="paper">Papers</option><option value="case-study">Case studies</option><option value="repository">Repositories</option><option value="book">Books</option></select></div>{selected&&<VideoPlayer resource={selected}/>}<div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{filtered.map(item=><article className="resource-card" key={item.id}><div className="flex items-center justify-between"><Badge variant="outline">{item.kind}</Badge>{item.kind==='video'?<button className="icon-button" aria-label={`Play ${item.title}`} onClick={()=>{setSelected(item);window.scrollTo({top:0,behavior:'smooth'});}}><Play/></button>:<a className="icon-button" aria-label={`Open ${item.title}`} target="_blank" rel="noreferrer" href={item.url}><ExternalLink/></a>}</div><h2 className="mt-5 font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p></article>)}</div></>;
}

function ToolsView() {
  const [daily,setDaily]=useState(1_000_000);const[peak,setPeak]=useState(3);const[bytes,setBytes]=useState(2048);const[replicas,setReplicas]=useState(3);const[hit,setHit]=useState(80);
  const avg=daily/86400, peakQps=avg*peak, storage=daily*bytes*365*replicas, origin=peakQps*(1-hit/100);
  const format=(n:number,unit='')=>n>=1e12?`${(n/1e12).toFixed(1)}T${unit}`:n>=1e9?`${(n/1e9).toFixed(1)}G${unit}`:n>=1e6?`${(n/1e6).toFixed(1)}M${unit}`:n>=1e3?`${(n/1e3).toFixed(1)}K${unit}`:`${n.toFixed(1)}${unit}`;
  return <><Header eyebrow="Capacity planning" title="Turn assumptions into numbers"/><div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]"><section className="tool-card"><h2>Workload assumptions</h2>{[['Daily requests',daily,setDaily],['Peak multiplier',peak,setPeak],['Payload bytes',bytes,setBytes],['Replication factor',replicas,setReplicas],['Cache hit rate %',hit,setHit]].map(([label,value,setter])=><label className="field-row" key={label as string}><span>{label as string}</span><Input type="number" min="0" value={value as number} onChange={e=>(setter as (n:number)=>void)(Number(e.target.value))}/></label>)}</section><section className="tool-card blueprint-dark"><p className="kicker !text-cyan-300">Calculated envelope</p><div className="mt-7 grid grid-cols-2 gap-4"><Result value={format(avg)} label="average QPS"/><Result value={format(peakQps)} label="peak QPS"/><Result value={format(storage,'B')} label="1-year replicated bytes"/><Result value={format(origin)} label="origin QPS after cache"/></div><div className="mt-7 border-t border-white/10 pt-5 text-sm leading-6 text-slate-300">Round up, test skew, and add headroom. Estimates are conversation tools, not promises.</div></section></div><section className="lesson-section"><p className="kicker">Estimator checklist</p><h2>Numbers worth carrying into a design</h2><div className="grid gap-3 md:grid-cols-3">{['Peak reads and writes separately','Storage growth and retention','Bandwidth, fan-out, and hot-key skew'].map((x,i)=><div className="decision-card" key={x}><span>0{i+1}</span><p>{x}</p></div>)}</div></section></>;
}
function Result({value,label}:{value:string;label:string}){return <div className="rounded-lg border border-white/10 bg-white/5 p-4"><div className="font-mono text-2xl font-semibold text-white">{value}</div><div className="mt-1 text-xs text-slate-400">{label}</div></div>}

function SourcesView(){return <><Header eyebrow="Provenance & licensing" title="Sources, snapshots, and reuse"/><div className="grid gap-4 lg:grid-cols-2"><SourceCard name="High-level system design" repo={sourceSnapshot.hld.repository} commit={sourceSnapshot.hld.commit}/><SourceCard name="Low-level system design" repo={sourceSnapshot.lld.repository} commit={sourceSnapshot.lld.commit}/></div><section className="lesson-section"><p className="kicker">How content is used</p><h2>Original lessons, attributed catalogs</h2><div className="prose-grid"><p>Course explanations, exercises, quizzes, rubrics, and visual models are written specifically for this application. The repositories provide the reviewed topic and resource catalogs.</p><p>Both source repositories use GPL-3.0. Source links, commit identifiers, and license notices are preserved. External articles and papers are linked rather than reproduced.</p><p>YouTube videos use privacy-enhanced embeds only after you choose to load them. A direct YouTube link remains available when embedding is unavailable.</p><p>This is a curated snapshot captured on {sourceSnapshot.capturedAt}; it does not silently synchronize or change underneath your progress.</p></div></section><section className="lesson-section"><p className="kicker">Coverage</p><h2>What the snapshot contains</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4"><Stat value={courseStats.lessons} label="authored concept lessons"/><Stat value={courseStats.hldProblems} label="HLD problems"/><Stat value={courseStats.lldProblems} label="LLD problems"/><Stat value={courseStats.videos} label="video walkthroughs"/></div></section></>}
function SourceCard({name,repo,commit}:{name:string;repo:string;commit:string}){return <article className="tool-card"><Badge>GPL-3.0</Badge><h2 className="mt-5 text-xl">{name}</h2><p className="mt-3 break-all font-mono text-xs text-muted-foreground">Snapshot {commit}</p><a className="text-link mt-5 inline-flex" target="_blank" rel="noreferrer" href={repo}>Open repository<ExternalLink/></a></article>}

function ResetProgress({update}:{update:(fn:(p:LearnerProgress)=>LearnerProgress)=>void}) { return <AlertDialog><AlertDialogTrigger render={<Button variant="ghost" size="sm" className="mt-2 w-full text-muted-foreground"/>}>Reset progress</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Reset all course progress?</AlertDialogTitle><AlertDialogDescription>This removes completed lessons, notes, bookmarks, worksheets, quiz history, and review schedules from this device. It cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep progress</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={()=>update(()=>emptyProgress())}>Reset everything</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog> }

type ModelContextTool = {name:string;title?:string;description:string;inputSchema:object;annotations?:{readOnlyHint?:boolean;untrustedContentHint?:boolean};execute:(input:unknown)=>unknown};
declare global { interface Document { modelContext?: { registerTool:(tool:ModelContextTool,options?:{signal?:AbortSignal})=>void|Promise<void> } } }

export default function CourseApp() {
  const [{view,slug},setRoute]=useState<{view:View;slug?:string}>({view:'dashboard'}); const {progress,setProgress,hydrated}=useCourseProgress(); const [dark,setDark]=useState(false);
  useEffect(()=>{const handler=()=>setRoute(getRoute());const navigate=(event:MouseEvent)=>{const target=event.target as Element|null;const link=target?.closest('a[data-hard-nav="true"]') as HTMLAnchorElement|null;if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();event.stopPropagation();window.location.assign(link.href)};queueMicrotask(handler);window.addEventListener('popstate',handler);document.addEventListener('click',navigate,true);return()=>{window.removeEventListener('popstate',handler);document.removeEventListener('click',navigate,true)}},[]);
  useEffect(()=>{queueMicrotask(()=>setDark(document.documentElement.classList.contains('dark')))},[]);
  useEffect(()=>{const context=document.modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();const register=(tool:ModelContextTool)=>{try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{/* unsupported preview */}};
    register({name:'get_learning_status',title:'Get learning status',description:'Read course completion and the recommended next lesson.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>{const next=lessons.find(x=>!progress.completedLessonIds.includes(x.id));return{completedLessons:progress.completedLessonIds.length,totalLessons:lessons.length,percent:completionPercent(progress.completedLessonIds,lessons.length),nextLesson:next?.title??null}}});
    register({name:'mark_lesson_complete',title:'Complete a lesson',description:'Mark one course lesson complete using its stable lesson id.',inputSchema:{type:'object',properties:{lessonId:{type:'string'}},required:['lessonId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:(input)=>{const lessonId=(input as {lessonId?:unknown})?.lessonId;if(typeof lessonId!=='string'||!lessons.some(x=>x.id===lessonId))throw new Error('Unknown lessonId');setProgress(p=>({...p,completedLessonIds:p.completedLessonIds.includes(lessonId)?p.completedLessonIds:[...p.completedLessonIds,lessonId]}));return{lessonId,status:'completed'}}});return()=>lifecycle.abort();
  },[progress.completedLessonIds,setProgress]);
  const lesson=slug?lessons.find(item=>item.slug===slug):undefined; const problem=slug?problems.find(item=>item.slug===slug):undefined;
  const percent=completionPercent(progress.completedLessonIds,lessons.length);
  const toggleTheme=()=>{const next=!dark;setDark(next);document.documentElement.classList.toggle('dark',next)};
  const content=useMemo(()=>{if(!hydrated)return <div className="empty-state"><div className="size-10 animate-pulse rounded-full bg-primary/20"/><p className="mt-4 text-muted-foreground">Opening your course…</p></div>;switch(view){case'roadmap':return <Roadmap progress={progress}/>;case'practice':return <PracticeList progress={progress}/>;case'review':return <ReviewView progress={progress} update={setProgress}/>;case'resources':return <ResourcesView/>;case'tools':return <ToolsView/>;case'sources':return <SourcesView/>;case'lesson':return lesson?<LessonView lesson={lesson} progress={progress} update={setProgress}/>:<EmptyState title="Lesson not found" text="This lesson is not part of the current curated snapshot." action="Open roadmap" href="/roadmap"/>;case'problem':return problem?<ProblemView problem={problem} progress={progress} update={setProgress}/>:<EmptyState title="Design lab not found" text="This exercise is not part of the current curated snapshot." action="Open labs" href="/practice"/>;default:return <Dashboard progress={progress}/>}},[hydrated,lesson,problem,progress,setProgress,view]);
  return <SidebarProvider><Sidebar collapsible="offcanvas" className="border-r border-sidebar-border"><SidebarHeader className="p-5"><HardLink href="/" className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground"><Network size={20}/></div><div><strong className="block font-mono text-sm">SYSTEM/ARCH</strong><span className="text-xs text-muted-foreground">Architecture mastery</span></div></HardLink></SidebarHeader><SidebarContent><SidebarGroup><SidebarGroupLabel>Workspace</SidebarGroupLabel><SidebarGroupContent><SidebarMenu>{nav.map(([id,href,label,Icon])=><SidebarMenuItem key={id}><SidebarMenuButton render={<HardLink href={href} aria-label={label}/>} isActive={view===id||(id==='practice'&&view==='problem')}><Icon/><span>{label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu></SidebarGroupContent></SidebarGroup></SidebarContent><SidebarFooter className="p-4"><div className="rounded-xl border border-sidebar-border bg-background/70 p-4"><div className="flex items-center justify-between text-xs"><span>Course progress</span><span className="font-mono text-primary">{percent}%</span></div><Progress className="mt-3" value={percent}/><p className="mt-3 text-xs leading-5 text-muted-foreground">{progress.completedLessonIds.length} of {lessons.length} lessons complete</p><ResetProgress update={setProgress}/></div></SidebarFooter></Sidebar><SidebarInset className="blueprint-bg min-w-0"><div className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/85 px-4 backdrop-blur md:justify-end"><SidebarTrigger className="md:hidden"/><div className="ml-auto flex items-center gap-2"><span className="hidden font-mono text-[11px] text-muted-foreground sm:inline">PROGRESS STAYS ON THIS DEVICE</span><Button variant="ghost" size="icon" aria-label={dark?'Use light theme':'Use dark theme'} onClick={toggleTheme}>{dark?<Sun/>:<Moon/>}</Button></div></div><main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-10">{content}<footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-border py-6 text-xs text-muted-foreground"><span>System Design Architect · progress format v{PROGRESS_VERSION}</span><HardLink className="hover:text-foreground" href="/sources">GPL-3.0 sources & attribution</HardLink></footer></main></SidebarInset></SidebarProvider>;
}
