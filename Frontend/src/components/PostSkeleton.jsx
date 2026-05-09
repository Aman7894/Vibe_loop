import { motion } from 'framer-motion';

export default function PostSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 mb-4 rounded-xl border bg-card text-card-foreground shadow-sm shadow-black/5 animate-pulse"
    >
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full bg-muted"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 w-[150px] bg-muted rounded"></div>
          <div className="h-3 w-[100px] bg-muted rounded"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-[80%] bg-muted rounded"></div>
      </div>
      <div className="mt-4 h-64 w-full bg-muted rounded-xl"></div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-6">
          <div className="h-5 w-12 bg-muted rounded"></div>
          <div className="h-5 w-12 bg-muted rounded"></div>
          <div className="h-5 w-12 bg-muted rounded"></div>
        </div>
      </div>
    </motion.div>
  );
}
