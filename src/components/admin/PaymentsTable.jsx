import React, { useEffect, useState } from 'react';
import { updatePaymentStatus } from '../../utils/adminApi';

export default function PaymentsTable({state, onFetch}) {
  const [page,setPage] = useState(state.page || 1);
  const [q,setQ] = useState('');
  const [pageSize] = useState(state.pageSize || 10);

  useEffect(()=> { onFetch(page,pageSize,q); }, [page]);
  useEffect(()=> { setPage(state.page || 1); }, [state.page]);

  const changeStatus = async (id, status) => {
    const res = await updatePaymentStatus(id,status);
    if (res.success) onFetch(page,q);
  };

  const onSearch = ()=> { setPage(1); onFetch(1,pageSize,q); };

  return (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
      <div className="flex gap-2 mb-3">
        <input type="text" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search username or tx" className="flex-1 p-2 rounded-xl bg-white/10" />
        <button onClick={onSearch} className="px-3 py-2 rounded-xl bg-blue-600 text-white">Search</button>
      </div>

      <div className="overflow-x-auto rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="p-2">Order</th><th>User</th><th>Service</th><th>Amount</th><th>Price</th><th>Status</th><th>When</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {state.data.map(row => (
              <tr key={row.id} className="border-t border-white/5">
                <td className="py-2 px-2">{row.transaction_id}</td>
                <td className="px-2">{row.username}</td>
                <td className="px-2">{row.service}</td>
                <td className="px-2">{row.amount}</td>
                <td className="px-2">{Number(row.price_uzs).toLocaleString()}</td>
                <td className="px-2">{row.status}</td>
                <td className="px-2">{row.created_at}</td>
                <td className="px-2">
                  <div className="flex gap-1">
                    <button onClick={()=>changeStatus(row.id,'paid')} className="px-2 py-1 bg-green-600 text-white rounded">Paid</button>
                    <button onClick={()=>changeStatus(row.id,'cancelled')} className="px-2 py-1 bg-red-600 text-white rounded">Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">Total: {state.total}</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>{ if(page>1) setPage(page-1)}} className="px-3 py-1 rounded bg-white/10">Prev</button>
          <div className="px-3 py-1 rounded bg-white/10">{page}</div>
          <button onClick={()=>{ setPage(page+1)}} className="px-3 py-1 rounded bg-white/10">Next</button>
        </div>
      </div>
    </div>
  );
}
