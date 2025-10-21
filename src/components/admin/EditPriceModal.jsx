import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function EditPriceModal({price,onClose,onSave}){
  const [val,setVal] = useState(price.unit_price);
  const [saving,setSaving] = useState(false);

  const save = async ()=>{
    setSaving(true);
    await onSave(price.id, parseFloat(val));
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}} className="w-[90%] max-w-md p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10">
        <h3 className="text-lg font-semibold mb-3">Edit {price.service}</h3>
        <input type="number" value={val} onChange={e=>setVal(e.target.value)} className="w-full p-3 rounded-xl mb-3 bg-white/10" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-gray-600 text-white">Cancel</button>
          <button onClick={save} disabled={saving} className="px-3 py-1 rounded-lg bg-blue-600 text-white">{saving?"Saving...":"Save"}</button>
        </div>
      </motion.div>
    </div>
  );
}
