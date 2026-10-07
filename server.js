const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Pengiriman (In-Memory Data)
let shipments = {
    'PRB-8821': {
        type: 'Shipment STT',
        code: 'PRB-8821',
        sender: 'PT Industri Jaya (Jakarta)',
        receiver: 'CV Sukses Mandiri (Surabaya)',
        fleet: 'Truk 01 - B 9821 PRB (Supir: Bpk. Herman)',
        status: 'DALAM PERJALANAN',
        lat: -6.2305,
        lng: 106.9984,
        timeline: [
            { time: '07 Okt 2026 - 18:30 WIB', desc: 'Armada melewati Rest Area Tol Palimanan' },
            { time: '07 Okt 2026 - 12:00 WIB', desc: 'Keberangkatan armada dari Pool Pusat Jakarta' }
        ]
    }
};

// API Get Tracking Data
app.get('/api/track/:id', (req, res) => {
    const id = req.params.id.toUpperCase();
    if (shipments[id]) {
        res.json({ success: true, data: shipments[id] });
    } else {
        res.status(404).json({ success: false, message: 'Nomor Resi / DO tidak ditemukan!' });
    }
});

// API Admin - Add / Update Shipment
app.post('/api/admin/update', (req, res) => {
    const { code, type, sender, receiver, fleet, status, lat, lng, logDesc } = req.body;
    
    if (!code) {
        return res.status(400).json({ success: false, message: 'Kode Resi/DO wajib diisi!' });
    }

    const now = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    if (!shipments[code]) {
        shipments[code] = {
            type: type || 'Shipment STT',
            code: code.toUpperCase(),
            sender: sender || '-',
            receiver: receiver || '-',
            fleet: fleet || '-',
            status: status || 'DALAM PERJALANAN',
            lat: parseFloat(lat) || -6.2305,
            lng: parseFloat(lng) || 106.9984,
            timeline: []
        };
    } else {
        if (status) shipments[code].status = status;
        if (lat) shipments[code].lat = parseFloat(lat);
        if (lng) shipments[code].lng = parseFloat(lng);
    }

    if (logDesc) {
        shipments[code].timeline.unshift({
            time: `${now} WIB`,
            desc: logDesc
        });
    }

    res.json({ success: true, message: 'Data berhasil diperbarui!', data: shipments[code] });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`================================================`);
    console.log(` Server CV PARAMBOS RAYA Aktif!`);
    console.log(` Akses Utama: http://localhost:${PORT}`);
    console.log(` Akses Admin: http://localhost:${PORT}/admin.html`);
    console.log(`================================================`);
});
