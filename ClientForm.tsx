import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Ajusta la ruta si es necesario

export default function ClientForm() {
  const [partners, setPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceType, setServiceType] = useState('car'); // car o boat

  // 1. Cargar los socios activos desde Supabase al abrir el formulario
  useEffect(() => {
    async function loadPartners() {
      const { data, error } = await supabase
        .from('partners')
        .select('id, business_name')
        .eq('status', 'active');

      if (error) {
        console.error('Error al cargar socios:', error.message);
      } else {
        setPartners(data || []);
      }
    }
    loadPartners();
  }, []);

  // 2. Enviar los datos del cliente y asociarlos al socio seleccionado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('referrals').insert([
      {
        client_name: clientName,
        client_phone: clientPhone,
        service_type: serviceType,
        partner_id: selectedPartner, // Aquí se guarda la relación exacta que creaste en Supabase
        status: 'pending'
      }
    ]);

    if (error) {
      alert('Hubo un error al registrar: ' + error.message);
    } else {
      alert('¡Registro de cliente exitoso y vinculado al socio!');
      // Limpiar formulario
      setClientName('');
      setClientPhone('');
      setSelectedPartner('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-slate-900 text-white rounded-xl">
      <h3 className="text-xl font-bold">Registro de Cliente Referido</h3>

      <div>
        <label className="block text-sm mb-1">Nombre del Cliente</label>
        <input 
          type="text" 
          value={clientName} 
          onChange={(e) => setClientName(e.target.value)} 
          required
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Teléfono del Cliente</label>
        <input 
          type="tel" 
          value={clientPhone} 
          onChange={(e) => setClientPhone(e.target.value)} 
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Tipo de Servicio</label>
        <select 
          value={serviceType} 
          onChange={(e) => setServiceType(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
        >
          <option value="car">Automóvil (Car)</option>
          <option value="boat">Embarcación (Boat)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">¿Qué socio te refirió?</label>
        <select 
          value={selectedPartner} 
          onChange={(e) => setSelectedPartner(e.target.value)} 
          required
          className="w-full p-2 rounded bg-slate-800 border border-slate-700"
        >
          <option value="">Selecciona una empresa socia...</option>
          {partners.map((p) => (
            <option key={p.id} value={p.id}>
              {p.business_name}
            </option>
          ))}
        </select>
      </div>

      <button 
        type="submit" 
        className="w-full py-2 bg-amber-500 hover:bg-amber-600 font-bold rounded text-slate-950 transition-colors"
      >
        Guardar Referido
      </button>
    </form>
  );
}
