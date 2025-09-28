import React from 'react';
import { Card, Badge, Tooltip } from 'flowbite-react';
import { FileText, BookOpen, GraduationCap } from 'lucide-react'; // optional niceties

/**
 * GroupedPostCard — polished UI
 * - Cleaner hierarchy, better spacing/contrast
 * - Gradient border + subtle glass background
 * - Crisp status ribbon for exam groups
 * - Subject "chips", safe fallbacks, line clamping
 * - Keyboard/focus styles for accessibility
 */
const GroupedPostCard = ({ groupKey, groupInfo, onClick }) => {
  const { year, term, examType, files } = groupInfo || {};

  // Robust unique helpers
  const uniq = (arr) => [...new Set((arr || []).filter(Boolean).map((s) => String(s).trim()))];

  const subjects = uniq(files?.map((f) => f.subject));
  const formsArr = uniq(files?.map((f) => f.form));
  const category = files?.[0]?.category || '';
  const status = files?.[0]?.status || ''; // 'past_exams' | 'exam_in_progress' (may vary)

  // Single form or friendly fallback
  const form = formsArr.length === 1 ? formsArr[0] : formsArr.length ? formsArr.join(', ') : '—';

  // Ribbon config
  const isExam = category === 'exams';
  const isInProgress = status === 'exam_in_progress';
  const ribbonColor = isInProgress ? 'bg-emerald-600' : 'bg-rose-700';
  const ribbonText = isInProgress ? 'IN PROGRESS' : 'PAST EXAM';

  // Category pill color (feel free to tweak)
  const catColor = {
    exams: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    results: 'bg-sky-50 text-sky-700 ring-sky-200',
    notes: 'bg-amber-50 text-amber-800 ring-amber-200',
    marking_scheme: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  }[category] || 'bg-slate-50 text-slate-700 ring-slate-200';

  // Title pieces with safe fallbacks
  const title = `${year ?? '—'} · Term ${term ?? '—'}${examType ? ` · ${examType}` : ''}`;

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-label={`Open group ${title}`}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.(e)}
      className={[
        'relative group h-full min-h-[280px] cursor-pointer',
        // gradient border + glass background
        'rounded-2xl p-[1px] bg-gradient-to-br from-white via-white/60 to-white/10',
        'shadow-[0_10px_25px_-15px_rgba(0,0,0,0.35)]',
        'hover:shadow-[0_18px_45px_-20px_rgba(0,0,0,0.45)]',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200',
      ].join(' ')}
    >
      <div
        className={[
          'rounded-2xl h-full w-full',
          'backdrop-blur-md bg-white/70 dark:bg-slate-900/60',
          'border border-white/40 dark:border-white/10',
          'px-5 py-5 flex flex-col',
        ].join(' ')}
      >
        {/* Ribbon (exams only) */}
        {isExam && (
          <div
            className={[
              'absolute top-0 -left-10 -rotate-45 z-10 w-28 text-center',
              'text-[10px] font-extrabold tracking-wide text-white',
              ribbonColor,
              'px-2 py-1 shadow-lg drop-shadow-lg rounded-sm',
            ].join(' ')}
          >
            {ribbonText}
          </div>
        )}

        {/* Header row: Category pill + file count */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className={[
              'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1',
              catColor,
            ].join(' ')}
          >
            {category?.replace('_', ' ') || '—'}
          </span>

          <Tooltip content="Files in this group" placement="left">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
              <FileText size={14} className="opacity-70" />
              {files?.length ?? 0}
            </span>
          </Tooltip>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-black text-blue-700/90 dark:text-blue-300 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Meta grid */}
        <div className="mt-4 grid grid-cols-1 gap-3 text-[0.92rem] text-slate-800 dark:text-slate-200">
          <div className="flex items-start gap-2">
            <BookOpen size={16} className="mt-[2px] shrink-0 opacity-70" />
            <div>
              <span className="font-semibold">Subjects:</span>{' '}
              {subjects.length ? (
                <span className="line-clamp-2">
                  {subjects.join(', ')}
                </span>
              ) : (
                '—'
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="opacity-70" />
            <div>
              <span className="font-semibold">Form:</span> {form}
            </div>
          </div>
        </div>

        {/* Subject chips (up to 4) */}
        {!!subjects.length && (
          <div className="mt-4 flex flex-wrap gap-2">
            {subjects.slice(0, 4).map((s) => (
              <Badge key={s} color="gray" className="rounded-full px-2 py-0.5 text-[11px] font-medium">
                {s}
              </Badge>
            ))}
            {subjects.length > 4 && (
              <Badge color="info" className="rounded-full px-2 py-0.5 text-[11px]">
                +{subjects.length - 4} more
              </Badge>
            )}
          </div>
        )}

        {/* CTA affordance */}
        <div className="mt-auto pt-5">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700" />
          <div className="mt-3 text-sm text-blue-600/80 dark:text-blue-300/90 font-semibold tracking-wide">
            View details
            <span className="inline-block translate-x-0 group-hover:translate-x-1 transition-transform ml-1">→</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default GroupedPostCard;
