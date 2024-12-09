"use client"
import CircularLoading from "@/app/_components/CircularLoading";
import { useState } from "react";

export default function WithdrawForm({updateSaldo}: {updateSaldo: (nominal: number) => void}) {
    const [loading, setLoading] = useState(false);
    const [successNotification, setSuccessNotification] = useState(false);
    const [failedNotification, setFailedNotification] = useState(false);
    const [failedMessage, setFailedMessage] = useState('Silahkan coba lagi');

    const [noRek, setNoRek] = useState('');
    const [nominal, setNominal] = useState(-1);
    const [bank, setBank] = useState("none");

    function onBankChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setBank(event.target.value);
    }

    async function handleTarik() {
        if (bank === 'none' || noRek.length < 10 || noRek.length > 20) {
            setFailedMessage(
                bank === 'none' ? 'Pilihan bank tidak boleh kosong' :
                noRek.length < 10 || noRek.length > 20 ? 'Nomor rekening tidak valid' :
                'Silahkan coba lagi'
            );
            showNotification(false);
            return;
        }

        if (Number.isNaN(nominal) || nominal < 1 || nominal > 1000000000 || !Number.isInteger(nominal)) {
            setFailedMessage(
                Number.isNaN(nominal) ? 'Nominal bukan sebuah angka' :
                nominal < 1 || nominal > 1000000000 ? 'Nominal tidak valid' :
                'Nominal harus berupa bilangan bulat positif'
            );
            showNotification(false);
            return;
        }

        setLoading(true);

        const response = await fetch('/api/tr-mypay/withdraw', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                date: new Date().toLocaleString('id-ID', {
                    timeZone: 'Asia/Jakarta',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }).split('/').reverse().join('-'),
                bank: bank,
                noRek: noRek,
                nominal: nominal
            })
        });
    
        if (!response.ok) {
            const responseBody = await response.json();
            setFailedMessage(responseBody?.error || 'Unknown error');
            showNotification(false);
            setLoading(false);
            return;
        }

        setTimeout(() => {
            setLoading(false);
        }, 500);
    
        updateSaldo(-nominal);   // Update saldo locally first
        
        setNominal(-1);
        setNoRek('');
        setBank('none');

        showNotification(true);
    }

    function showNotification(success: boolean) {
        if (success) {
            setSuccessNotification(true);
            setTimeout(() => {
                setSuccessNotification(false);
            }, 2000);
        } else {
            setFailedNotification(true);
            setTimeout(() => {
                setFailedNotification(false);
            }, 2000);
        }
    }
    
    return (
        <>
            <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-3 bg-green-600 text-white rounded-md shadow-lg transition-transform duration-500 ease-in-out ${successNotification ? 'translate-y-24' : '-translate-y-full'}`} style={{ zIndex: 99 }}>
                <span className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Withdraw Berhasil
                </span>
            </div>
            <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 p-3 bg-red-600 text-white rounded-md shadow-lg transition-transform duration-500 ease-in-out ${failedNotification ? 'translate-y-24' : '-translate-y-full'}`} style={{ zIndex: 99 }}>
                <span className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    Withdraw Gagal. {failedMessage}.
                </span>
            </div>
            <div className="flex flex-col my-8">
                <p className="text-lg font-semibold my-3">Bank</p>
                <select id="bank" className="py-3 h-min bg-zinc-800 pl-4 border-r-[16px] border-zinc-800 outline outline-2 outline-zinc-700 rounded-xl" onChange={onBankChange} value={bank}>
                    <option value="none" disabled>Pilih bank</option>
                    <option value="bca">Bank Central Asia</option>
                    <option value="mandiri">Bank Mandiri</option>
                    <option value="bni">Bank Negara Indonesia</option>
                    <option value="gopay">GoPay</option>
                    <option value="ovo">OVO</option>
                </select>
                <p className="text-lg font-semibold my-3 mt-6">Nomor Rekening</p>
                <input type="number" id="norek" name="norek" value={noRek}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                            setNoRek(value);
                        }
                    }}
                    className="py-3 px-3 border border-gray-600 rounded-lg bg-transparent text-base focus:outline focus:outline-blue-500 
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <p className="text-lg font-semibold my-3 mt-6">Nominal</p>
                <input type="number" id="nominal" name="nominal" value={Number.isNaN(nominal) ? '' : nominal < 0 ? '' : nominal} onChange={(e) => setNominal(parseInt(e.target.value))} step="1" min="0"
                    className="py-3 px-3 border border-gray-600 rounded-lg bg-transparent text-base focus:outline focus:outline-blue-500 
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    onKeyDown={(e) => {if (e.key === '.' || e.key === 'e' || e.key === '-') e.preventDefault();}}
                />
                <div className="flex md:justify-end mt-10 md:mt-8" >
                    <button
                        type="submit"
                        className="md:w-36 w-full py-3 bg-zinc-100 text-black font-semibold rounded-2xl shadow-lg hover:bg-white"
                        onClick={(e) => { e.preventDefault(); if(!loading) handleTarik(); }}
                    >
                        {loading ? <CircularLoading black={true} size={`6`} /> : 'Tarik'}
                    </button>
                </div>
            </div>
        </>
    );
}
