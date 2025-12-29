import { useEffect, useState, useRef } from 'react';
import { Circle, Users, Calendar, Clock, MapPin, X, QrCode, RefreshCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTables } from '@/store/slices/tableSlice';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import type { Table } from '@/types/Table';

export default function TableAvailability() {
  const dispatch = useAppDispatch();
  const { tables, loading } = useAppSelector((state) => state.table);
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE'>('ALL');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // New: Search functionality
  const modalRef = useRef<HTMLDivElement>(null); // For outside click close
  
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    dispatch(fetchTables());
    const interval = setInterval(() => dispatch(fetchTables()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedTable(null);
      }
    };
    if (selectedTable) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedTable]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set((clientX - window.innerWidth / 2) / 50);
    mouseY.set((clientY - window.innerHeight / 2) / 50);
  };

  const filteredTables = tables
    .filter(t => filter === 'ALL' || t.status === 'AVAILABLE')
    .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())); // Apply search

  const availableCount = tables.filter((t) => t.status === "AVAILABLE").length;

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full px-6 py-24 overflow-hidden bg-slate-950 flex flex-col justify-center font-sans"
    >
      {/* Background Layer */}
      <motion.div style={{ x: mouseX, y: mouseY, scale: 1.1 }} className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-20 grayscale" poster="https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg">
          <source src="/hero1_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-transparent to-slate-950" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl w-full">
        {/* Top Navigation / Stats */}
        <div className="mb-16 flex flex-col items-start justify-between gap-8 border-l border-white/10 pl-8 md:flex-row md:items-end">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Floor Intelligence</span>
            </div>
            <h2 className="text-7xl font-light tracking-tighter text-white">
              The <span className="font-serif italic text-slate-500">Floor</span>
            </h2>
          </div>

          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            {/* New: Search Input */}
            <input
              type="text"
              placeholder="Search tables by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <div className="flex p-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl">
              {['ALL', 'AVAILABLE'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode as any)}
                  className={`relative px-8 py-3 text-[10px] font-black tracking-widest transition-all rounded-xl ${
                    filter === mode ? 'text-slate-950' : 'text-slate-500 hover:text-white'
                  }`}
                  aria-pressed={filter === mode}
                >
                  {filter === mode && (
                    <motion.div layoutId="pill" className="absolute inset-0 bg-white rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                  )}
                  <span className="relative z-10">{mode}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <RefreshCcw className="text-emerald-500" size={32} />
            </motion.div>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="text-center text-slate-400 py-16">
            <p className="text-xl">No tables found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting the filter or search.</p>
          </div>
        ) : (
          /* Tables Grid */
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredTables.map((table) => (
                <motion.button
                  key={table.id}
                  layout
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedTable(table)}
                  className="group relative flex flex-col justify-between h-64 overflow-hidden rounded-[2rem] border border-white/5 bg-linear-to-br from-white/[0.07] to-transparent backdrop-blur-md p-8 transition-all hover:border-emerald-500/50 hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 cursor-pointer"
                  aria-label={`View details for ${table.name}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-light text-white tracking-tight">{table.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                        <Clock size={12} />
                        <span className="text-[10px] uppercase tracking-tighter">Updated {new Date(table.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase border ${
                      table.status === 'AVAILABLE' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 
                      table.status === 'OCCUPIED' ? 'border-rose-500/50 text-rose-400 bg-rose-500/10' :
                      table.status === 'RESERVED' ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' :
                      'border-slate-500/50 text-slate-400 bg-slate-500/10'
                    }`}>
                      {table.status}
                    </div>
                  </div>

                  {/* Seat Visualization Map - Improved with tooltips */}
                  <div className="flex flex-wrap gap-2 my-6">
                    {Array.from({ length: table.seats }).map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`h-2.5 w-2.5 rounded-full ${table.status === 'AVAILABLE' ? 'bg-emerald-500/40' : 'bg-slate-700'} group-hover:bg-emerald-500/60 transition-colors`}
                        title={`Seat ${i + 1}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users size={14} />
                      <span className="text-xs font-medium">{table.seats} Seats</span>
                    </div>
                    {table.assignedWaiter && (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-linear-to-tr from-emerald-700 to-emerald-500 border border-white/10" />
                        <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-tighter">
                          {table.assignedWaiter.name || 'Waiter Assigned'}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Floating Action Bar - Added refresh button */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-8 bg-white/10 backdrop-blur-2xl border border-white/20 px-8 py-4 rounded-3xl shadow-2xl"
        >
          <div className="flex items-baseline gap-2 border-r border-white/10 pr-8">
            <span className="text-2xl font-light text-white">{availableCount}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Ready</span>
          </div>
          <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-emerald-400 transition-colors">
            <Calendar size={16} />
            Instant Booking
          </button>
          <button 
            onClick={() => dispatch(fetchTables())} 
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-emerald-400 transition-colors"
            aria-label="Refresh table data"
          >
            <RefreshCcw size={16} />
            Refresh
          </button>
        </motion.div>

        {/* Table Detail Drawer/Modal - Improved with outside click close and better accessibility */}
        <AnimatePresence>
          {selectedTable && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
              aria-modal="true"
              role="dialog"
            >
              <div ref={modalRef} className="w-full max-w-4xl h-3/4 bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl shadow-2xl p-8 lg:p-12 overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-5xl font-light text-white">{selectedTable.name}</h3>
                  <button onClick={() => setSelectedTable(null)} className="text-white hover:text-emerald-400 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Close modal">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column: Details */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-bold text-slate-300 mb-2">Current Status</h4>
                      <p className={`text-3xl font-extrabold ${
                        selectedTable.status === 'AVAILABLE' ? 'text-emerald-400' :
                        selectedTable.status === 'OCCUPIED' ? 'text-rose-400' :
                        selectedTable.status === 'RESERVED' ? 'text-amber-400' :
                        'text-slate-400'
                      }`}>
                        {selectedTable.status}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-300 mb-2">Seating Capacity</h4>
                      <div className="flex items-center gap-2 text-white">
                        <Users size={20} />
                        <span className="text-xl font-medium">{selectedTable.seats} People</span>
                      </div>
                    </div>

                    {selectedTable.assignedWaiter && (
                      <div>
                        <h4 className="text-lg font-bold text-slate-300 mb-2">Assigned Service Staff</h4>
                        <div className="flex items-center gap-3 bg-white/5 rounded-full p-2 pr-4 border border-white/10">
                          <span className="text-white text-lg font-medium">{selectedTable.assignedWaiter.name}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: QR Code */}
                  <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h4 className="text-lg font-bold text-slate-300 mb-4">Scan for Menu & Order</h4>
                    {selectedTable.qrCodeUrl ? (
                      <img 
                        src={selectedTable.qrCodeUrl} 
                        alt={`QR Code for ${selectedTable.name}`} 
                        className="w-48 h-48 rounded-lg shadow-lg bg-white p-2" 
                      />
                    ) : (
                      <div className="w-48 h-48 flex flex-col items-center justify-center bg-white/5 text-slate-400 rounded-lg">
                        <QrCode size={48} />
                        <p className="text-sm mt-2">QR Code not available</p>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 mt-4 text-center">
                      Guests can scan this code to view the digital menu and place orders directly.
                    </p>
                  </div>
                </div>

                <div className="mt-12 text-center">
                  <button className="flex items-center justify-center gap-3 text-sm font-black uppercase tracking-[0.2em] bg-emerald-500 text-slate-950 px-8 py-4 rounded-full hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                    <Calendar size={18} />
                    Book this table
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}