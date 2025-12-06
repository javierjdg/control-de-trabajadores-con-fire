
import React, { useState, useMemo } from 'react';
import { WorkReport } from '../App';
import { PlusIcon, SearchIcon, WalletIcon, EditIcon, FileTextIcon } from './icons';

interface TechDashboardProps {
  reports: WorkReport[];
  onNewReport: () => void;
  onEditReport: (report: WorkReport) => void;
}

const TechDashboard: React.FC<TechDashboardProps> = ({ reports, onNewReport, onEditReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');

  // Filter reports based on search inputs
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesTerm = 
        r.projectNum.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = searchDate ? r.date === searchDate : true;

      return matchesTerm && matchesDate;
    });
  }, [reports, searchTerm, searchDate]);

  // Calculate total expenses for the filtered view
  const totalExpenses = useMemo(() => {
    return filteredReports.reduce((total, r) => {
      const dailySum = r.expenses.food + r.expenses.gas + r.expenses.parking + r.expenses.others;
      return total + dailySum;
    }, 0);
  }, [filteredReports]);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Action Button */}
      <button
        onClick={onNewReport}
        className="w-full bg-gradient-to-r from-brand-teal to-teal-600 hover:from-teal-500 hover:to-teal-400 text-white p-6 rounded-2xl shadow-lg transform transition active:scale-95 flex flex-col items-center justify-center gap-3 border border-teal-500/30"
      >
        <PlusIcon className="w-12 h-12 text-brand-lime" />
        <span className="text-xl font-bold">Nuevo Parte de Trabajo</span>
      </button>

      {/* Stats / Expense Wallet */}
      <div className="bg-brand-panel p-5 rounded-2xl border border-gray-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <WalletIcon className="w-24 h-24 text-brand-lime" />
        </div>
        <h3 className="text-gray-400 font-medium mb-1 uppercase text-xs tracking-wider flex items-center gap-2">
            <WalletIcon className="w-4 h-4 text-brand-lime" /> Mis Gastos (Vista Actual)
        </h3>
        <div className="text-3xl font-bold text-white mb-2">
            {totalExpenses.toFixed(2)} €
        </div>
        <p className="text-xs text-gray-500">
            {filteredReports.length} partes encontrados con los filtros actuales.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 space-y-3">
        <div className="relative">
            <input 
                type="text" 
                placeholder="Buscar obra, nº parte..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-brand-teal outline-none placeholder-gray-500"
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
                <SearchIcon className="w-5 h-5" />
            </div>
        </div>
        <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-500 whitespace-nowrap">Filtrar Fecha:</span>
            <input 
                type="date" 
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-brand-teal outline-none text-sm"
            />
            {searchDate && (
                <button onClick={() => setSearchDate('')} className="text-xs text-brand-lime underline">Borrar</button>
            )}
        </div>
      </div>

      {/* Results List */}
      <div>
        <h3 className="text-gray-400 font-medium mb-3 uppercase text-sm tracking-wider flex items-center gap-2">
          <FileTextIcon className="w-4 h-4 text-brand-lime" /> Historial de Partes
        </h3>
        <div className="space-y-3">
          {filteredReports.map(report => (
            <div key={report.id} className="bg-brand-panel p-4 rounded-xl border border-gray-700 flex justify-between items-center group hover:border-brand-teal/50 transition-colors shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-lime text-lg">{report.date}</span>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">ID: {report.id.slice(-4)}</span>
                </div>
                <div className="text-sm text-gray-300 mt-1">Obra: <span className="text-white font-mono">{report.projectNum}</span></div>
                <div className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{report.description}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xs text-gray-400">{report.startTime} - {report.endTime}</div>
                <button 
                  onClick={() => onEditReport(report)}
                  className="p-2 bg-gray-800 hover:bg-brand-teal rounded-lg text-gray-300 hover:text-white transition-colors border border-gray-700"
                  title="Editar Parte"
                >
                  <EditIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          {filteredReports.length === 0 && (
            <div className="text-center py-8 bg-brand-panel rounded-xl border border-gray-800 border-dashed">
                <p className="text-gray-500 mb-2">No se encontraron partes.</p>
                {(searchTerm || searchDate) && <p className="text-xs text-gray-600">Prueba a cambiar los filtros de búsqueda.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechDashboard;
