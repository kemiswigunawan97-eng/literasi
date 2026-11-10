/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UraianQuestion } from '../types/game';
import { Award, CheckCircle, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { sound } from '../utils/audio';

interface BonusUraianCardProps {
  question: UraianQuestion;
  currentIndex: number;
  totalInPos: number;
  userState?: { text: string; score: number; reviewed: boolean };
  onSaveAnswer: (questionId: number, text: string, score: number, reviewed: boolean) => void;
  onNext: () => void;
  onPrev: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onJumpToWacana: (ref: 'wacana1' | 'wacana2' | 'keduanya') => void;
}

export const BonusUraianCard: React.FC<BonusUraianCardProps> = ({
  question,
  currentIndex,
  totalInPos,
  userState,
  onSaveAnswer,
  onNext,
  onPrev,
  hasPrev,
  hasNext,
  onJumpToWacana
}) => {
  const [text, setText] = useState<string>(userState?.text || '');
  const [score, setScore] = useState<number>(userState?.score ?? 0);
  const [reviewed, setReviewed] = useState<boolean>(userState?.reviewed || false);

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sound.playSelect();
    setReviewed(true);
    // default to 2 or 3 if high effort, user can adjust
    const initialScore = text.trim().length > 60 ? 3 : 2;
    setScore(initialScore);
    onSaveAnswer(question.id, text, initialScore, true);
  };

  const handleScoreChange = (newScore: number) => {
    sound.playClick();
    setScore(newScore);
    onSaveAnswer(question.id, text, newScore, true);
  };

  return (
    <div className="w-full bg-stone-900 border border-amber-500/30 rounded-2xl p-5 sm:p-7 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 text-amber-400">
              Soal Uraian {question.id}
            </span>
            <span className="text-xs text-amber-300 font-semibold">
              Misi Konservasi (0–3 Poin)
            </span>
          </div>

          <button
            type="button"
            onClick={() => onJumpToWacana(question.wacanaRef)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-4 cursor-pointer"
          >
            Lihat {question.wacanaRef === 'wacana1' ? 'Wacana 1' : question.wacanaRef === 'wacana2' ? 'Wacana 2' : 'Kedua Wacana'}
          </button>
        </div>

        {/* Prompt */}
        <div className="mb-5">
          <h3 className="text-base sm:text-lg font-bold text-stone-100 leading-relaxed font-heading mb-3">
            {question.prompt}
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Tuliskan uraian kalimatmu secara runtut dan jelas. Setelah dikirim, bandingkan jawabanmu dengan contoh kunci dan nilai dirimu secara jujur dengan pedoman penskoran.
          </p>
        </div>

        {/* Student Text Area Input */}
        <form onSubmit={handleSubmitText} className="space-y-3 mb-6">
          <textarea
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tuliskan uraian jawaban lengkapmu di sini..."
            className="w-full p-3.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 placeholder:text-stone-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 leading-relaxed"
          />

          {!reviewed && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!text.trim()}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Kirim &amp; Buka Kunci Jawaban</span>
              </button>
            </div>
          )}
        </form>

        {/* Comparison & Rubric Section (Revealed after submission) */}
        {reviewed && (
          <div className="space-y-4 pt-4 border-t border-stone-800 animate-fade-in">
            {/* Model Answer Box */}
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Contoh Jawaban Acuan:</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed whitespace-pre-line font-normal">
                {question.sampleAnswer}
              </p>
            </div>

            {/* Rubric Guide Box */}
            <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Pedoman Penskoran:</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed whitespace-pre-line">
                {question.rubric}
              </p>

              {/* Interactive Self-Scoring Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-800/80">
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  Beri skor mandiri untuk jawabanmu (0 – 3 Poin):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((pt) => {
                    const isSelected = score === pt;
                    return (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => handleScoreChange(pt)}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-amber-500 border-amber-400 text-stone-950 shadow-md ring-2 ring-amber-400/50'
                            : 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        <span className="text-sm font-mono">{pt} Poin</span>
                        <span className="text-[10px] font-normal opacity-80">
                          {pt === 3 && 'Sempurna'}
                          {pt === 2 && 'Cukup Lengkap'}
                          {pt === 1 && 'Sebagian'}
                          {pt === 0 && 'Belum Sesuai'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-stone-800 flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        <span className="text-xs font-mono text-stone-500">
          Uraian {currentIndex + 1} / {totalInPos}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          <span>Berikutnya</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
