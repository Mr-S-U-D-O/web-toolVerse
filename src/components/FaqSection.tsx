import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  category: string;
  items: FaqItem[];
}

interface FaqSectionProps {
  faqData: FaqCategory[];
}

export default function FaqSection({ faqData }: FaqSectionProps) {
  if (!faqData || faqData.length === 0) return null;

  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);

  // Reset open question when category changes
  useEffect(() => {
    setOpenQuestionIndex(null);
  }, [activeCategoryIdx]);

  const currentCategory = faqData[activeCategoryIdx];
  const questions = currentCategory?.items || [];

  return (
    <section className="w-full bg-surface py-16 lg:py-24 border-t border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          
          {/* Left Column (Categories) */}
          <aside className="md:col-span-4 md:sticky md:top-8 flex flex-row md:flex-col flex-wrap gap-4 md:gap-6 justify-start md:items-end text-left md:text-right border-b md:border-b-0 md:border-r border-outline-variant pb-6 md:pb-0 md:pr-8">
            {faqData.map((cat, idx) => {
              const isActive = idx === activeCategoryIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveCategoryIdx(idx)}
                  className={`text-[11px] font-mono font-medium tracking-widest uppercase transition-all duration-300 hover:text-[#008cff] text-left md:text-right relative py-1 cursor-pointer select-none ${
                    isActive 
                      ? 'text-[#008cff]' 
                      : 'text-on-surface-variant'
                  }`}
                >
                  {cat.category}
                  {isActive && (
                    <motion.div 
                      layoutId="activeCategoryUnderline"
                      className="absolute bottom-0 right-0 left-0 md:left-auto md:w-full h-[2px] bg-[#008cff]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </aside>

          {/* Right Column (Accordion) */}
          <div className="md:col-span-8 flex flex-col">
            {questions.length > 0 ? (
              <div className="flex flex-col">
                {questions.map((item, idx) => {
                  const isOpen = openQuestionIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className="border-b border-outline-variant overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenQuestionIndex(isOpen ? null : idx)}
                        className="w-full py-5 flex items-center justify-between text-left transition-colors group cursor-pointer select-none"
                      >
                        <span className={`font-heading font-medium text-base md:text-lg transition-colors leading-relaxed pr-6 ${
                          isOpen ? 'text-[#008cff]' : 'text-on-surface group-hover:text-[#008cff]'
                        }`}>
                          {item.question}
                        </span>
                        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center bg-surface-container-low transition-all duration-300 group-hover:border-[#008cff]/50">
                          {isOpen ? (
                            <Minus className="w-3.5 h-3.5 text-[#008cff] transition-transform duration-300" />
                          ) : (
                            <Plus className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-[#008cff] transition-transform duration-300" />
                          )}
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ 
                              height: 'auto', 
                              opacity: 1,
                              transition: {
                                height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                                opacity: { duration: 0.2, delay: 0.05 }
                              }
                            }}
                            exit={{ 
                              height: 0, 
                              opacity: 0,
                              transition: {
                                height: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
                                opacity: { duration: 0.15 }
                              }
                            }}
                          >
                            <div className="pb-6 text-on-surface-variant font-sans text-sm md:text-base leading-relaxed max-w-2xl">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-on-surface-variant font-mono text-sm uppercase tracking-wider">
                No FAQs available for this category.
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
