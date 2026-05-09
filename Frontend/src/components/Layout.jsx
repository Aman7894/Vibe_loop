import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { BGPattern } from './ui/bg-pattern';
import SocialFooter from './ui/SocialFooter';
import { useTranslation } from 'react-i18next';
import SuggestedUsers from './SuggestedUsers';

export default function Layout({ children }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-slate-900 dark:text-white transition-colors duration-500 overflow-x-hidden relative z-0 flex flex-col">
      <BGPattern variant="grid" mask="fade-edges" size={24} className="text-slate-200 dark:text-neutral-900 opacity-60 pointer-events-none fixed" />
      
      {/* Background Decorators */}
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />
      
      <div className="flex-1 container max-w-screen-2xl pt-20 pb-8 md:pt-24 z-10 relative">
        <div className="flex justify-center gap-8">
          <div className="hidden lg:block w-64 shrink-0 sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
             <Sidebar />
          </div>
          
          <motion.main 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 w-full max-w-[650px] flex flex-col"
          >
            {children}
            <div className="block xl:hidden mt-12 pb-12">
               <SocialFooter />
            </div>
          </motion.main>
          
          {/* Right Sidebar */}
          <aside className="hidden xl:block w-[320px] shrink-0 sticky top-24 self-start space-y-6">
            <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/30 backdrop-blur-2xl p-6 shadow-2xl relative overflow-hidden">
              {/* Glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              
              <h3 className="font-bold text-lg mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                {t('Suggested for you')}
              </h3>
              
              {/* Dynamic Suggested Users List */}
              <SuggestedUsers />
            </div>
            
            <div>
              <SocialFooter />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
