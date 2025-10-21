import React, { useEffect, useState } from 'react';
import { getPrices, updatePrice, getPayments, adminLogout } from '../utils/adminApi';
import PriceCard from '../components/admin/PriceCard';
import PaymentsTable from '../components/admin/PaymentsTable';
import EditPriceModal from '../components/admin/EditPriceModal';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard(){
  const nav = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem('admin_token');
    const expires = parseInt(localStorage.getItem('admin_expires') || '0',10);
    if (!token || Date.now()/1000 > expires) {
      localStorage.clear();
      nav('/admin/login');
    }
  },[]);

  const [prices,setPrices] = useState([]);
  const [loading,setLoading] = useState(false);
  const [selected,setSelected] = useState(null);
  const [paymentsState,setPaymentsState] = useState({data:[],total:0,page:1,pageSize:10,q:''});

  const fetchPrices = async ()=>{
    setLoading(true);
    const res = await getPrices();
    if (res.success) setPrices(res.data || []);
    setLoading(false);
  };

  const fetchPayments = async (page=1,pageSize=10,q='')=>{
    const res = await getPayments(page,pageSize,q);
    if (res.success) setPaymentsState(s=>({...s, data: res.data, total: res.total, page: res.page, pageSize: res.pageSize}));
  };

  useEffect(()=>{ fetchPrices(); fetchPayments(); }, []);

  const onEdit = (priceItem) => setSelected(priceItem);

  const onSavePrice = async (id, unit_price) => {
    const res = await updatePrice(id, unit_price);
    if (res.success) {
      await fetchPrices();
      setSelected(null);
    } else {
      alert(res.message || 'Error');
    }
  };

  const handleLogout = async ()=>{
    await adminLogout();
    localStorage.clear();
    nav('/admin/login');
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Signed as {localStorage.getItem('admin_user')}</div>
          <button onClick={handleLogout} className="px-3 py-1 rounded-lg bg-red-600 text-white">Logout</button>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Services & Prices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {prices.map(p => <PriceCard key={p.id} price={p} onEdit={()=>onEdit(p)} />)}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Payments</h2>
        <PaymentsTable state={paymentsState} onFetch={fetchPayments} />
      </section>

      {selected && <EditPriceModal price={selected} onClose={()=>setSelected(null)} onSave={onSavePrice} />}
    </div>
  );
}
